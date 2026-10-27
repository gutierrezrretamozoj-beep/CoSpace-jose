// src/components/FormattedDate.tsx
'use client';

import React, { useSyncExternalStore } from 'react';

interface FormattedDateProps {
  dateString: string;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

// Renderiza un marcador neutro en SSR y muestra la fecha local en cliente de forma segura (sin hydration mismatch)
export default function FormattedDate({ dateString }: FormattedDateProps) {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) {
    return <span className="text-slate-500 font-mono text-sm">--/--/---- --:--</span>;
  }

  const date = new Date(dateString);
  return (
    <span className="font-medium text-slate-200 font-mono text-sm">
      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}
