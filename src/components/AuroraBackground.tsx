// src/components/AuroraBackground.tsx
// Fondo Aurora Borealis hiper-realista: con cortinas luminosas vivas,
// estelas ondulantes verticales, cielo estrellado y ondas electromagnéticas visibles

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
    let step = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dibuja cortinas de aurora borealis auténticas con rayos luminosos verticales que oscilan
    const render = () => {
      step += 1;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // --- CORTINA VERDE ESMERALDA / CIAN (La clásica aurora boreal nórdica) ---
      // Dibujamos franjas verticales con variación de altura y transparencia que se mueven rápido
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const rayCount = Math.floor(w / 18);
      for (let i = 0; i < rayCount; i++) {
        const x = i * 18;
        // Altura y ondulación de cada rayo vertical
        const wave1 = Math.sin(x * 0.005 + step * 0.045) * (h * 0.18);
        const wave2 = Math.cos(x * 0.012 - step * 0.035) * (h * 0.08);
        const curtainBaseY = h * 0.12;
        const rayHeight = h * 0.55 + wave1 + wave2;

        // Pulso de intensidad
        const pulse = (Math.sin(step * 0.05 + i * 0.2) + 1) * 0.5;
        const opacity = 0.25 + pulse * 0.45;

        const rayGrad = ctx.createLinearGradient(x, curtainBaseY, x, curtainBaseY + rayHeight);
        rayGrad.addColorStop(0, `rgba(56, 189, 248, ${opacity * 0.9})`);    // Cyan brillante en la raíz
        rayGrad.addColorStop(0.35, `rgba(74, 222, 128, ${opacity * 0.85})`); // Verde boreal esmeralda
        rayGrad.addColorStop(0.7, `rgba(168, 85, 247, ${opacity * 0.5})`);   // Púrpura cósmico
        rayGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = rayGrad;
        ctx.fillRect(x - 6, curtainBaseY, 24, rayHeight);
      }
      ctx.restore();

      // --- CINTA ONDULANTE MAGENTA / VIOLETA EN SEGUNDO PLANO ---
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 15) {
        const y = h * 0.32 + Math.sin(x * 0.004 + step * 0.03) * 90 + Math.cos(x * 0.008 - step * 0.02) * 45;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();

      const gradRibbon = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      gradRibbon.addColorStop(0, 'rgba(236, 72, 153, 0.55)');
      gradRibbon.addColorStop(0.4, 'rgba(192, 132, 252, 0.45)');
      gradRibbon.addColorStop(0.8, 'rgba(56, 189, 248, 0.25)');
      gradRibbon.addColorStop(1, 'transparent');
      ctx.fillStyle = gradRibbon;
      ctx.fill();
      ctx.restore();

      // --- NÚCLEO FOTÓNICO BLANCO / CELESTE VIVO EN MOVIMIENTO CONTINUO ---
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= w; x += 20) {
        const y = h * 0.18 + Math.cos(x * 0.006 + step * 0.06) * 60 + Math.sin(x * 0.002 - step * 0.04) * 35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, 0);
      ctx.closePath();

      const gradCore = ctx.createLinearGradient(0, 0, 0, h * 0.4);
      gradCore.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      gradCore.addColorStop(0.3, 'rgba(125, 211, 252, 0.65)');
      gradCore.addColorStop(0.7, 'rgba(74, 222, 128, 0.35)');
      gradCore.addColorStop(1, 'transparent');
      ctx.fillStyle = gradCore;
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
      {/* 1. FOTO REAL DE AURORA BOREAL DE FONDO (NOCHE ÁRTICA)   */}
      {/* Proporciona la forma inconfundible de aurora boreal real  */}
      {/* ======================================================== */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.35), transparent 60%),
                            radial-gradient(circle at 70% 30%, rgba(74, 222, 128, 0.3), transparent 55%),
                            radial-gradient(circle at 50% 60%, rgba(168, 85, 247, 0.35), transparent 70%)`,
        }}
      />

      {/* ======================================================== */}
      {/* 2. CORTINA VERDE ESMERALDA VIBRANTE DE AURORA BOREAL     */}
      {/* ======================================================== */}
      <div
        className="absolute -top-[15%] left-[5%] w-[85vw] h-[55vw] max-w-[1300px] rounded-[45%_55%_65%_35%/40%_60%_40%_60%] blur-[45px] opacity-75 mix-blend-screen pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.75) 0%, rgba(56, 189, 248, 0.65) 40%, rgba(168, 85, 247, 0.4) 80%, transparent 100%)',
          animation: 'aurora-curtain-flow 7s ease-in-out infinite alternate',
        }}
      />

      {/* ======================================================== */}
      {/* 3. CAPA AURORA PÚRPURA CÓSMICA (Keyframes requeridos)    */}
      {/* ======================================================== */}
      <div className="absolute -top-[10%] -left-[8%] w-[75vw] h-[80vw] max-w-[1100px] rounded-[58%_42%_62%_38%] bg-gradient-to-tr from-[#a855f7]/80 via-[#c084fc]/70 to-[#d8b4fe]/50 blur-[55px] animate-aurora-purple mix-blend-screen pointer-events-none" />

      {/* ======================================================== */}
      {/* 4. CAPA AURORA CIAN / CELESTE (Keyframes requeridos)     */}
      {/* ======================================================== */}
      <div className="absolute top-[6%] left-[8%] w-[65vw] h-[65vw] max-w-[950px] rounded-[48%_52%_42%_58%] bg-gradient-to-br from-[#38bdf8]/85 via-[#7dd3fc]/70 to-[#4ade80]/60 blur-[50px] animate-aurora-cyan mix-blend-screen pointer-events-none" />

      {/* ======================================================== */}
      {/* 5. CAPA AURORA MAGENTA / FUCHSIA (Keyframes requeridos)  */}
      {/* ======================================================== */}
      <div className="absolute top-[4%] left-[2%] w-[50vw] h-[50vw] max-w-[750px] rounded-full bg-gradient-to-r from-[#ec4899]/75 via-[#f472b6]/65 to-[#c084fc]/50 blur-[60px] animate-aurora-magenta mix-blend-screen pointer-events-none" />

      {/* ======================================================== */}
      {/* 6. CINTA FLUIDA CONTRARIA (Sensación de doble aurora)    */}
      {/* ======================================================== */}
      <div
        className="absolute top-[10%] right-[5%] w-[65vw] h-[45vw] max-w-[900px] rounded-[50%_50%_40%_60%/45%_55%_45%_55%] blur-[40px] opacity-70 mix-blend-screen pointer-events-none"
        style={{
          background: 'linear-gradient(220deg, rgba(56, 189, 248, 0.7) 0%, rgba(192, 132, 252, 0.6) 50%, rgba(74, 222, 128, 0.5) 100%)',
          animation: 'aurora-curtain-flow-reverse 9s ease-in-out infinite alternate',
        }}
      />

      {/* ======================================================== */}
      {/* 7. CANVAS DINÁMICO DE RAYOS VERTICALES (MOVIMIENTO VIVO) */}
      {/* ======================================================== */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen pointer-events-none"
        style={{ filter: 'blur(12px)' }}
      />

      {/* ======================================================== */}
      {/* 8. ESTRELLAS Y DESTELLOS TITILANTES                      */}
      {/* ======================================================== */}
      <span className="absolute top-[12%] left-[34%] text-white text-xs select-none animate-twinkle-1 drop-shadow-[0_0_8px_#ffffff]">✦</span>
      <span className="absolute top-[24%] left-[22%] text-cyan-200 text-[11px] select-none animate-twinkle-2 drop-shadow-[0_0_8px_#7dd3fc]">✧</span>
      <span className="absolute top-[38%] left-[42%] text-white text-[10px] select-none animate-twinkle-3 drop-shadow-[0_0_6px_#ffffff]">✦</span>
      <span className="absolute top-[8%] right-[30%] text-purple-200 text-xs select-none animate-twinkle-2 drop-shadow-[0_0_8px_#c084fc]">✦</span>
      <span className="absolute top-[28%] right-[14%] text-cyan-300 text-sm select-none animate-twinkle-1 drop-shadow-[0_0_10px_#38bdf8]">✦</span>
      <span className="absolute top-[48%] right-[35%] text-emerald-300 text-[11px] select-none animate-twinkle-3 drop-shadow-[0_0_8px_#4ade80]">✧</span>
      <span className="absolute bottom-[20%] right-[18%] text-purple-300 text-xs select-none animate-twinkle-1 drop-shadow-[0_0_8px_#c084fc]">✦</span>
      <span className="absolute bottom-[14%] left-[14%] text-white text-xs select-none animate-twinkle-2 drop-shadow-[0_0_6px_#ffffff]">✦</span>
      <span className="absolute bottom-[36%] left-[4%] text-cyan-100 text-[10px] select-none animate-twinkle-3 drop-shadow-[0_0_8px_#7dd3fc]">✧</span>
    </div>
  );
}
