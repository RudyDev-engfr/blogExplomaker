module.exports = {
  reactStrictMode: false,
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
