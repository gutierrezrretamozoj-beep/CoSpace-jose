// src/app/(public)/spaces/[id]/BookingForm.tsx
'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookingFormProps {
  spaceId: string;
  pricePerHour: number;
}

const HOURS: string[] = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00'
];

export default function BookingForm({ spaceId, pricePerHour }: BookingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Fecha mínima (hoy) y máxima (30 días en el futuro)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const maxDateStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  }, []);

  const [date, setDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('11:00');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cálculo de duración y validación en cliente
  const durationHours = useMemo(() => {
    const startHourNum = parseInt(startTime.split(':')[0], 10);
    const endHourNum = parseInt(endTime.split(':')[0], 10);
    return endHourNum - startHourNum;
  }, [startTime, endTime]);

  const isValidDuration = durationHours >= 1 && durationHours <= 4;
  const estimatedTotal = isValidDuration ? durationHours * pricePerHour : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidDuration) {
      setErrorMessage('La duración de la reserva debe ser de entre 1 y 4 horas completas.');
      return;
    }

    // Construir fechas ISO
    const startIso = `${date}T${startTime}:00.000Z`;
    const endIso = `${date}T${endTime}:00.000Z`;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceId,
          startTime: startIso,
          endTime: endIso,
        }),
      });

      const data = await response.json() as { error?: string; id?: string };

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        setErrorMessage(data.error || 'No se pudo procesar la reserva');
        return;
      }

      setSuccessMessage('¡Reserva confirmada con éxito! Redirigiendo a tus reservas...');
      startTransition(() => {
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      });
    } catch {
      setErrorMessage('Error de conexión al procesar la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 text-sm">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
          <span>{successMessage}</span>
          <Link href="/dashboard" className="underline font-bold text-xs ml-2">
            Ver Reservas
          </Link>
        </div>
      )}

      {/* Selector de Fecha */}
      <div>
        <label htmlFor="booking-date" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          Fecha de Reserva
        </label>
        <input
          id="booking-date"
          type="date"
          min={todayStr}
          max={maxDateStr}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          * Máximo 30 días de anticipación (no se permiten fechas pasadas).
        </p>
      </div>

      {/* Rango de Horas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-time" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Hora Inicio
          </label>
          <select
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
          >
            {HOURS.slice(0, -1).map((h) => (
              <option key={h} value={h} className="bg-slate-900 text-white">
                {h}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="end-time" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Hora Fin
          </label>
          <select
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all cursor-pointer"
          >
            {HOURS.slice(1).map((h) => (
              <option key={h} value={h} className="bg-slate-900 text-white">
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicador de regla y duración */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Duración seleccionada:</span>
          <span className={`font-bold ${isValidDuration ? 'text-purple-300' : 'text-rose-400'}`}>
            {durationHours > 0 ? `${durationHours} hora${durationHours > 1 ? 's' : ''}` : 'Horario inválido'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Regla: Los bloques deben ser de 1 a 4 horas completas dentro del horario de 7:00 a 21:00.
        </p>
      </div>

      {/* Precio estimado */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-purple-500/30">
        <span className="text-sm font-semibold text-slate-300">Total estimado:</span>
        <div className="text-right">
          <span className="text-2xl font-black text-cyan-300">
            ${estimatedTotal.toFixed(2)}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            (Calculado en el servidor)
          </span>
        </div>
      </div>

      {/* Botón de confirmación */}
      <button
        type="submit"
        disabled={isPending || !isValidDuration}
        className="w-full py-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(192,132,252,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
      >
        {isPending ? 'Procesando reserva...' : 'Confirmar y Pagar Reserva'}
      </button>
    </form>
  );
}
