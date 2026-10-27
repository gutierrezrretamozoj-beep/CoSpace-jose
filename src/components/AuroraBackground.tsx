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

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let step = 0;

    // Cortinas verticales de aurora boreal con ondulaciones y rayos luminosos en movimiento
    const render = () => {
      step += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // CORTINA 1: Resplandor verde esmeralda y cian boreal (característico de auroras boreales)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 12) {
        const y1 = Math.sin(x * 0.003 + step * 0.04) * 90;
        const y2 = Math.cos(x * 0.0015 - step * 0.025) * 60;
        const y = h * 0.28 + y1 + y2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();

      const grad1 = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.85)');   // Cyan eléctrico
      grad1.addColorStop(0.35, 'rgba(74, 222, 128, 0.70)'); // Verde esmeralda boreal
      grad1.addColorStop(0.7, 'rgba(168, 85, 247, 0.40)');  // Púrpura
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fill();
      ctx.restore();

      // CORTINA 2: Cinta ondulante violeta y magenta cósmica
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 12) {
        const y1 = Math.sin(x * 0.0025 - step * 0.035 + 2) * 110;
        const y2 = Math.sin(x * 0.005 + step * 0.02) * 45;
        const y = h * 0.38 + y1 + y2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();

      const grad2 = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      grad2.addColorStop(0, 'rgba(192, 132, 252, 0.75)');  // Lavanda luminoso
      grad2.addColorStop(0.45, 'rgba(236, 72, 153, 0.65)'); // Magenta vibrante
      grad2.addColorStop(0.8, 'rgba(56, 189, 248, 0.30)');  // Cyan
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fill();
      ctx.restore();

      // CORTINA 3: Núcleo etéreo blanco y celeste en primer plano con ondas rápidas
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 10) {
        const y1 = Math.sin(x * 0.004 + step * 0.05 + 1) * 75;
        const y2 = Math.cos(x * 0.002 - step * 0.03) * 50;
        const y = h * 0.2 + y1 + y2;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();

      const grad3 = ctx.createLinearGradient(0, 0, 0, h * 0.45);
      grad3.addColorStop(0, 'rgba(255, 255, 255, 0.90)');  // Luz blanca pura
      grad3.addColorStop(0.4, 'rgba(125, 211, 252, 0.75)'); // Celeste vivo
      grad3.addColorStop(0.8, 'rgba(192, 132, 252, 0.35)'); // Líbano suave
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fill();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#060411]">
      {/* ======================================================== */}
      {/* CAPA AURORA PÚRPURA CÓSMICA (Keyframes requeridos)       */}
      {/* ======================================================== */}
      <div className="absolute -top-[10%] -left-[8%] w-[75vw] h-[85vw] max-w-[1150px] max-h-[1150px] rounded-[58%_42%_62%_38%] bg-gradient-to-tr from-[#a855f7]/85 via-[#c084fc]/75 to-[#d8b4fe]/60 blur-[75px] animate-aurora-purple" />

      {/* ======================================================== */}
      {/* CAPA AURORA CIAN / CELESTE EN EXPANSIÓN ORGÁNICA         */}
      {/* ======================================================== */}
      <div className="absolute top-[8%] left-[6%] w-[60vw] h-[65vw] max-w-[950px] max-h-[950px] rounded-[48%_52%_42%_58%] bg-gradient-to-br from-[#38bdf8]/80 via-[#7dd3fc]/70 to-[#c084fc]/55 blur-[80px] animate-aurora-cyan" />

      {/* ======================================================== */}
      {/* CAPA AURORA MAGENTA / FUCHSIA VIBRANTE                   */}
      {/* ======================================================== */}
      <div className="absolute top-[4%] left-[1%] w-[45vw] h-[50vw] max-w-[700px] max-h-[750px] rounded-full bg-gradient-to-r from-[#ec4899]/75 via-[#f472b6]/65 to-white/90 blur-[85px] animate-aurora-magenta" />

      {/* ======================================================== */}
      {/* CINTA DE LUZ VIVA EN PRIMER PLANO (ONDULACIÓN FLUIDA)    */}
      {/* ======================================================== */}
      <div className="absolute -top-[5%] left-[5%] w-[65vw] h-[45vw] rounded-[60%_40%_70%_30%/50%_60%_40%_50%] bg-gradient-to-r from-transparent via-[#7dd3fc]/70 via-white/80 to-transparent blur-[40px] animate-aurora-curtain" />

      {/* ======================================================== */}
      {/* CANVAS DINÁMICO DE AURORA BOREAL ONDULANTE EN VIVO       */}
      {/* ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen"
        style={{ filter: 'blur(20px)' }}
      />

      {/* ======================================================== */}
      {/* NEBULOSA CÓSMICA EN CUADRANTE DERECHO (FONDO CATÁLOGO)   */}
      {/* ======================================================== */}
      <div className="absolute -top-[8%] -right-[12%] w-[55vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-bl from-[#7c3aed]/50 via-[#3b82f6]/30 to-[#ec4899]/25 blur-[110px] animate-aurora-cyan" />
      <div className="absolute bottom-[2%] right-[5%] w-[45vw] h-[40vw] max-w-[700px] max-h-[600px] rounded-full bg-gradient-to-tl from-[#9333ea]/40 via-[#0284c7]/25 to-transparent blur-[115px] animate-aurora-purple" />

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
