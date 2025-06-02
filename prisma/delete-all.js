const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Delete all appointments first
  await prisma.appointment.deleteMany()
  console.log('✅ All appointments deleted')

  // Now delete all users
  await prisma.user.deleteMany()
  console.log('✅ All users deleted')
}

main()
  .catch((e) => {
    console.error('❌ Error deleting data:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
