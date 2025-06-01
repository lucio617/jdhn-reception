import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/jwt'

export const config = {
  matcher: ['/dashboard/:path*', '/appointments/:path*', '/receptionists/:path*','/'],
}

export async function middleware(req: NextRequest) {
  // ❌ Don't await this — it's not a Promise
  const rawCookie = req.cookies.get('token')
  const token = typeof rawCookie === 'string' ? rawCookie : rawCookie?.value

  if (req.nextUrl.pathname === '/') {
    console.log("if executed")
  req.nextUrl.pathname = '/login'
  return NextResponse.redirect(req.nextUrl)
}

  const url = req.nextUrl.clone()

  if (!token) {
    console.log('🚫 Token absent')
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  try {
    await verifyToken(token)
  } catch (err) {
    console.error('❌ jwt verify failed:', err)
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
