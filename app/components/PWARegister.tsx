'use client';

import React from 'react';

export function PWARegister() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('✓ Service Worker registered successfully');

          // Periodically check for updates (every hour)
          setInterval(() => {
            reg.update();
          }, 3600000);
        })
        .catch((err) => {
          console.log('✗ Service Worker registration failed:', err);
        });

      // Install prompt handler
      let deferredPrompt: any;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        console.log('✓ App ready to install');
      });

      window.addEventListener('appinstalled', () => {
        console.log('✓ App successfully installed');
        deferredPrompt = null;
      });
    }
  }, []);

  return null;
}
