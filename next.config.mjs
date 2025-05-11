/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    // Add Netlify image domains for image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.netlify.app',
      },
    ],
  },
  // Optional: Add a trailing slash for better compatibility
  trailingSlash: true,
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Disable ESLint during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Check if we're in a Netlify environment
if (process.env.NETLIFY === 'true') {
  // Add any Netlify-specific configurations here
  console.log('Running in Netlify environment');
}

export default nextConfig;
