'use client'
import { CartItem } from '@/types/cart'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { addToCart } from '@/lib/actions/cart.action'

const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter()
    const { toast } = useToast()

    const handleAddToCart = async () => {
        const res = await addToCart(item)
        if (!res.success) {
            toast({ variant: 'destructive', description: res.message })
            return
        }
        toast({
            description: `${item.name} added to cart`,
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
    }

    return (
        <Button className='w-full' type='button' onClick={handleAddToCart}>
            <Plus /> Add To Cart
        </Button>
    )
}
export default AddToCart
