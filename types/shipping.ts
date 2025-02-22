import { z } from 'zod'

export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z
        .string()
        .min(3, 'Street address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    latitude: z.onumber(),
    longitude: z.onumber(),
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>
