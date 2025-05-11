/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true, // Disable Image Optimization API as it's not needed for static exports
  },
  // For static export
  output: 'export',
  // Optional: Add a trailing slash for Netlify compatibility
  trailingSlash: true,
  // Optional: Enable React Strict Mode
  reactStrictMode: true,
  // Optional: Configure the base path if your app is not served from the root
  // basePath: '/your-base-path',
};

// Check if we're in a Netlify environment
if (process.env.NETLIFY === 'true') {
  // Add any Netlify-specific configurations here
  console.log('Running in Netlify environment');
}

export default nextConfig;
