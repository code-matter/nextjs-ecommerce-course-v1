'use server'
import { CartItem, cartItemSchema, cartSchema } from '@/types/cart'
import { cookies } from 'next/headers'
import { convertToPlainObj, formatError, roundPrice } from '../utils'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export const calcPrice = async (items: CartItem[]) => {
    const itemsPrice = roundPrice(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    )
    const shippingPrice = roundPrice(itemsPrice > 100 ? 0 : 10)
    const taxPrice = roundPrice(itemsPrice * 0.15)
    const totalPrice = roundPrice(itemsPrice + shippingPrice + taxPrice)
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}

export const addToCart = async (data: CartItem) => {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('Cart session not found')
        }
        const session = await auth()
        const userId = session?.user?.id
            ? (session?.user?.id as string)
            : undefined
        const cart = await getCart()
        const item = cartItemSchema.parse(data)

        const product = await prisma.product.findFirst({
            where: { id: item.product_id },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        if (!cart) {
            const newCart = cartSchema.parse({
                userId,
                items: [item],
                sessionCartId,
                ...(await calcPrice([item])),
            })
            await prisma.cart.create({
                data: newCart,
            })

            revalidatePath(`/product/${product.slug}`)
            return { success: true, message: `${product.name} added to cart` }
        } else {
            const productAlreadyExists = (cart.items as CartItem[]).find(
                currentItem => currentItem.product_id === item.product_id,
            )

            if (productAlreadyExists) {
                if (product.stock < productAlreadyExists.qty + 1) {
                    throw new Error('Not enough stock')
                }

                ;(cart.items as CartItem[]).find(
                    currentItem => currentItem.product_id === item.product_id,
                )!.qty = productAlreadyExists.qty + 1
            } else {
                if (product.stock < 1) {
                    throw new Error('Not enough stock')
                }
                cart.items.push(item)
            }

            await prisma.cart.update({
                where: { id: cart.id },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...(await calcPrice(cart.items as CartItem[])),
                },
            })
            revalidatePath(`/product/${product.slug}`)

            return {
                success: true,
                message: `${product.name} ${productAlreadyExists ? 'updated in' : 'added to'} cart`,
            }
        }
    } catch (error) {
        console.log(error)
        return { success: false, message: formatError(error) }
    }
}

export const getCart = async () => {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) {
        throw new Error('Cart session not found')
    }
    const session = await auth()
    const userId = session?.user?.id ? (session?.user?.id as string) : undefined

    const cart = await prisma.cart.findFirst({
        where: userId ? { userId } : { sessionCartId },
    })
    if (!cart) return undefined
    return convertToPlainObj({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    })
}

export const removeFromCart = async (productId: string) => {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value
        if (!sessionCartId) {
            throw new Error('Cart session not found')
        }
        const product = await prisma.product.findFirst({
            where: { id: productId },
        })
        if (!product) throw new Error('Product not found')
        const cart = await getCart()
        if (!cart) throw new Error('Cart not found')

        const productExist = (cart.items as CartItem[]).find(
            c => c.product_id === productId,
        )
        if (!productExist) throw new Error('Item not found')

        if (productExist.qty === 1) {
            cart.items = (cart.items as CartItem[]).filter(
                i => i.product_id !== productExist.product_id,
            )
        } else {
            ;(cart.items as CartItem[]).find(
                i => i.product_id === productId,
            )!.qty = productExist.qty - 1
        }

        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...(await calcPrice(cart.items as CartItem[])),
            },
        })
        revalidatePath(`/product/${product.slug}`)
        return {
            success: true,
            message: `${product.name} was removed from cart`,
        }
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        }
    }
}
