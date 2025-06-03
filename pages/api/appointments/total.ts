// pages/api/appointments/total.ts
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const result = await prisma.appointment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
  })

  res.json({ total: result._sum.amount || 0 })
}
