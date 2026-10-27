// src/app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative z-10">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <span className="w-3.5 h-3.5 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc] group-hover:scale-125 transition-transform" />
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors">
            CoSpace
          </span>
          <span className="text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            Aurora
          </span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="aurora-glass-card rounded-2xl p-8 sm:p-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-slate-500">
        <Link href="/" className="hover:text-purple-300 transition-colors">
          ← Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
