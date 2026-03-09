'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    deferredPrompt?: any;
  }
}

export function InstallButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setIsInstallable(true);
    };

    // Listen for installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!window.deferredPrompt) {
      console.log('Install prompt not available. Make sure you are on a supported browser and platform.');
      return;
    }

    setIsLoading(true);

    try {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      window.deferredPrompt = null;
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show anything if not installable (except on mobile, we can suggest alternatives)
  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isLoading}
      className="fixed bottom-6 right-6 bg-white text-[#292c43] px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all z-50 disabled:opacity-50"
      aria-label="Install Work-Track app"
    >
      {isLoading ? 'Installing...' : '⬇️ Install App'}
    </button>
  );
}

/**
 * INSTALLATION METHODS BY PLATFORM:
 * 
 * ✓ ANDROID (Chrome):
 *   - Method 1: Use the <InstallButton /> component (best)
 *   - Method 2: Chrome menu → "Install app" or "Add to Home Screen"
 *   - Method 3: Three dots → "More tools" → "Create shortcut"
 * 
 * ✓ iOS (Safari):
 *   - Share button (⬆️) → "Add to Home Screen"
 *   - NO automatic prompt available
 * 
 * ✓ Windows/Mac (Chrome/Edge):
 *   - Use <InstallButton /> component
 *   - Or browser menu → "Install app"
 * 
 * ✓ Desktop Firefox:
 *   - Not officially supported yet, but users can create shortcuts
 */
