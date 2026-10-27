// src/app/api/bookings/[id]/route.ts
// PATCH: Cancelación lógica de reservas con validación de 2 horas de anticipación

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/get-user-session';
import { Role, BookingStatus } from '@prisma/client';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Reglas 9 y 14: Solo el dueño de la reserva o un Administrador puede cancelarla
    const isOwner: boolean = booking.userId === user.userId;
    const isAdmin: boolean = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes autorización para cancelar esta reserva' },
        { status: 403 }
      );
    }

    // Verificar si ya estaba cancelada
    if (booking.status === BookingStatus.CANCELLED) {
      return NextResponse.json({ error: 'La reserva ya se encuentra cancelada' }, { status: 400 });
    }

    // Regla 10: Un usuario regular solo puede cancelar con hasta 2 horas de anticipación
    if (!isAdmin) {
      const now = new Date();
      const hoursUntilStart = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntilStart < 2) {
        return NextResponse.json(
          { error: 'Solo puedes cancelar tu reserva con un mínimo de 2 horas de anticipación' },
          { status: 400 }
        );
      }
    }

    // Regla 11: Se actualiza el estado a CANCELLED (borrado lógico, no se elimina de la base de datos)
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });

    return NextResponse.json(
      { message: 'Reserva cancelada exitosamente', booking: cancelledBooking },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    return NextResponse.json({ error: 'Error al cancelar la reserva' }, { status: 500 });
  }
}