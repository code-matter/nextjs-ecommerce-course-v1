import { cn } from '@/lib/utils'

const ProductPrice = ({
    value,
    className,
}: {
    value: number
    className?: string
}) => {
    const stringValue = value.toFixed(2)
    const [int, float] = stringValue.split('.')
    return (
        <p className={cn('text-2xl', className)}>
            <span className='text-xs align-super'>$</span>
            {int}
            <span className='text-xs align-super'>.{float}</span>
        </p>
    )
}

export default ProductPrice
