import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/create",
        destination: "/compose",
        permanent: false,
      },
      {
        source: "/drafts",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;