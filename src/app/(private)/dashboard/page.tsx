// src/app/(private)/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormattedDate from '@/components/FormattedDate';
import { useLanguage } from '@/context/LanguageContext';

interface BookingItem {
  id: string;
  userId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  Space: {
    name: string;
    type: string;
    imageUrl: string;
    pricePerHour: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBookings() {
      try {
        const response = await fetch('/api/bookings');
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json() as BookingItem[];
        if (isMounted) {
          setBookings(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setFeedback({ message: 'No se pudieron cargar tus reservas', type: 'error' });
          setLoading(false);
        }
      }
    }

    void loadBookings();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const reloadBookings = async (): Promise<void> => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json() as BookingItem[];
        setBookings(data);
      }
    } catch {
      // Ignorar reintentos silenciosos
    }
  };

  const handleCancel = async (bookingId: string): Promise<void> => {
    if (!confirm(t.dashboard.confirmCancel)) return;

    setCancellingId(bookingId);
    setFeedback(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
      });

      const data = await response.json() as { error?: string; message?: string };

      if (!response.ok) {
        setFeedback({ message: data.error || 'No se pudo cancelar la reserva', type: 'error' });
        setCancellingId(null);
        return;
      }

      setFeedback({ message: 'Reserva cancelada exitosamente', type: 'success' });
      await reloadBookings();
    } catch {
      setFeedback({ message: 'Error de red al cancelar reserva', type: 'error' });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="py-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-purple-900/40">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-slate-300 mt-1 font-light">
            {t.dashboard.subtitle}
          </p>
        </div>

        <Link
          href="/spaces"
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 hover:shadow-[0_0_15px_rgba(192,132,252,0.5)] transition-all active:scale-95"
        >
          + Nueva Reserva
        </Link>
      </div>

      {feedback && (
        <div
          className={`mb-8 p-4 rounded-xl text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-600/40 text-rose-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {loading ? (
        <div className="aurora-glass-card rounded-2xl p-16 text-center">
          <div className="inline-block w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Cargando tus reservas...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="aurora-glass-card rounded-2xl p-16 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 text-2xl mx-auto mb-4">
            ✦
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            {t.dashboard.empty}
          </h2>
          <p className="text-sm text-slate-400 mb-6 font-light">
            Explora el catálogo y elige el escritorio o sala perfecta para tu siguiente sesión de trabajo.
          </p>
          <Link
            href="/spaces"
            className="inline-block px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-purple-400 to-cyan-400 hover:shadow-[0_0_20px_rgba(192,132,252,0.5)] transition-all"
          >
            Explorar Espacios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking: BookingItem) => {
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className={`aurora-glass-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between ${
                  isCancelled ? 'opacity-65 border-slate-800' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                        {booking.Space.type}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-0.5">
                        {booking.Space.name}
                      </h3>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        isCancelled
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800/40'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      {isCancelled ? t.dashboard.statusCancelled : t.dashboard.statusConfirmed}
                    </span>
                  </div>

                  {/* Fechas con FormattedDate seguro */}
                  <div className="space-y-2 py-4 border-y border-purple-900/30 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.dashboard.start}</span>
                      <FormattedDate dateString={booking.startTime} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{t.dashboard.end}</span>
                      <FormattedDate dateString={booking.endTime} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{t.dashboard.total}</span>
                    <span className="text-xl font-black text-cyan-300">
                      ${booking.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {!isCancelled && (
                    <button
                      type="button"
                      disabled={cancellingId === booking.id}
                      onClick={() => handleCancel(booking.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-300 border border-rose-800/50 bg-rose-950/40 hover:bg-rose-900/60 hover:border-rose-600/60 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {cancellingId === booking.id ? 'Cancelando...' : t.dashboard.cancelBtn}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
