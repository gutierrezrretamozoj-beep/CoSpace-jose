// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import AuroraBackground from '@/components/AuroraBackground';

export const metadata: Metadata = {
  title: 'CoSpace - Dreamy Aurora Coworking',
  description: 'Plataforma de reservas de coworking relajante y moderna por horas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col antialiased selection:bg-purple-500/30 selection:text-purple-200 bg-[#060411] text-slate-100">
        <Providers>
          <AuroraBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
