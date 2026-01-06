
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pCount = await prisma.project.count();
    const sCount = await prisma.service.count();
    console.log('Projects:', pCount);
    console.log('Services:', sCount);

    const services = await prisma.service.findMany();
    console.log('Service Data:', JSON.stringify(services, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
