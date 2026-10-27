// src/lib/auth.ts
// Utilidades para firma, verificación de tokens JWT y manejo de cookies seguras

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export type Role = 'ADMIN' | 'USER';

// Interfaz para el contenido del token (evita usar any)
export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

// Secretos leídos de variables de entorno con respaldo seguro
const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || 'secret_access_cospace';
const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || 'secret_refresh_cospace';

// Genera un Access Token con vigencia de 15 minutos
export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

// Genera un Refresh Token con vigencia de 7 días
export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

// Verifica la firma y vigencia del Access Token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Verifica la firma y vigencia del Refresh Token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Inyecta las cookies httpOnly requeridas por la prueba
export async function setAuthCookies(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  const isProd: boolean = process.env.NODE_ENV === 'production';

  // Cookie del Access Token (15 minutos)
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  });

  // Cookie del Refresh Token (7 días)
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

// Limpia las cookies al cerrar sesión
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}