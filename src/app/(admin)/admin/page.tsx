// src/app/(admin)/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface SpaceItem {
  id: string;
  name: string;
  description: string;
  type: 'DESK' | 'MEETING_ROOM' | 'BOOTH';
  pricePerHour: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estado del formulario de creación
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<'DESK' | 'MEETING_ROOM' | 'BOOTH'>('DESK');
  const [pricePerHour, setPricePerHour] = useState<string>('15');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSpaces() {
      try {
        const response = await fetch('/api/spaces');
        if (response.status === 403 || response.status === 401) {
          router.push('/dashboard');
          return;
        }
        if (!response.ok) {
          throw new Error('Error al cargar espacios');
        }
        const data = await response.json() as SpaceItem[];
        if (isMounted) {
          setSpaces(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setFeedback({ message: 'No se pudo obtener el inventario de espacios', type: 'error' });
          setLoading(false);
        }
      }
    }

    void loadSpaces();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const reloadSpaces = async (): Promise<void> => {
    try {
      const response = await fetch('/api/spaces');
      if (response.ok) {
        const data = await response.json() as SpaceItem[];
        setSpaces(data);
      }
    } catch {
      // Ignorar reintentos silenciosos
    }
  };

  const handleCreateSpace = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          type,
          pricePerHour: Number(pricePerHour),
          imageUrl,
        }),
      });

      const data = await response.json() as { error?: string; id?: string };

      if (!response.ok) {
        setFeedback({ message: data.error || 'Error al crear el espacio', type: 'error' });
        setIsSubmitting(false);
        return;
      }

      setFeedback({ message: '¡Espacio creado exitosamente!', type: 'success' });
      setName('');
      setDescription('');
      setPricePerHour('15');
      await reloadSpaces();
    } catch {
      setFeedback({ message: 'Error de red al crear el espacio', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (space: SpaceItem): Promise<void> => {
    setTogglingId(space.id);
    setFeedback(null);

    const newActiveState = !space.isActive;

    try {
      const response = await fetch(`/api/spaces/${space.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActiveState }),
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        // En caso de conflicto por reservas futuras (Regla 13), el backend responde 409
        setFeedback({
          message: data.error || 'No se puede modificar el estado del espacio',
          type: 'error',
        });
        setTogglingId(null);
        return;
      }

      setFeedback({
        message: `Espacio ${newActiveState ? 'activado' : 'desactivado'} exitosamente`,
        type: 'success',
      });
      await reloadSpaces();
    } catch {
      setFeedback({ message: 'Error de red al actualizar estado', type: 'error' });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {t.admin.title}
        </h1>
        <p className="text-sm text-slate-300 mt-1 font-light">
          {t.admin.subtitle}
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-600/40 text-rose-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Grid: Formulario de Creación + Lista de Espacios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Formulario de Creación */}
        <div className="lg:col-span-5">
          <div className="aurora-glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-purple-900/40">
              {t.admin.createTitle}
            </h2>

            <form onSubmit={handleCreateSpace} className="space-y-5">
              <div>
                <label htmlFor="space-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t.admin.nameLabel}
                </label>
                <input
                  id="space-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Escritorio Ejecutivo Nova"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label htmlFor="space-desc" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t.admin.descLabel}
                </label>
                <textarea
                  id="space-desc"
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción detallada de amenidades y capacidad..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="space-type" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.admin.typeLabel}
                  </label>
                  <select
                    id="space-type"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'DESK' | 'MEETING_ROOM' | 'BOOTH')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400 cursor-pointer"
                  >
                    <option value="DESK" className="bg-slate-900">DESK (Escritorio)</option>
                    <option value="MEETING_ROOM" className="bg-slate-900">MEETING_ROOM (Sala)</option>
                    <option value="BOOTH" className="bg-slate-900">BOOTH (Cabina)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="space-price" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.admin.priceLabel}
                  </label>
                  <input
                    id="space-price"
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="space-image" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {t.admin.imageLabel}
                </label>
                <input
                  id="space-image"
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? t.admin.creatingBtn : t.admin.createBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Espacios */}
        <div className="lg:col-span-7">
          <div className="aurora-glass-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-purple-900/40">
              {t.admin.listTitle}
            </h2>

            {loading ? (
              <div className="text-center py-12 text-slate-400">
                Cargando inventario...
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No hay espacios en la base de datos.
              </div>
            ) : (
              <div className="space-y-4">
                {spaces.map((space: SpaceItem) => (
                  <div
                    key={space.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-purple-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">
                          {space.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
                          {space.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        ${space.pricePerHour.toFixed(2)}/h • Estado:{' '}
                        <span className={space.isActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {space.isActive ? t.admin.activeStatus : t.admin.inactiveStatus}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={togglingId === space.id}
                      onClick={() => handleToggleActive(space)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        space.isActive
                          ? 'border border-rose-800/50 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300'
                          : 'border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300'
                      }`}
                    >
                      {togglingId === space.id
                        ? 'Actualizando...'
                        : space.isActive
                        ? t.admin.deactivateBtn
                        : t.admin.activateBtn}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
