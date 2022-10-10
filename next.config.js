module.exports = {
  reactStrictMode: false,
  images: {
    domains: ['storage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.storage.googleapis.com',
      },
    ],
  },
}
