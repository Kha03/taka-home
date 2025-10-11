import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable optimizations for better navigation performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Image optimization
  images: {
    // Enable image optimization
    formats: ["image/webp", "image/avif"],
    // Add domains if using external images
    domains: [],
    // Optimize image loading
    minimumCacheTTL: 60,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable compression
  compress: true,

  // Power optimizations
  poweredByHeader: false,
};

export default nextConfig;
