'use server'
import { signInFormSchema } from '@/types/auth'
import { signIn, signOut } from '@/auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

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
