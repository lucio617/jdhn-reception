import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const receptionists = await prisma.user.findMany({ where: { role: 'RECEPTIONIST' } })
  return NextResponse.json(receptionists)
}

export async function POST(req: Request) {
  const body = await req.json()
  const hash = await bcrypt.hash(body.password, 10)
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      password: hash,
      role: 'RECEPTIONIST',
    },
  })
  return NextResponse.json(newUser)
}

export async function DELETE(req: Request) {
  const body = await req.json()
  await prisma.user.delete({ where: { id: body.id } })
  return new Response(null, { status: 204 })
}
