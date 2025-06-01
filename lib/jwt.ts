import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!)

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (err) {
    console.error('❌ jwt verify failed:', err)
    throw err
  }
}
