// src/components/Footer.tsx
// Pie de página compartido con diseño Dreamy Aurora

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-900/30 bg-[#070514]/90 backdrop-blur-xl py-6 text-center text-xs text-slate-400 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Identidad de la marca */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc]" />
          <span className="font-bold text-slate-200">CoSpace Aurora</span>
        </div>

        {/* Créditos técnicos con texto legible */}
        <p className="text-slate-300 font-medium">
          © 2026 CoSpace. Diseñado con Next.js 16, Prisma y Supabase.
        </p>

        {/* Estado operativo cósmico */}
        <div className="text-[11px] text-purple-300 bg-purple-950/70 px-3.5 py-1 rounded-full border border-purple-800/50 shadow-[0_0_10px_rgba(192,132,252,0.25)]">
          Sistema de Reservas Activo
        </div>
      </div>
    </footer>
  );
}
