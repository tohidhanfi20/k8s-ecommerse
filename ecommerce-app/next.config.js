/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'fakestoreapi.com',
            port: '',
          },
          {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
          },
        ],
      },
}

module.exports = nextConfig
