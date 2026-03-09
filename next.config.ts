import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
}) as any;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {}, // 👈 add this line
};

export default withPWA(nextConfig);
