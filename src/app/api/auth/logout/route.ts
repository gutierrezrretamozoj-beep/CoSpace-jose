// src/app/api/auth/logout/route.ts
// Cierre de sesión: revoca el hash en base de datos y destruye las cookies

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken } from '@/lib/auth';

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken: string | undefined = cookieStore.get('refreshToken')?.value;

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload) {
        // Revocación técnica sin fallar si el usuario no existe
        await prisma.user.updateMany({
          where: { id: payload.userId },
          data: { refreshToken: null },
        });
      }
    }

    const response = NextResponse.json(
      { message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    );

    // Limpieza explícita de cookies en el encabezado de respuesta
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
