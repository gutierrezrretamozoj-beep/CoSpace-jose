// src/app/api/spaces/[id]/route.ts
// GET: Ver detalle de espacio individual
// PATCH: Editar y desactivar espacio con validación de reservas futuras (Regla 13)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/get-user-session';
import { Role, SpaceType, BookingStatus } from '@prisma/client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const space = await prisma.space.findUnique({
      where: { id },
    });

    if (!space) {
      return NextResponse.json({ error: 'Espacio no encontrado' }, { status: 404 });
    }

    return NextResponse.json(space, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el espacio:', error);
    return NextResponse.json({ error: 'Error al obtener el espacio' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const user = await getUserSession();

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, type, pricePerHour, imageUrl, isActive } = body;

    // Validación de tipo si se envía
    if (type !== undefined) {
      const validTypes = Object.values(SpaceType);
      if (!validTypes.includes(type as SpaceType)) {
        return NextResponse.json(
          { error: `Tipo de espacio inválido. Debe ser uno de: ${validTypes.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Validación de precio si se envía
    if (pricePerHour !== undefined) {
      const parsedPrice = Number(pricePerHour);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return NextResponse.json(
          { error: 'El precio por hora debe ser un número positivo' },
          { status: 400 }
        );
      }
    }

    // Regla 13: No se puede desactivar un espacio con reservas futuras confirmadas
    if (isActive === false) {
      const now = new Date();
      const futureBookingsCount = await prisma.booking.count({
        where: {
          spaceId: id,
          status: BookingStatus.CONFIRMED,
          startTime: { gt: now },
        },
      });

      if (futureBookingsCount > 0) {
        return NextResponse.json(
          { error: 'No se puede desactivar un espacio que tiene reservas futuras confirmadas' },
          { status: 409 }
        );
      }
    }

    const updatedSpace = await prisma.space.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(type && { type: type as SpaceType }),
        ...(pricePerHour !== undefined && { pricePerHour: Number(pricePerHour) }),
        ...(imageUrl && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updatedSpace, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el espacio:', error);
    return NextResponse.json({ error: 'Error al actualizar el espacio' }, { status: 500 });
  }
}
