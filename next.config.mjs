/** @type {import('next').NextConfig} */
const config = {
  env: {
    SERVER_URL: `http://localhost:8080`,
    API_VERSION: `api/v1`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
