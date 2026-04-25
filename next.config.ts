
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Increase middleware body size limit (Next.js 15+)
  middlewareClientMaxBodySize: '50mb',
};

module.exports = nextConfig;

