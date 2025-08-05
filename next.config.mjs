/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle dynamic imports better
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Create a separate chunk for Circle SDK
        circle: {
          name: 'circle-sdk',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]@circle-fin[\\/]/,
          priority: 20,
        },
        // Create a separate chunk for viem
        viem: {
          name: 'viem',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]viem[\\/]/,
          priority: 20,
        },
        // Vendor chunk for other dependencies
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
      },
    }
    
    // Handle chunk loading errors
    config.output.chunkLoadingGlobal = 'webpackChunkLoad'
    
    return config
  },
  experimental: {
    // Enable better chunk loading
    optimizePackageImports: ['@circle-fin/modular-wallets-core', 'viem'],
  },
}

export default nextConfig
