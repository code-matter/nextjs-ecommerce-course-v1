import { z } from 'zod'

export const signInFormSchema = z.object({
    email: z.string().email('Invalid Email Address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})
