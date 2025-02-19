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
import CredentialsSignUpForm from '@/components/credentials-signup-form'

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Create your account today!',
}

const SignUpPage = async ({
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
                    <CardTitle className='text-center'>
                        Create an account
                    </CardTitle>
                    <CardDescription className='text-center'>
                        Enter your information below to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <CredentialsSignUpForm />
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUpPage
