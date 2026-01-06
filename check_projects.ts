
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    try {
        const count = await prisma.project.count()
        console.log('Project count:', count)
        const projects = await prisma.project.findMany()
        console.log(JSON.stringify(projects, null, 2))
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}
main()
