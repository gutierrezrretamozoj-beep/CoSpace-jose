// src/app/(public)/spaces/page.tsx
// Catálogo de espacios activos con Server-Side Rendering (SSR)

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { SpaceType } from '@prisma/client';

interface SpaceItem {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  pricePerHour: number;
  imageUrl: string;
  isActive: boolean;
}

const typeLabels: Record<SpaceType, string> = {
  DESK: 'Escritorio Flexible',
  MEETING_ROOM: 'Sala de Reuniones',
  BOOTH: 'Cabina Insonorizada',
};

export default async function SpacesPage() {
  // Consulta directa a Prisma para espacios activos (Regla 12)
  const spaces: SpaceItem[] = await prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
      {/* Encabezado del catálogo */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Espacios de Trabajo Disponibles
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Selecciona el entorno ideal para tu jornada y reserva tus horas con confirmación en tiempo real.
        </p>
      </div>

      {spaces.length === 0 ? (
        <div className="aurora-glass-card rounded-2xl p-12 text-center max-w-lg mx-auto">
          <p className="text-slate-400 text-lg">
            No hay espacios activos disponibles en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spaces.map((space: SpaceItem) => (
            <div
              key={space.id}
              className="aurora-glass-card rounded-2xl overflow-hidden flex flex-col group"
            >
              {/* Imagen con dimensiones seguras */}
              <div
                className="relative w-full overflow-hidden bg-slate-900"
                style={{ position: 'relative', width: '100%', height: '224px', maxHeight: '224px', overflow: 'hidden' }}
              >
                <Image
                  src={space.imageUrl}
                  alt={space.name}
                  width={600}
                  height={350}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060411] via-transparent to-transparent opacity-80" />
                
                {/* Insignia de tipo */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/85 text-purple-200 border border-purple-500/40 backdrop-blur-md shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    {typeLabels[space.type] || space.type}
                  </span>
                </div>

                {/* Precio por hora con alto contraste */}
                <div className="absolute bottom-3 right-4 bg-slate-950/90 border border-purple-500/40 px-3.5 py-1 rounded-xl backdrop-blur-md shadow-md">
                  <span className="text-lg font-black text-cyan-300">
                    ${space.pricePerHour.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-200 font-medium"> / hora</span>
                </div>
              </div>

              {/* Contenido descriptivo con tipografía nítida */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {space.name}
                  </h2>
                  <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed mb-6 font-normal">
                    {space.description}
                  </p>
                </div>

                {/* Botón de acción */}
                <Link
                  href={`/spaces/${space.id}`}
                  className="w-full text-center py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.25)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-98"
                >
                  Ver Detalles y Reservar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
