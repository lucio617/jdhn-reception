import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { userId: 'admin@example.com' },
    update: {},
    create: {
      userId: 'admin',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created: admin / admin123')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
