'use client';

import React, { useEffect, useCallback } from 'react';

// Global variable to store the deferred prompt
declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

export function PWARegister() {
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('✓ Service Worker registered successfully');

          // Periodically check for updates (every hour)
          const updateInterval = setInterval(() => {
            reg.update();
          }, 3600000);

          return () => clearInterval(updateInterval);
        })
        .catch((err) => {
          console.log('✗ Service Worker registration failed:', err);
        });
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      console.log('✓ App is already installed (standalone mode)');
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setIsInstallable(true);
      console.log('✓ Install prompt ready (beforeinstallprompt event fired)');
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      window.deferredPrompt = null;
      console.log('✓ App successfully installed');
    };

    // Listen for display mode changes (installed/uninstalled)
    const handleDisplayModeChange = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  return null;
}
