// src/app/api/spaces/route.ts
// GET: Catálogo público (activos) o completo si es admin
// POST: Crear nuevo espacio (Solo ADMIN)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/get-user-session';
import { Role, SpaceType } from '@prisma/client';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    const isAdmin: boolean = user?.role === Role.ADMIN;

    // Regla 12: Si no es admin, solo devuelve espacios activos
    const spaces = await prisma.space.findMany({
      where: isAdmin ? undefined : { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(spaces, { status: 200 });
  } catch (error) {
    console.error('Error al obtener los espacios:', error);
    return NextResponse.json({ error: 'Error al obtener los espacios' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await getUserSession();

    // Verificación de rol y sesión independiente del proxy
    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, type, pricePerHour, imageUrl } = body;

    // Validación de datos requeridos
    if (!name || !description || !type || !pricePerHour || !imageUrl) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Validación estricta del tipo de espacio
    const validTypes = Object.values(SpaceType);
    if (!validTypes.includes(type as SpaceType)) {
      return NextResponse.json(
        { error: `Tipo de espacio inválido. Debe ser uno de: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const parsedPrice = Number(pricePerHour);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'El precio por hora debe ser un número positivo' },
        { status: 400 }
      );
    }

    const newSpace = await prisma.space.create({
      data: {
        name,
        description,
        type: type as SpaceType,
        pricePerHour: parsedPrice,
        imageUrl,
        isActive: true,
      },
    });

    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    console.error('Error al crear el espacio:', error);
    return NextResponse.json({ error: 'Error al crear el espacio' }, { status: 500 });
  }
}
