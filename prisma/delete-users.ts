// prisma/delete-users.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany()
  console.log('✅ All users deleted')
}

main()
  .catch((e) => {
    console.error('❌ Error deleting users:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
