// src/context/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, dictionary } from '@/lib/i18n';

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof dictionary['es'];
}

// Valor por defecto seguro para SSR y prevención de errores de contexto no provisto
const defaultContextValue: LanguageContextType = {
  locale: 'es',
  setLocale: () => {},
  t: dictionary['es'],
};

// Se inicializa el contexto con el valor por defecto
const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook de consumo sin throw error para evitar caídas de renderizado
export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}