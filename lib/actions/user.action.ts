'use server'
import { signInFormSchema, signUpFormSchema } from '@/types/auth'
import { auth, signIn, signOut } from '@/auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { prisma } from '@/db/prisma'
import { formatError } from '@/lib/utils'
import { hash } from '@/lib/encrypt'
import { ShippingAddress, shippingAddressSchema } from '@/types/shipping'

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

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findFirst({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    return user
}

export const updateUserAddress = async (data: ShippingAddress) => {
    try {
        const session = await auth()
        if (!session) throw new Error('Session not found')
        const currentUser = await prisma.user.findFirst({
            where: { id: session?.user?.id },
        })
        if (!currentUser) throw new Error('User not found')

        const address = shippingAddressSchema.parse(data)
        await prisma.user.update({
            where: { id: currentUser.id },
            data: { address },
        })
        return { success: true, message: 'User address updated successfully' }
    } catch (error) {
        return { success: false, message: formatError(error) }
    }
}
