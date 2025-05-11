/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  
  // Disable ESLint during build
  eslint: {
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
