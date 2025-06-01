import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'secretkey'

async function getUserIdFromReq(req: Request) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.split(' ')[1]
  try {
    const data = jwt.verify(token, JWT_SECRET) as { id: string }
    return data.id
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || '1')
  const limit = Number(url.searchParams.get('limit') || '10')
  const userId = await getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [total, appointments] = await Promise.all([
    prisma.appointment.count(),
    prisma.appointment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { enteredBy: true },
      orderBy: { date: 'desc' },
    }),
  ])

  return NextResponse.json({ total, appointments })
}

export async function POST(req: Request) {
  const userId = await getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const appointment = await prisma.appointment.create({
    data: {
      patientName: body.patientName,
      age: body.age,
      sex: body.sex,
      address: body.address,
      phoneNumber: body.phoneNumber,
      isNew: body.isNew,
      date: new Date(body.date),
      amount: body.amount,
      enteredById: userId,
    },
  })

  return NextResponse.json(appointment)
}

export async function PUT(req: Request) {
  const userId = await getUserIdFromReq(req)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const appt = await prisma.appointment.findUnique({ where: { id: body.id } })
  if (!appt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (appt.enteredById !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const updated = await prisma.appointment.update({
    where: { id: body.id },
    data: {
      patientName: body.patientName,
      age: body.age,
      sex: body.sex,
      address: body.address,
      phoneNumber: body.phoneNumber,
      isNew: body.isNew,
      date: new Date(body.date),
      amount: body.amount,
    },
  })

  return NextResponse.json(updated)
}
