/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://0b96-2400-d1e0-8000-3704-7975-dec3-6084-f0e1.ngrok-free.app",
  ],
};

export default nextConfig;
