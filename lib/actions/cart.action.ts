'use server'
import { CartItem } from '@/types/cart'

export const addToCart = async (item: CartItem) => {
    return { success: true, message: 'Item added to cart' }
}
