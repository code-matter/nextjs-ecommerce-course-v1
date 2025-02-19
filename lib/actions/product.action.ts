'use server'

import { convertToPlainObj } from '../utils'
import { LATEST_PRODUCTS_LIMIT } from '../constants'
import { prisma } from '@/db/prisma'

// Get latest products
export const getLatestProducts = async () => {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: { createdAt: 'desc' },
    })

    return convertToPlainObj(data)
}

// Get product by slug
export const getProductBySlug = async (slug: string) => {
    const data = await prisma.product.findUnique({
        where: { slug },
    })

    return convertToPlainObj(data)
}
