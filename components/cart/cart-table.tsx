'use client'
import React from 'react'
import { Cart, CartItem } from '@/types/cart'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useTransition } from 'react'
import { addToCart, removeFromCart } from '@/lib/actions/cart.action'
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/ui/table'
import { Button } from '../ui/button'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
    cart?: Cart
}

const CartTable = ({ cart }: Props) => {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    return (
        <>
            <h1 className='py-2 h2-bold'>Shopping Cart</h1>
            {!cart || cart.items.length === 0 ? (
                <div>
                    Cart is empty. <Link href='/'>Go Shopping</Link>
                </div>
            ) : (
                <div className='grid md:grid-cols-4 md:gap-5'>
                    <div className='overflow-x-auto md:col-span-3'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className='text-center'>
                                        Quantity
                                    </TableHead>
                                    <TableHead className='text-right'>
                                        Price
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.items.map((item: CartItem) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link
                                                className='flex items-center'
                                                href={`/product/${item.slug}`}
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                />
                                                <span className='px-2'>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className='flex-center gap-2'>
                                            <Button
                                                disabled={isPending}
                                                variant='outline'
                                                type='button'
                                                onClick={() => {
                                                    startTransition(
                                                        async () => {
                                                            const res =
                                                                await removeFromCart(
                                                                    item.product_id,
                                                                )
                                                            if (!res.success) {
                                                                toast({
                                                                    variant:
                                                                        'destructive',
                                                                    description:
                                                                        res.message,
                                                                })
                                                            }
                                                        },
                                                    )
                                                }}
                                            >
                                                {isPending ? (
                                                    <Loader className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Minus />
                                                )}
                                            </Button>
                                            <span>{item.qty}</span>
                                            <Button
                                                disabled={isPending}
                                                variant='outline'
                                                type='button'
                                                onClick={() => {
                                                    startTransition(
                                                        async () => {
                                                            const res =
                                                                await addToCart(
                                                                    item,
                                                                )
                                                            if (!res.success) {
                                                                toast({
                                                                    variant:
                                                                        'default',
                                                                    description:
                                                                        res.message,
                                                                })
                                                            }
                                                        },
                                                    )
                                                }}
                                            >
                                                {isPending ? (
                                                    <Loader className='w-4 h-4 animate-spin' />
                                                ) : (
                                                    <Plus />
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            ${item.price}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Card>
                        <CardContent className='p-4 gap-4'>
                            <div className='pb-3 text-xl'>
                                Subtotal (
                                {cart.items.reduce(
                                    (acc, result) => acc + result.qty,
                                    0,
                                )}
                                ):{' '}
                                <span className='font-bold'>
                                    {formatCurrency(cart.itemsPrice)}
                                </span>
                            </div>
                            <Button
                                className='w-full'
                                disabled={isPending}
                                onClick={() =>
                                    startTransition(() =>
                                        router.push('/shipping-address'),
                                    )
                                }
                            >
                                {isPending ? (
                                    <Loader className='h-4 w-4 animate-spin' />
                                ) : (
                                    <ArrowRight className='w-4 h-4' />
                                )}{' '}
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}

export default CartTable
