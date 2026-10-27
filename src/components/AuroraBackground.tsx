// src/components/AuroraBackground.tsx
// Fondo Aurora Borealis hiper-realista, dinámico y orgánico en tiempo real

'use client';

import React, { useEffect, useRef } from 'react';

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    // Configuración de ondas de aurora boreal
    const waves = [
      {
        baseY: 0.18,
        speed: 0.0008,
        amplitude: 70,
        frequency: 0.0018,
        colorStart: 'rgba(56, 189, 248, 0.45)', // Cyan
        colorMid: 'rgba(192, 132, 252, 0.40)',   // Violeta
        colorEnd: 'transparent',
      },
      {
        baseY: 0.28,
        speed: 0.0006,
        amplitude: 90,
        frequency: 0.0014,
        colorStart: 'rgba(168, 85, 247, 0.50)', // Púrpura
        colorMid: 'rgba(236, 72, 153, 0.35)',   // Magenta
        colorEnd: 'transparent',
      },
      {
        baseY: 0.22,
        speed: 0.0011,
        amplitude: 60,
        frequency: 0.0022,
        colorStart: 'rgba(255, 255, 255, 0.65)', // Núcleo Blanco Luminoso
        colorMid: 'rgba(125, 211, 252, 0.45)',   // Celeste
        colorEnd: 'transparent',
      },
      {
        baseY: 0.38,
        speed: 0.0005,
        amplitude: 110,
        frequency: 0.0011,
        colorStart: 'rgba(192, 132, 252, 0.35)',
        colorMid: 'rgba(56, 189, 248, 0.30)',
        colorEnd: 'transparent',
      },
    ];

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Dibujar cada cortina de aurora con gradientes orgánicos ondulantes
      waves.forEach((w, idx) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);

        const currentBaseY = height * w.baseY;

        for (let x = 0; x <= width; x += 8) {
          const sin1 = Math.sin(x * w.frequency + time * w.speed + idx);
          const sin2 = Math.sin(x * w.frequency * 2.2 - time * w.speed * 0.7);
          const y = currentBaseY + sin1 * w.amplitude + sin2 * (w.amplitude * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, 0);
        ctx.closePath();

        // Degradado vertical con luz etérea
        const grad = ctx.createLinearGradient(0, 0, 0, currentBaseY + w.amplitude * 1.8);
        grad.addColorStop(0, w.colorStart);
        grad.addColorStop(0.55, w.colorMid);
        grad.addColorStop(1, w.colorEnd);

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#060411]">
      {/* ======================================================== */}
      {/* CANVAS DINÁMICO DE AURORA BOREAL FLUIDA EN TIEMPO REAL   */}
      {/* ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 mix-blend-screen"
        style={{ filter: 'blur(35px)' }}
      />

      {/* ======================================================== */}
      {/* CAPA AURORA PÚRPURA CÓSMICA (Keyframes de la prueba)     */}
      {/* ======================================================== */}
      <div className="absolute -top-[10%] -left-[8%] w-[75vw] h-[85vw] max-w-[1150px] max-h-[1150px] rounded-[58%_42%_62%_38%] bg-gradient-to-tr from-[#a855f7]/85 via-[#c084fc]/75 to-[#d8b4fe]/60 blur-[115px] animate-aurora-purple" />

      {/* ======================================================== */}
      {/* CAPA AURORA CIAN / CELESTE EN EXPANSIÓN ORGÁNICA         */}
      {/* ======================================================== */}
      <div className="absolute top-[8%] left-[6%] w-[60vw] h-[65vw] max-w-[950px] max-h-[950px] rounded-[48%_52%_42%_58%] bg-gradient-to-br from-[#38bdf8]/80 via-[#7dd3fc]/70 to-[#c084fc]/55 blur-[125px] animate-aurora-cyan" />

      {/* ======================================================== */}
      {/* CAPA AURORA MAGENTA / FUCHSIA VIBRANTE                   */}
      {/* ======================================================== */}
      <div className="absolute top-[4%] left-[1%] w-[45vw] h-[50vw] max-w-[700px] max-h-[750px] rounded-full bg-gradient-to-r from-[#ec4899]/75 via-[#f472b6]/65 to-white/90 blur-[130px] animate-aurora-magenta" />

      {/* ======================================================== */}
      {/* CINTA DE LUZ VIVA EN PRIMER PLANO (ONDULACIÓN CIENTÍFICA) */}
      {/* ======================================================== */}
      <div className="absolute -top-[5%] left-[5%] w-[65vw] h-[45vw] rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-gradient-to-r from-transparent via-[#7dd3fc]/60 via-white/70 to-transparent blur-[50px] animate-aurora-curtain" />

      {/* ======================================================== */}
      {/* NEBULOSA CÓSMICA EN CUADRANTE DERECHO (FONDO CATÁLOGO)   */}
      {/* ======================================================== */}
      <div className="absolute -top-[8%] -right-[12%] w-[55vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-bl from-[#7c3aed]/50 via-[#3b82f6]/30 to-[#ec4899]/25 blur-[135px] animate-aurora-cyan" />
      <div className="absolute bottom-[2%] right-[5%] w-[45vw] h-[40vw] max-w-[700px] max-h-[600px] rounded-full bg-gradient-to-tl from-[#9333ea]/40 via-[#0284c7]/25 to-transparent blur-[140px] animate-aurora-purple" />

      {/* ======================================================== */}
      {/* ESTRELLAS Y DESTELLOS TITILANTES                         */}
      {/* ======================================================== */}
      <span className="absolute top-[14%] left-[36%] text-white text-xs select-none animate-twinkle-1 drop-shadow-[0_0_8px_#ffffff]">✦</span>
      <span className="absolute top-[26%] left-[24%] text-cyan-200 text-[10px] select-none animate-twinkle-2 drop-shadow-[0_0_6px_#7dd3fc]">✧</span>
      <span className="absolute top-[42%] left-[44%] text-white text-[9px] select-none animate-twinkle-3 drop-shadow-[0_0_6px_#ffffff]">✦</span>
      <span className="absolute top-[10%] right-[32%] text-purple-200 text-xs select-none animate-twinkle-2 drop-shadow-[0_0_8px_#c084fc]">✦</span>
      <span className="absolute top-[32%] right-[16%] text-cyan-300 text-sm select-none animate-twinkle-1 drop-shadow-[0_0_10px_#38bdf8]">✦</span>
      <span className="absolute top-[52%] right-[38%] text-white text-[10px] select-none animate-twinkle-3 drop-shadow-[0_0_6px_#ffffff]">✧</span>
      <span className="absolute bottom-[22%] right-[20%] text-purple-300 text-xs select-none animate-twinkle-1 drop-shadow-[0_0_8px_#c084fc]">✦</span>
      <span className="absolute bottom-[16%] left-[16%] text-white text-xs select-none animate-twinkle-2 drop-shadow-[0_0_6px_#ffffff]">✦</span>
      <span className="absolute bottom-[38%] left-[6%] text-cyan-100 text-[9px] select-none animate-twinkle-3 drop-shadow-[0_0_6px_#7dd3fc]">✧</span>
    </div>
  );
}
