import { getProductBySlug } from '@/lib/actions/product.action'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import ProductPrice from '@/components/shared/product/product-price'
import ProductImages from '@/components/shared/product/product-images'
import AddToCart from '@/components/shared/product/add-to-cart'

const ProductDetailsPage = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const { slug } = await params
    const product = await getProductBySlug(slug)

    if (!product) return notFound()

    return (
        <>
            <section>
                <div className='grid grid-cols-1 md:grid-cols-5'>
                    <div className='col-span-2'>
                        <ProductImages images={product.images} />
                    </div>
                    <div className='col-span-2 p-5'>
                        {/* details */}
                        <div className='flex flex-col gap-6'>
                            <p>
                                {product.brand} {product.category}
                            </p>
                            <h1 className='h3-bold'>{product.name}</h1>
                            <p>
                                {product.rating} out of {product.numReviews}{' '}
                                Reviews
                            </p>
                            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                                <ProductPrice
                                    value={Number(product.price)}
                                    className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                                />
                            </div>
                        </div>
                        <div className='mt-10'>
                            <p className='font-semibold'>Description</p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardContent className='p-4'>
                                <div className='mb-2 flex justify-between'>
                                    <div>Price</div>
                                    <div>
                                        <ProductPrice
                                            value={Number(product.price)}
                                        />
                                    </div>
                                </div>
                                <div className='mb-2 flex justify-between'>
                                    <div>Status</div>
                                    {product.stock > 0 ? (
                                        <Badge
                                            variant='outline'
                                            color='success'
                                        >
                                            In Stock
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant='destructive'
                                            color='danger'
                                        >
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>
                                {product.stock > 0 && (
                                    <div className='flex-center'>
                                        <AddToCart
                                            item={{
                                                product_id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                slug: product.slug,
                                                qty: 1,
                                                image: product.images[0],
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductDetailsPage
