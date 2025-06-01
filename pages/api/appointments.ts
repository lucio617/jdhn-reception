import prisma from '../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getUserFromRequest(req)
  if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        skip,
        take: limit,
        include: { enteredBy: { select: { email: true } } },
        orderBy: { date: 'desc' },
      }),
      prisma.appointment.count(),
    ])

    return res.status(200).json({ appointments, total, page, limit })
  } else if (req.method === 'POST') {
    const { patientName, age, sex, address, phoneNumber, isNew, date, amount } = req.body

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        age,
        sex,
        address,
        phoneNumber,
        isNew,
        date: new Date(date),
        amount,
        enteredById: currentUser.id,
      },
    })

    // send confirmation email to admins etc (optional)

    return res.status(201).json(appointment)
  } else if (req.method === 'PUT') {
    const { id, patientName, age, sex, address, phoneNumber, isNew, date, amount } = req.body

    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })

    // Only allow editing if current user is creator
    if (appointment.enteredById !== currentUser.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { patientName, age, sex, address, phoneNumber, isNew, date: new Date(date), amount },
    })

    return res.status(200).json(updated)
  } else if (req.method === 'DELETE') {
    const { id } = req.body

    const appointment = await prisma.appointment.findUnique({ where: { id } })
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })

    // Admin or creator can delete
    if (currentUser.role !== 'ADMIN' && appointment.enteredById !== currentUser.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await prisma.appointment.delete({ where: { id } })

    return res.status(204).end()
  }

  res.status(405).end()
}
