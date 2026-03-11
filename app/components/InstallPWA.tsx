"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent,
      );

    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;

      setDeferredPrompt(event);

      if (isMobile) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    }

    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
      <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border px-3 py-2">
        {/* Left side */}
        <div className="flex items-center gap-3 py-3">
          <Image
            src="/icons/worktrack-72.svg"
            alt="App Icon"
            width={34}
            height={34}
            className="rounded-lg"
          />

          <div className="leading-tight">
            <p className="text-sm font-semibold text-black">
              Install WorkTrack
            </p>
            <p className="text-xs text-gray-500">worktrack.com</p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleInstall}
            className="text-blue-600 font-semibold text-sm"
          >
            Install
          </button>

          <button
            onClick={closeBanner}
            className="text-gray-400 text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
