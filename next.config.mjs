/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    position: 'bottom-left',
  },
  experimental: {
    turbo: {
      enabled: true,
    },
  },
}

export default nextConfig;