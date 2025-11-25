import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCounts() {
  const counts = {
    tribes: await prisma.tribe.count({ where: { deletedAt: null } }),
    resources: await prisma.resource.count({ where: { deletedAt: null } }),
    scholarships: await prisma.scholarship.count({ where: { deletedAt: null } }),
  }

  console.log('📊 Current Database Counts:')
  console.log(JSON.stringify(counts, null, 2))
}

checkCounts()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
