'use client';

import { useEffect } from 'react';

export default function GlobalClientEffects() {
  useEffect(() => {
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registrado:', registration);
          })
          .catch((error) => {
            console.log('Error al registrar SW:', error);
          });
      });
    }
  }, []);

  return null;
}
