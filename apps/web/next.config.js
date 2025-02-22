/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui', 'react-textfit'],
  experimental: {
    esmExternals: 'loose',
  },
};
