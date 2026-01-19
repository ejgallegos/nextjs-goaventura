/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'cdn.goaventura.com.ar',
      'localhost'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features
  experimental: {
    // Enable app directory features
    appDir: true,
    
    // Optimize server components
    serverComponentsExternalPackages: [
      'firebase-admin',
      'firebase',
      '@firebase/auth',
      '@firebase/firestore',
      '@firebase/storage'
    ],
    
    // Bundle size optimizations
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage'
    ],
    
    // Enable server actions
    serverActions: true,
    
    // Optimized builds
    optimizeCss: true,
    scrollRestoration: true,
    
    // Large page data handling
    largePageDataBytes: 128 * 1000, // 128KB
    
    // Incremental adoption
    missingSuspenseWithCSRBailout: false,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    
    // SWC optimizations
    styledComponents: true,
    
    // Emotion optimizations
    emotion: true,
  },

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, must-revalidate',
        },
      ],
    },
  ],

  // Redirects
  async redirects() {
    return [
      // Admin routes - redirect to login if not authenticated
      {
        source: '/admin/:path*',
        has: [
          {
            type: 'header',
            key: 'authorization',
            value: undefined,
          },
        ],
        destination: '/login',
        permanent: false,
      },
      // Trailing slash normalization
      {
        source: '/admin/:path*/',
        destination: '/admin/:path*',
        permanent: true,
      },
      // Old routes redirection
      {
        source: '/blog/:slug',
        destination: '/blog/posts/:slug',
        permanent: true,
      },
    ];
  },

  // Rewrites for proxy and optimization
  async rewrites() {
    return [
      // Firebase functions proxy
      {
        source: '/api/firebase/:path*',
        destination: 'https://firebase.googleapis.com/:path*',
      },
      // CDN rewrites
      {
        source: '/cdn/:path*',
        destination: 'https://cdn.goaventura.com.ar/:path*',
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer, dev, webpack }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Resolve Firebase modules correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase/auth': '@firebase/auth',
      'firebase/firestore': '@firebase/firestore',
      'firebase/storage': '@firebase/storage',
    };

    // Ignore warnings for certain dependencies
    config.ignoreWarnings = [
      {
        module: /node_modules\/firebase\/.*/,
      },
      {
        message: /export .* was not found in/,
      },
    ];

    // Define plugin for environment variables
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.NEXT_PUBLIC_SITE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SITE_URL),
      })
    );

    return config;
  },

  // Bundle analyzer for production builds
  bundleAnalyzerRouter: {
    enabled: process.env.ANALYZE === 'true',
  },

  // Output configuration
  output: 'standalone',

  // Compression
  compress: true,

  // Logging
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Page extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.goaventura.com.ar' 
    : undefined,

  // Generate sitemap
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },

  // Enable static generation for certain pages
  generateEtags: true,

  // HTTP Agent configuration
  httpAgentOptions: {
    keepAlive: true,
  },

  // Powered by header
  poweredByHeader: false,

  // Trust host for production
  trailingSlash: false,
};

module.exports = nextConfig;