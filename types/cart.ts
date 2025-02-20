import { z } from 'zod'
import { currency } from './products'

export const cartItemSchema = z.object({
    product_id: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
})

export const cartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.ostring().nullable(),
})

export type Cart = z.infer<typeof cartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
