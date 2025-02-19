import CredentialsSignInForm from '@/components/credentials-signin-form'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Sign In',
    description: 'Sign in to your account',
}

const SignInPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl: string }>
}) => {
    const session = await auth()
    const { callbackUrl } = await searchParams

    if (session) {
        return redirect(callbackUrl || '/')
    }

    return (
        <div className='w-full max-w-md mx-auto'>
            <Card>
                <CardHeader className='space-y-4 '>
                    <Link href='/' className='flex-center'>
                        <Image
                            src='/images/logo.svg'
                            height={100}
                            width={100}
                            alt={`${APP_NAME} logo`}
                            priority
                        />
                    </Link>
                    <CardTitle className='text-center'>Sign In</CardTitle>
                    <CardDescription className='text-center'>
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <CredentialsSignInForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignInPage
