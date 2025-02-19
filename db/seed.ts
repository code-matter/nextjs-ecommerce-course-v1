import { PrismaClient } from '@prisma/client'
import sampleData from './sample-data'

const main = async () => {
    try {
        const prisma = new PrismaClient()
        await prisma.product.deleteMany()

        await prisma.product.createMany({ data: sampleData.products })
    } catch (error) {
        console.error(error)
    } finally {
        console.log('Database seeded successfully')
    }
}

main()
