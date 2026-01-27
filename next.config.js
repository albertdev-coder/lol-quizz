/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },
  // 👇 Fuerza runtime Node.js para Railway
  serverRuntimeConfig: {},
  reactStrictMode: true,
};

module.exports = nextConfig;
