import { PrismaClient } from '@prisma/client'
import sampleData from './sample-data'

const main = async () => {
    try {
        const prisma = new PrismaClient()
        await prisma.product.deleteMany()
        await prisma.account.deleteMany()
        await prisma.session.deleteMany()
        await prisma.verificationToken.deleteMany()
        await prisma.user.deleteMany()

        await prisma.product.createMany({ data: sampleData.products })
        await prisma.user.createMany({ data: sampleData.users })
    } catch (error) {
        console.error(error)
    } finally {
        console.log('Database seeded successfully')
    }
}

main()
