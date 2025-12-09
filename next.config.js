const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression for better performance
  compress: true,

  // Use SWC minifier (default in Next.js 13+, but explicitly set)
  swcMinify: true,

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['@supabase/auth-helpers-nextjs', '@supabase/supabase-js'],
  },

  images: {
    remotePatterns: [
      // Add specific trusted domains here instead of wildcard
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Add more trusted image hosts as needed
    ],
    // Enable modern image formats
    formats: ['image/avif', 'image/webp'],
  },

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://adservice.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://rhuglnbrleazadxitrwz.supabase.co https://pagead2.googlesyndication.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
      // Static assets - long cache with immutable
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images - cache with revalidation
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // API routes - short cache with stale-while-revalidate
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      // Pages - medium cache with stale-while-revalidate
      {
        source: '/(resources|scholarships|tribes|nonprofits)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, stale-while-revalidate=600',
          },
        ],
      },
      // Detail pages - shorter cache
      {
        source: '/(resources|scholarships|tribes)/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=180, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },

  // Webpack configuration for bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce client-side bundle size
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      }
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
