// src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface LoginSuccessResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json() as LoginSuccessResponse & { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error || 'Credenciales inválidas');
        setIsLoading(false);
        return;
      }

      // Redirección según rol: ADMIN a /admin, USER a /dashboard
      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setErrorMessage('Error de conexión al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {t.auth.loginTitle}
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-light">
          {t.auth.loginSubtitle}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t.auth.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@cospace.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t.auth.passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.6)] disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          {isLoading ? t.auth.processing : t.auth.loginButton}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-purple-900/40 text-center text-xs text-slate-400">
        <span>{t.auth.noAccount} </span>
        <Link href="/register" className="text-purple-300 hover:text-white font-bold transition-colors">
          {t.auth.registerButton}
        </Link>
      </div>
    </div>
  );
}
