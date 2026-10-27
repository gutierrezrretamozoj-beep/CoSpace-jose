// src/app/api/auth/me/route.ts
// Obtiene el estado de sesión actual del usuario a partir de cookies

import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/get-user-session';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}

