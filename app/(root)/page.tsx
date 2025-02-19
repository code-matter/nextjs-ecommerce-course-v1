import ProductList from '@/components/shared/product/product-lits'
import { getLatestProducts } from '@/lib/actions/product.action'

const Home = async () => {
    const latestProducts = await getLatestProducts()

    return (
        <>
            <ProductList data={latestProducts} title='Newest Arrivals!' />
        </>
    )
}

export default Home
