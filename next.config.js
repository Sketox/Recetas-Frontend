/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚀 Ignora errores de linting en Vercel
  },
  typescript: {
    ignoreBuildErrors: true,  // 🚀 Ignora errores de tipos en producción
  },
  images: {
    domains: ['ejemplo.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;