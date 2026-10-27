// src/lib/get-user-session.ts
// Helper de backend para extraer y verificar la sesión en los Route Handlers

import { cookies } from 'next/headers';
import { verifyAccessToken, TokenPayload } from './auth';

export async function getUserSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  return verifyAccessToken(token);
}