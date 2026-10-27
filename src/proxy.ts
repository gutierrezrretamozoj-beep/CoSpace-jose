// src/proxy.ts
// Lógica de inspección de cookies y redirección para rutas privadas y administrativas

import { NextRequest, NextResponse } from 'next/server';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
  exp?: number;
}

function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr) as TokenPayload;
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;

  const user = accessToken ? decodeToken(accessToken) : null;

  // 1. Protección de rutas de administrador (/admin)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 2. Protección de rutas de usuario (/dashboard)
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

// Se aplica en dashboard y admin
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
