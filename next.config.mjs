/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow phone/tablet on same Wi‑Fi to load dev assets (fixes black screen on mobile)
  allowedDevOrigins: ["192.168.1.12", "localhost", "127.0.0.1"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
