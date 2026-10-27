// src/app/(public)/page.tsx
// Landing page con fidelidad total a la maqueta Dreamy Aurora & Stardust

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

interface SpaceCard {
  id: string;
  name: string;
  description: string;
  type: string;
  pricePerHour: number;
  imageUrl: string;
  isActive: boolean;
}

// 6 espacios idénticos a los del mockup con fotografías luminosas de Unsplash
const DEFAULT_MOCK_SPACES: SpaceCard[] = [
  {
    id: 'space-desk-1',
    name: 'Espacio de trabajo',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'DESK',
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80',
    isActive: true,
  },
  {
    id: 'space-room-1',
    name: 'Sala de reuniones',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'DESK',
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    isActive: true,
  },
  {
    id: 'space-room-2',
    name: 'Sala de reuniones',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'SALA',
    pricePerHour: 11,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    isActive: true,
  },
  {
    id: 'space-desk-2',
    name: 'Espacio de trabajo',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'DESK',
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    isActive: true,
  },
  {
    id: 'space-room-3',
    name: 'Sala de reuniones',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'DESK',
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    isActive: true,
  },
  {
    id: 'space-room-4',
    name: 'Sala de reuniones',
    description: 'Reserva escritorios compartidos, salas de juntas y cabinas insonorizadas en cuestión de segundos ...',
    type: 'SALA',
    pricePerHour: 15,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    isActive: true,
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [spaces, setSpaces] = useState<SpaceCard[]>(DEFAULT_MOCK_SPACES);

  useEffect(() => {
    let isMounted = true;
    async function loadSpaces() {
      try {
        const res = await fetch('/api/spaces');
        if (res.ok) {
          const data = await res.json() as SpaceCard[];
          if (isMounted && data.length > 0) {
            setSpaces(data);
          }
        }
      } catch {
        // Mantiene los 6 espacios por defecto de la maqueta
      }
    }
    void loadSpaces();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* ======================================================== */}
        {/* COLUMNA IZQUIERDA: HERO TEXT                             */}
        {/* Tipografía de máximo contraste para que nunca se pierda  */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-5 pr-0 lg:pr-6">
          <h1 className="text-4xl sm:text-5xl xl:text-[54px] font-black tracking-tight text-white leading-[1.12] mb-5 drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
            Tu espacio de trabajo <br className="hidden xl:inline" />
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-300 bg-clip-text text-transparent">
              ideal, por horas
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-md mb-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            {t.home.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Botón Explorar Espacios (Cyan luminoso #00a6ff) */}
            <Link
              href="/spaces"
              className="px-7 py-3 rounded-full font-bold text-sm text-white bg-[#00a6ff] hover:bg-[#0092e0] shadow-[0_4px_22px_rgba(0,166,255,0.6)] hover:shadow-[0_6px_28px_rgba(0,166,255,0.75)] transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              {t.home.ctaSpaces}
            </Link>

            {/* Botón Explorar por Mapa con alto contraste */}
            <Link
              href="/spaces"
              className="px-7 py-3 rounded-full font-bold text-sm text-white border border-white/35 bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all active:scale-95 shadow-sm"
            >
              Explorar por Mapa
            </Link>

            {/* Acceso Directo a Iniciar Sesión en el Hero */}
            <Link
              href="/login"
              className="px-6 py-3 rounded-full font-bold text-sm text-cyan-300 hover:text-white border border-cyan-400/40 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(56,189,248,0.25)]"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMNA DERECHA: CATÁLOGO DE ESPACIOS (CUADRÍCULA 3x2)  */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Catálogo de Espacios
            </h2>
            <Link
              href="/spaces"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Ver todos →
            </Link>
          </div>

          {/* Cuadrícula de 3 columnas idéntica a la maqueta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {spaces.slice(0, 6).map((space) => (
              <div
                key={space.id}
                className="aurora-glass-card group"
              >
                {/* Imagen del espacio con contenedor estricto */}
                <div
                  className="relative w-full overflow-hidden rounded-t-2xl bg-slate-900"
                  style={{ position: 'relative', width: '100%', height: '144px', maxHeight: '144px', overflow: 'hidden' }}
                >
                  <Image
                    src={space.imageUrl}
                    alt={space.name}
                    width={500}
                    height={280}
                    priority={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                  {/* Insignia izquierda (Tipo: DESK / SALA) */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white text-slate-950 shadow-md">
                      {space.type === 'MEETING_ROOM' ? 'SALA' : space.type}
                    </span>
                  </div>

                  {/* Insignia derecha (Disponible en verde pastel) */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#dcfce7] text-[#14532d] shadow-md">
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Contenido inferior de la tarjeta con colores nítidos */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 truncate">
                      {space.name}
                    </h3>
                    <p className="text-[12px] text-slate-200 line-clamp-2 leading-relaxed mb-3 font-normal">
                      {space.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-300 block font-medium leading-none mb-0.5 uppercase tracking-wider">
                        Desde
                      </span>
                      <span className="text-sm font-black text-white">
                        ${space.pricePerHour}
                        <span className="text-[11px] font-normal text-slate-300">/hr</span>
                      </span>
                    </div>

                    {/* Botón Reservar Cyan luminoso */}
                    <Link
                      href={`/spaces/${space.id}`}
                      className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#00a6ff] hover:bg-[#0092e0] shadow-[0_2px_12px_rgba(0,166,255,0.5)] hover:shadow-[0_4px_16px_rgba(0,166,255,0.75)] transition-all transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Reservar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
