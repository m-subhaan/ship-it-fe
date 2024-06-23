/** @type {import('next').NextConfig} */
const config = {
  env: {
    SERVER_URL: `http://ec2-54-227-17-26.compute-1.amazonaws.com`,
    API_VERSION: `api/v1`,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
