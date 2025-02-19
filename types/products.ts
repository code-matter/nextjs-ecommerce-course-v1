import { formatDecimals } from '@/lib/utils'
import { z } from 'zod'

export const currency = z
    .string()
    .refine(
        value => /^\d+(\.\d{2})?$/.test(formatDecimals(Number(value))),
        'Price must have exactly 2 decimals',
    )

export const ProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(3, 'Category must be at least 3 characters'),
    brand: z.string().min(3, 'Brand must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least 1 image'),
    isFeatured: z.boolean(),
    banner: z.ostring().nullable(),
    price: currency,
})

export type Product = z.infer<typeof ProductSchema> & {
    id: string
    rating: string
    createdAt: Date
}
