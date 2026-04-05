import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PWARegister } from "./components/PWARegister";
import "./globals.css";
import InstallPWA from "./components/InstallPWA";
import ReduxProvider from "./components/ReduxProvider";
import InitializeAuth from "./components/InitializeAuth";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Work-Track - Client Management",
  description:
    "Work-Track helps clients manage projects, track work progress, and stay organized anywhere. Fully works offline.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Work-Track",
  },
  icons: {
    icon: [
      {
        url: "/icons/logo.",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        url: "/icons/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/icons/logo.png" }],
  },
  keywords: [
    "work tracking",
    "project management",
    "client management",
    "offline app",
  ],
  authors: [{ name: "Work-Track Team" }],
  applicationName: "Work-Track",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#292c43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Work-Track" />

        {/* Theme & Display */}
        <meta name="theme-color" content="#292c43" />
        <meta name="msapplication-TileColor" content="#292c43" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Mobile Optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />

        {/* Additional PWA Meta Tags */}
        <link rel="canonical" href="https://work-track.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Work-Track - Client Management" />
        <meta
          property="og:description"
          content="Work-Track helps clients manage projects, track work progress, and stay organized anywhere. Fully works offline."
        />
        <meta property="og:image" content="/icons/logo.png" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 1500,
          }}
        />
        <ReduxProvider>
          <InitializeAuth />
          {children}
        </ReduxProvider>
        <InstallPWA />
        <PWARegister />
      </body>
    </html>
  );
}
