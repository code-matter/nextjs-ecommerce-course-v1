import { auth } from '@/auth'
import { getCart } from '@/lib/actions/cart.action'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShippingAddress } from '@/types/shipping'
import { getUserById } from '@/lib/actions/user.action'
import ShippingAddressForm from '@/components/shipping/shipping-address-form'

export const metadata: Metadata = {
    title: 'Shipping Address',
}

const ShippingAddressPage = async () => {
    const cart = await getCart()
    if (!cart || cart.items.length === 0) {
        redirect('/cart')
    }
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
        throw new Error('User not found')
    }
    const user = await getUserById(userId)

    return (
        <>
            <ShippingAddressForm address={user.address as ShippingAddress} />
        </>
    )
}

export default ShippingAddressPage
