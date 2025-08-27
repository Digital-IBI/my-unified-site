import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = ['/ops', '/api/ops']

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
}

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Ops Panel", charset="UTF-8"' }
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!isProtected(pathname)) return NextResponse.next()
  const auth = req.headers.get('authorization')
  if (!auth || !auth.startsWith('Basic ')) return unauthorized()
  try {
    const [, b64] = auth.split(' ')
    const [user, pass] = Buffer.from(b64, 'base64').toString().split(':')
    const expectedUser = process.env.OPS_BASIC_AUTH_USER
    const expectedPass = process.env.OPS_BASIC_AUTH_PASS
    if (!expectedUser || !expectedPass) return unauthorized()
    if (user !== expectedUser || pass !== expectedPass) return unauthorized()
    return NextResponse.next()
  } catch {
    return unauthorized()
  }
}

export const config = { matcher: ['/ops/:path*', '/api/ops/:path*'] }
