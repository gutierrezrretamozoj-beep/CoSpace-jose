// src/app/(public)/spaces/[id]/page.tsx
// Vista detallada de espacio individual (SSR) con formulario de reserva

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SpaceType } from '@prisma/client';
import BookingForm from './BookingForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const typeLabels: Record<SpaceType, string> = {
  DESK: 'Escritorio Flexible',
  MEETING_ROOM: 'Sala de Reuniones Ejecutiva',
  BOOTH: 'Cabina Insonorizada',
};

export default async function SpaceDetailPage({ params }: PageProps) {
  // En Next.js 16 los parámetros son una Promesa
  const { id } = await params;

  // Consulta directa a la base de datos
  const space = await prisma.space.findUnique({
    where: { id },
  });

  // Validación 404 si el espacio no existe o se encuentra inactivo
  if (!space || !space.isActive) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">
      {/* Botón de regreso */}
      <Link
        href="/spaces"
        className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al catálogo de espacios
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Columna Izquierda: Información e Imagen del Espacio */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aurora-glass-card rounded-2xl overflow-hidden">
            <div
              className="relative w-full bg-slate-900 overflow-hidden"
              style={{ position: 'relative', width: '100%', height: '380px', maxHeight: '380px', overflow: 'hidden' }}
            >
              <Image
                src={space.imageUrl}
                alt={space.name}
                width={800}
                height={480}
                priority
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060411] via-transparent to-transparent opacity-80" />

              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/90 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.4)] backdrop-blur-md">
                  {typeLabels[space.type] || space.type}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">
                {space.name}
              </h1>
              <p className="text-slate-200 text-base leading-relaxed font-normal mb-6 whitespace-pre-line">
                {space.description}
              </p>

              <div className="pt-6 border-t border-purple-900/40 flex items-center justify-between">
                <span className="text-sm text-slate-300 font-medium">Tarifa fija por hora:</span>
                <span className="text-2xl font-black text-cyan-300">
                  ${space.pricePerHour.toFixed(2)} <span className="text-xs text-slate-300 font-normal">USD</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Reserva */}
        <div className="lg:col-span-5">
          <div className="aurora-glass-card rounded-2xl p-6 sm:p-8 sticky top-24">
            <div className="mb-6 pb-4 border-b border-purple-900/40">
              <h2 className="text-xl font-bold text-white">
                Reserva tu Horario
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Disponibilidad inmediata en bloques de 1 a 4 horas.
              </p>
            </div>

            <BookingForm
              spaceId={space.id}
              pricePerHour={space.pricePerHour}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
