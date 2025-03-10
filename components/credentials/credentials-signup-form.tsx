'use client'

import { SIGN_UP_DEFAULT_VALUES } from '@/lib/constants'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import Link from 'next/link'
import { signUpUser } from '@/lib/actions/user.action'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'

const CredentialsSignUpForm = () => {
    const [data, action] = useActionState(signUpUser, {
        success: false,
        message: '',
    })

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const SignUpButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button disabled={pending} className='w-full' variant='default'>
                {pending ? 'Submitting...' : 'Sign Up'}
            </Button>
        )
    }

    return (
        <form action={action}>
            <input type='hidden' name='callbackUrl' value={callbackUrl} />
            <div className='space-y-6'>
                <div>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        type='text'
                        id='name'
                        name='name'
                        required
                        autoComplete='name'
                        defaultValue={SIGN_UP_DEFAULT_VALUES.name}
                    />
                </div>
                <div>
                    <Label htmlFor='emai'>Email</Label>
                    <Input
                        type='email'
                        id='email'
                        name='email'
                        required
                        autoComplete='email'
                        defaultValue={SIGN_UP_DEFAULT_VALUES.email}
                    />
                </div>
                <div>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        type='password'
                        id='password'
                        name='password'
                        required
                        autoComplete='password'
                        defaultValue={SIGN_UP_DEFAULT_VALUES.password}
                    />
                </div>
                <div>
                    <Label htmlFor='confirmPassword'>Confirm Password</Label>
                    <Input
                        type='password'
                        id='confirmPassword'
                        name='confirmPassword'
                        required
                        autoComplete='confirmPassword'
                        defaultValue={SIGN_UP_DEFAULT_VALUES.password}
                    />
                </div>
                <div>
                    <SignUpButton />
                </div>
                {data && !data.success && (
                    <div className='text-center text-destructive'>
                        {data.message}
                    </div>
                )}
                <div className='text-small text-center text-muted-foreground'>
                    Already have an account ?{' '}
                    <Link href='/sign-in' target='_self' className='link'>
                        Sign In
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default CredentialsSignUpForm
