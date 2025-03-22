/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cr-mentor.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      }
    ],
  },
};

export default nextConfig;
