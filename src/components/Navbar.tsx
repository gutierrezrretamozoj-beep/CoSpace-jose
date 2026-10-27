// src/components/Navbar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json() as { authenticated: boolean; user: UserSession | null };
          if (isMounted && data.authenticated && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch {
        // En caso de error o sin sesión, permanece null
      }
    }
    void checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch {
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    }
  };

  const toggleLocale = (): void => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <header className="sticky top-5 z-50 max-w-6xl mx-auto px-4 w-full">
      <div className="relative rounded-full backdrop-blur-2xl bg-[#0c0824]/80 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
        {/* ============================================================ */}
        {/* CAPA 1: POLVO DE ESTRELLAS ESCARCHADO Y CONSTELACIÓN VIVA    */}
        {/* ============================================================ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          {/* Nube luminosa de polvo estelar morado y celeste */}
          <div className="absolute -top-10 -left-40 w-[420px] h-32 bg-gradient-to-r from-transparent via-purple-400/40 via-cyan-300/50 to-transparent blur-xl animate-stardust-sweep" />

          {/* Ráfaga de escarcha resplandeciente */}
          <div className="absolute top-0 -left-32 w-80 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-md animate-stardust-sweep" />

          {/* Destellos y chispas de estrellas escarchadas que viajan en el barrido */}
          <div className="absolute top-3.5 -left-24 flex items-center gap-5 animate-stardust-sweep">
            <span className="text-xs text-cyan-300 drop-shadow-[0_0_8px_#38bdf8] animate-glitter">✦</span>
            <span className="text-[10px] text-purple-300 drop-shadow-[0_0_6px_#c084fc] animate-glitter">✧</span>
            <span className="text-xs text-sky-200 drop-shadow-[0_0_8px_#38bdf8] animate-glitter">✶</span>
            <span className="text-[9px] text-white drop-shadow-[0_0_6px_#ffffff] animate-glitter">✦</span>
            <span className="text-xs text-cyan-200 drop-shadow-[0_0_8px_#38bdf8] animate-glitter">✧</span>
            <span className="text-[11px] text-emerald-300 drop-shadow-[0_0_8px_#4ade80] animate-glitter">★</span>
            <span className="text-[9px] text-pink-300 drop-shadow-[0_0_6px_#f472b6] animate-glitter">✧</span>
          </div>

          {/* Estrellas titilantes fijas distribuidas a lo largo del navbar */}
          <span className="absolute top-2 left-28 text-[11px] text-cyan-300 drop-shadow-[0_0_8px_#38bdf8] animate-twinkle-1">✦</span>
          <span className="absolute bottom-2.5 left-48 text-[9px] text-purple-200 drop-shadow-[0_0_6px_#c084fc] animate-twinkle-2">✧</span>
          <span className="absolute top-3.5 left-[38%] text-[10px] text-white drop-shadow-[0_0_7px_#ffffff] animate-twinkle-3">✦</span>
          <span className="absolute bottom-2 left-[48%] text-[8px] text-sky-300 drop-shadow-[0_0_6px_#7dd3fc] animate-twinkle-1">✶</span>
          <span className="absolute top-2.5 right-[34%] text-[10px] text-pink-200 drop-shadow-[0_0_6px_#f472b6] animate-twinkle-2">✧</span>
          <span className="absolute bottom-3 right-[22%] text-[11px] text-emerald-300 drop-shadow-[0_0_8px_#4ade80] animate-twinkle-3">✦</span>
          <span className="absolute top-3 right-12 text-[9px] text-cyan-200 drop-shadow-[0_0_6px_#38bdf8] animate-twinkle-1">✧</span>
          <span className="absolute bottom-2 right-4 text-[10px] text-white drop-shadow-[0_0_7px_#ffffff] animate-twinkle-2">✦</span>
        </div>

        {/* ============================================================ */}
        {/* CAPA 2: CONTENIDO INTERACTIVO                                */}
        {/* ============================================================ */}
        <div className="relative px-6 sm:px-8 h-14 sm:h-16 flex items-center justify-between z-10">
          {/* Logo CoSpace con texto blanco luminoso de alto contraste */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <span className="absolute w-5 h-5 rounded-full border-[2.5px] border-[#00a6ff] -left-0.5 opacity-90 shadow-[0_0_10px_rgba(0,166,255,0.6)]" />
              <span className="absolute w-5 h-5 rounded-full border-[2.5px] border-[#38bdf8] left-2 opacity-95 shadow-[0_0_12px_#38bdf8]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              CoSpace
            </span>
          </Link>

          {/* Enlaces de navegación con texto blanco nítido que no se pierde */}
          <nav className="flex items-center gap-4 sm:gap-7 text-sm font-bold text-slate-100">
            <Link
              href="/spaces"
              className="text-slate-100 hover:text-cyan-300 transition-colors"
            >
              {t.nav.spaces}
            </Link>
            <Link
              href="/dashboard"
              className="text-slate-100 hover:text-cyan-300 transition-colors"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/admin"
              className="text-slate-100 hover:text-cyan-300 transition-colors"
            >
              {t.nav.admin}
            </Link>

            {/* Cápsula de Idioma ES / EN con icono de Globo */}
            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-md cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              title="Cambiar idioma / Switch language"
            >
              <svg
                className="w-4 h-4 text-cyan-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span>{locale.toUpperCase()} / {locale === 'es' ? 'EN' : 'ES'}</span>
            </button>

            {/* Estado de Autenticación: Si NO ha iniciado sesión muestra "Iniciar Sesión" */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline-block text-xs font-semibold text-purple-200 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                  {currentUser.name || currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-rose-400 hover:text-rose-300 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 transition-all cursor-pointer"
                  title={t.nav.logout}
                >
                  {t.nav.logout}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#00a6ff] hover:bg-[#0092e0] shadow-[0_2px_12px_rgba(0,166,255,0.45)] hover:shadow-[0_4px_18px_rgba(0,166,255,0.7)] transition-all transform hover:-translate-y-0.5 active:scale-95 inline-block"
              >
                {t.nav.login}
              </Link>
            )}
          </nav>
        </div>

        {/* ============================================================ */}
        {/* CAPA 3: LÍNEA INFERIOR CON DESTELLO LÁSER RESPLANDECIENTE    */}
        {/* ============================================================ */}
        <div className="relative w-full h-[2px] bg-purple-500/30 overflow-hidden">
          <div className="absolute top-0 h-full bg-gradient-to-r from-transparent via-cyan-400 via-white to-transparent shadow-[0_0_16px_#38bdf8] animate-stardust-bottom" />
        </div>
      </div>
    </header>
  );
}
