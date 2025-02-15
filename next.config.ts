import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false,
  },
  transpilePackages: ["swiper", "ssr-window", "dom7"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "swiper/css": require.resolve("swiper/swiper.min.css"),
      "swiper/css/navigation": require.resolve(
        "swiper/modules/navigation/navigation.min.css"
      ),
      "swiper/css/pagination": require.resolve(
        "swiper/modules/pagination/pagination.min.css"
      ),
    };
  },

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
