module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com', 'manage.explomaker.fr'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.explomaker.fr',
      },
    ],
  },
}
