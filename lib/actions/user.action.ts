'use server'
import { signInFormSchema, signUpFormSchema } from '@/types/auth'
import { signIn, signOut } from '@/auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { prisma } from '@/db/prisma'
import { formatError } from '@/lib/utils'
import { hash } from '@/lib/encrypt'

export const signInWithCredentials = async (
    prevState: unknown,
    formData: FormData,
) => {
    try {
        const user = signInFormSchema.parse({
            email: formData.get('email') as string,
            password: formData.get('password') as string,
        })
        await signIn('credentials', user)
        return { sucess: true, message: 'Signed in successfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: 'Invalid credentials' }
    }
}

export const signOutUser = async () => await signOut()

export const signUpUser = async (prevState: unknown, formData: FormData) => {
    try {
        const user = signUpFormSchema.parse({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string,
        })
        const hashedPassword = await hash(user.password)

        await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
            },
        })

        await signIn('credentials', {
            email: user.email,
            password: user.password,
        })

        return { success: true, message: 'Signed up successfully' }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { success: false, message: formatError(error) }
    }
}
