import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

export interface AuthPayload {
  id: string
  email: string
  role: 'ADMIN' | 'RECEPTIONIST'
}

export function getUserFromRequest(req: NextApiRequest): AuthPayload | null {
  const token = req.cookies.token
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as AuthPayload
  } catch {
    return null
  }
}
