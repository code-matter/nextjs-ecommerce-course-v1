'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ProductImages = ({ images }: { images: string[] }) => {
    const [currentImage, setCurrentImage] = useState<number>(0)

    return (
        <div className='space-y-4'>
            <Image
                src={images[currentImage]}
                width={1000}
                height={1000}
                alt={images[0]}
                className='min-h-[300px] object-cover object-center'
            />
            <div className='flex'>
                {images.map((image, index) => (
                    <div
                        key={image}
                        onClick={() => setCurrentImage(index)}
                        className={cn(
                            'border mr-2 cursor-pointer hover:border-orange-600',
                            currentImage === index && 'border-orange-500',
                        )}
                    >
                        <Image
                            src={image}
                            alt={image}
                            width={100}
                            height={100}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImages
