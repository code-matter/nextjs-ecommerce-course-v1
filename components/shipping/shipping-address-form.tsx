'use client'
import { ShippingAddress } from '@/types/shipping'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useTransition } from 'react'
import { shippingAddressSchema } from '@/types/shipping'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControllerRenderProps, Path, useForm } from 'react-hook-form'
import { z } from 'zod'
import { SHIPPING_ADDRESS_DEFAULT_VALUES } from '@/lib/constants'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ArrowRight, Loader } from 'lucide-react'

type Props = {
    address: ShippingAddress
}

const ShippingAddressForm = ({ address }: Props) => {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || SHIPPING_ADDRESS_DEFAULT_VALUES,
    })

    const onSubmit = (values: ShippingAddress) => {
        console.log('values', values)
    }

    return (
        <>
            <div className='max-w-md mx-auto space-y-4'>
                <h1 className='h2-bold mt-4'>Shipping Address</h1>
                <p className='text-small text-muted-foreground'>
                    Please enter an address to ship to
                </p>
                <Form {...form}>
                    <form
                        method='post'
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='fullName'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'fullName'
                                    >
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter full name'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'city'
                                    >
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter address'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='city'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'city'
                                    >
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter city'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='postalCode'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'postalCode'
                                    >
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter postal code'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex flex-col gap-5 md:flex-row'>
                            <FormField
                                control={form.control}
                                name='country'
                                render={({
                                    field,
                                }: {
                                    field: ControllerRenderProps<
                                        z.infer<typeof shippingAddressSchema>,
                                        'country'
                                    >
                                }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter country'
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='flex gap-2'>
                            <Button type='submit' disabled={isPending}>
                                {isPending ? (
                                    <Loader className='w-4 h-4 animate-spin' />
                                ) : (
                                    <ArrowRight className='h-4 w-4' />
                                )}{' '}
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default ShippingAddressForm
