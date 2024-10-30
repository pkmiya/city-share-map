/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  images: { unoptimized: true },
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function () {
  return nextConfig;
}
