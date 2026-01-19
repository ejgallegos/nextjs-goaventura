import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Remove TypeScript and ESLint build bypasses for production security
  typescript: process.env.NODE_ENV === 'development' ? {
    ignoreBuildErrors: true,
  } : undefined,
  eslint: process.env.NODE_ENV === 'development' ? {
    ignoreDuringBuilds: true,
  } : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Firebase storage domains
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.web.app` : '',
        port: '',
        pathname: '/**',
      },
    ],
    // Security configurations for images
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Security headers (middleware handles this, but backup here)
  async headers() {
    return [
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
    ];
  },
  // Security configurations
  poweredByHeader: false,
  generateEtags: false,
  
  // Compiler options for security
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features for security
  experimental: {
    // Optimize CSS for security
    optimizeCss: true,
  },
  
  // Webpack configuration for security
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Remove sensitive information from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
