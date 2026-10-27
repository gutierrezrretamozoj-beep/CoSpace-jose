// src/app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json() as { error?: string; message?: string };

      if (!response.ok) {
        setErrorMessage(data.error || 'Error al registrar usuario');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch {
      setErrorMessage('Error de conexión al registrar cuenta');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">
          {t.auth.registerTitle}
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-light">
          {t.auth.registerSubtitle}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t.auth.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María González"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
          />
        </div>

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
            placeholder="maria@empresa.com"
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.6)] disabled:opacity-50 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          {isLoading ? t.auth.processing : t.auth.registerButton}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-purple-900/40 text-center text-xs text-slate-400">
        <span>{t.auth.hasAccount} </span>
        <Link href="/login" className="text-purple-300 hover:text-white font-bold transition-colors">
          {t.auth.loginButton}
        </Link>
      </div>
    </div>
  );
}
