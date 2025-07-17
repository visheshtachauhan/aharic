/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'svqjenzgpypmcxdfbhxo.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
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
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Enable tree shaking
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Enable scope hoisting
      config.optimization.concatenateModules = true;

      // Enable minification
      config.optimization.minimize = true;
    }

    // Add module aliases for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    };

    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb'
    },
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'], // Optimize specific package imports
  },
  async redirects() {
    return [
      { source: '/login', destination: '/auth/login', permanent: true },
      { source: '/signup', destination: '/auth/signup', permanent: true },
      { source: '/forgot-password', destination: '/auth/forgot-password', permanent: true },
      { source: '/reset-password', destination: '/auth/reset-password', permanent: true },
      { source: '/admin/dashboard', destination: '/owner/dashboard', permanent: true },
      { source: '/admin/orders', destination: '/owner/orders', permanent: true },
      { source: '/admin/menu', destination: '/owner/menu', permanent: true },
      { source: '/admin/tables', destination: '/owner/tables', permanent: true },
      { source: '/admin/settings', destination: '/owner/settings', permanent: true },
      { source: '/', destination: '/intro', permanent: false },
    ];
  },
};

module.exports = nextConfig; 