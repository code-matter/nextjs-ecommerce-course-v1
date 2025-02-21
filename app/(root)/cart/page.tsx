import CartTable from '@/components/cart/cart-table'
import { Metadata } from 'next'
import React from 'react'
import { getCart } from '@/lib/actions/cart.action'

export const metadata: Metadata = {
    title: 'Shopping Cart',
}

const CartPage = async () => {
    const cart = await getCart()

    return (
        <>
            <CartTable cart={cart} />
        </>
    )
}

export default CartPage
