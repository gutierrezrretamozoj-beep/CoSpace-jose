// src/app/(admin)/layout.tsx
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Barra superior administrativa dedicada */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060411]/90 border-b border-fuchsia-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_12px_#ec4899] group-hover:scale-125 transition-transform" />
              <span className="text-xl font-black tracking-tight text-white group-hover:text-fuchsia-300 transition-colors">
                CoSpace
              </span>
            </Link>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-700/50 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              href="/spaces"
              className="text-slate-300 hover:text-fuchsia-300 transition-colors"
            >
              Ver Catálogo
            </Link>
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-fuchsia-300 transition-colors"
            >
              Mis Reservas
            </Link>
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
            >
              ← Salir al Inicio
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}
