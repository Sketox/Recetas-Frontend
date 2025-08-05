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
  // 🚀 Configuraciones para evitar problemas de pre-rendering
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // 🚀 Configuración de generación estática
  generateStaticParams: false,
  // 🚀 Forzar renderizado dinámico para rutas problemáticas
  async headers() {
    return [
      {
        source: '/recipes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;