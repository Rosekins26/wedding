/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    unoptimized: true,
  },

  // Compression
  compress: true,

  // Remove powered by header
  poweredByHeader: false,

  // Headers for embedding
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://sites.google.com;",
          },
        ],
      },
    ]
  },

  // Fixed: Updated to use serverExternalPackages instead of experimental.serverComponentsExternalPackages
  serverExternalPackages: ["@neondatabase/serverless"],
}

module.exports = nextConfig
