// src/app/api/bookings/route.ts
// GET: Listar reservas del usuario autenticado (Regla 14)
// POST: Crear reserva con validación atómica de Reglas 1 a 8

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/get-user-session';
import { BookingStatus } from '@prisma/client';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Regla 14: Solo retorna las reservas del usuario en sesión
    const bookings = await prisma.booking.findMany({
      where: { userId: user.userId },
      include: {
        Space: {
          select: { name: true, type: true, imageUrl: true, pricePerHour: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json({ error: 'Error al obtener las reservas' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: 'Debes iniciar sesión para reservar' }, { status: 401 });
    }

    const { spaceId, startTime, endTime } = await request.json();

    if (!spaceId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Datos de reserva incompletos' }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Formato de fecha inválido' }, { status: 400 });
    }

    // Regla 3: No reservar en el pasado ni con más de 30 días de anticipación
    const maxFutureDate = new Date();
    maxFutureDate.setDate(now.getDate() + 30);

    if (start <= now) {
      return NextResponse.json({ error: 'No se puede reservar en el pasado' }, { status: 400 });
    }

    if (start > maxFutureDate) {
      return NextResponse.json(
        { error: 'No se puede reservar con más de 30 días de anticipación' },
        { status: 400 }
      );
    }

    // Regla 1: Duración entre 1 y 4 horas completas (ej: 10:00 a 12:00, no 10:30 a 11:45)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const areExactHours =
      start.getMinutes() === 0 &&
      start.getSeconds() === 0 &&
      end.getMinutes() === 0 &&
      end.getSeconds() === 0;

    if (!areExactHours || durationHours < 1 || durationHours > 4 || !Number.isInteger(durationHours)) {
      return NextResponse.json(
        { error: 'La reserva debe ser en horas completas y durar entre 1 y 4 horas' },
        { status: 400 }
      );
    }

    // Regla 2: Solo se puede reservar entre las 7:00 y las 21:00
    // Soporte seguro para ISO UTC (formato estándar de frontend) y hora local
    const isIsoUtc = typeof startTime === 'string' && startTime.includes('Z');
    const startHour = isIsoUtc ? start.getUTCHours() : start.getHours();
    const endHour = isIsoUtc ? end.getUTCHours() : end.getHours();
    const endMinutes = isIsoUtc ? end.getUTCMinutes() : end.getMinutes();

    if (startHour < 7 || endHour > 21 || (endHour === 21 && endMinutes > 0)) {
      return NextResponse.json(
        { error: 'El horario permitido para reservar es exclusivamente entre 7:00 y 21:00' },
        { status: 400 }
      );
    }

    // Regla 7: No se puede reservar un espacio desactivado
    const space = await prisma.space.findUnique({ where: { id: spaceId } });
    if (!space || !space.isActive) {
      return NextResponse.json(
        { error: 'El espacio solicitado no existe o se encuentra inactivo' },
        { status: 404 }
      );
    }

    // Regla 8: El precio total lo calcula estrictamente el servidor
    const totalPrice = space.pricePerHour * durationHours;

    // Transacción atómica interactiva: Evita condiciones de carrera (Overbooking)
    const result = await prisma.$transaction(async (tx) => {
      // Regla 6: Máximo 3 reservas futuras confirmadas por usuario
      const futureBookingsCount = await tx.booking.count({
        where: {
          userId: user.userId,
          status: BookingStatus.CONFIRMED,
          startTime: { gt: now },
        },
      });

      if (futureBookingsCount >= 3) {
        return {
          error: 'Límite alcanzado: solo puedes tener un máximo de 3 reservas futuras confirmadas',
          status: 400,
        };
      }

      // Regla 4: No solapamiento en el espacio
      const spaceConflict = await tx.booking.findFirst({
        where: {
          spaceId,
          status: BookingStatus.CONFIRMED,
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      });

      if (spaceConflict) {
        return {
          error: 'El espacio ya se encuentra reservado en el horario seleccionado',
          status: 409,
        };
      }

      // Regla 5: El usuario no puede tener dos reservas solapadas en espacios diferentes
      const userConflict = await tx.booking.findFirst({
        where: {
          userId: user.userId,
          status: BookingStatus.CONFIRMED,
          AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
        },
      });

      if (userConflict) {
        return {
          error: 'Ya tienes otra reserva confirmada en ese mismo rango horario',
          status: 409,
        };
      }

      // Inserción atómica garantizada
      const createdBooking = await tx.booking.create({
        data: {
          userId: user.userId,
          spaceId,
          startTime: start,
          endTime: end,
          totalPrice,
          status: BookingStatus.CONFIRMED,
        },
      });

      return { booking: createdBooking, status: 201 };
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.booking, { status: 201 });
  } catch (error) {
    console.error('Error al procesar reserva:', error);
    return NextResponse.json({ error: 'Error interno al procesar la reserva' }, { status: 500 });
  }
}

