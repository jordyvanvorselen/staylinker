import withPWA from 'next-pwa';

// Using a two-step type conversion to handle the complex type incompatibility
const withPwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Apply the configuration
const nextConfig = withPwaConfig({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
});

export default nextConfig;
