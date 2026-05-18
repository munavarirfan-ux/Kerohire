/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Polling uses fewer native file watchers (helps EMFILE on macOS). Use: NEXT_DEV_POLLING=1 npm run dev
  webpack: (config, { dev }) => {
    if (dev && process.env.NEXT_DEV_POLLING === "1") {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
