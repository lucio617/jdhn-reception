// /pages/api/me.ts
import { getUserFromRequest } from '../../lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  res.status(200).json({ role: user.role, email: user.email })
}
