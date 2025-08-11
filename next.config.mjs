/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    const rules = [];
    if (process.env.NODE_ENV === "development") {
      rules.push({
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      });
    } else if (process.env.TUNNEL_URL) {
      rules.push({
        source: "/api/:path*",
        destination: `${process.env.TUNNEL_URL}/api/:path*`,
      });
    }
    return rules;
  },
};
export default nextConfig;
