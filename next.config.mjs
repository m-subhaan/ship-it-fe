/** @type {import('next').NextConfig} */
const config = {
  env: {
    SERVER_URL: `https://api.orbidropshipping.com`,
    API_VERSION: `api/v1`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
