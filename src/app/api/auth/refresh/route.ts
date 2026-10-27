// src/app/api/auth/refresh/route.ts
// Renovación del access token mediante la cookie refreshToken

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifyRefreshToken, signAccessToken, TokenPayload } from '@/lib/auth';

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const currentRefreshToken: string | undefined = cookieStore.get('refreshToken')?.value;

    if (!currentRefreshToken) {
      return NextResponse.json(
        { error: 'No se proporcionó token de renovación' },
        { status: 401 }
      );
    }

    // 1. Validar expiración y firma criptográfica
    const payload = verifyRefreshToken(currentRefreshToken);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token de renovación inválido o expirado' },
        { status: 403 }
      );
    }

    // 2. Buscar usuario y verificar que no haya sido revocado en base de datos
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      return NextResponse.json(
        { error: 'Sesión revocada o usuario inexistente' },
        { status: 403 }
      );
    }

    // 3. Comparar el token recibido con el hash guardado en Supabase
    const isTokenMatching: boolean = await bcrypt.compare(currentRefreshToken, user.refreshToken);
    if (!isTokenMatching) {
      return NextResponse.json(
        { error: 'Token de renovación no coincide' },
        { status: 403 }
      );
    }

    // 4. Emitir un nuevo Access Token manteniendo el Refresh Token
    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const newAccessToken: string = signAccessToken(newPayload);

    const isProd: boolean = process.env.NODE_ENV === 'production';
    const response = NextResponse.json(
      { message: 'Token renovado con éxito' },
      { status: 200 }
    );

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error('Error al renovar token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
