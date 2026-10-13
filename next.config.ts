import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "images.entitysport.com", pathname: "/assets/uploads/**" },
      { protocol: "https", hostname: "gcdnimages.entitysport.com", pathname: "/assets/uploads/**" },
      { protocol: "https", hostname: "gcdnimages.entitysport.com", pathname: "/soccer/**" },
      { protocol: "https", hostname: "nfl.entitysport.com", pathname: "/assets/**" },
      { protocol: "https", hostname: "a.espncdn.com", pathname: "/i/teamlogos/nfl/**" },
      { protocol: "https", hostname: "rest.entitysport.com", pathname: "/**" },
      { protocol: "https", hostname: "a.espncdn.com", pathname: "/i/teamlogos/nfl/**" },
    ],
  },
};

export default nextConfig;
