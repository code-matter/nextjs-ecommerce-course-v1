'use client'
import { Cart, CartItem } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Plus, Minus, Loader } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { addToCart, removeFromCart } from '@/lib/actions/cart.action'
import { useTransition } from 'react'

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
    const router = useRouter()
    const { toast } = useToast()
    const [isPending, startTransition] = useTransition()

    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addToCart(item)
            if (!res?.success) {
                toast({ variant: 'destructive', description: res?.message })
                return
            }
            toast({
                description: res?.message,
                action: (
                    <ToastAction
                        className='bg-primary text-blue-900 hover:bg-gray-800 hover:text-white'
                        altText='Go To Cart'
                        onClick={() => router.push('/cart')}
                    >
                        Go To Cart
                    </ToastAction>
                ),
            })
        })
    }

    const existItem =
        cart && cart.items.find(c => c.product_id === item.product_id)

    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeFromCart(item.product_id)

            toast({
                variant: res?.success ? 'default' : 'destructive',
                description: res?.message,
            })
            return
        })
    }

    return existItem ? (
        <div className='flex items-center justify-center'>
            <Button
                type='button'
                variant='outline'
                onClick={handleRemoveFromCart}
            >
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Minus className='h-4 w-4' />
                )}
            </Button>
            <span className='px-2'>{existItem.qty}</span>
            <Button type='button' variant='outline' onClick={handleAddToCart}>
                {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                ) : (
                    <Plus className='h-4 w-4' />
                )}
            </Button>
        </div>
    ) : (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
            ) : (
                <>
                    {' '}
                    <Plus /> Add To Cart
                </>
            )}
        </Button>
    )
}
export default AddToCart
