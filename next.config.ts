import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Include other experimental features here, but no appDir
  },
  async headers() {
    return [
      {
        source: "/api/:path*", // Ensure API responses don't trigger middleware
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  // Adding the matcher to control which paths trigger the middleware
  matcher: ["*"], // You can specify paths here
};

export default nextConfig;
