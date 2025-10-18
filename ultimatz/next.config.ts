import type { NextConfig } from "next"

if (typeof process !== "undefined" && !process.env.NEXT_DISABLE_FONT_DOWNLOADS) {
  process.env.NEXT_DISABLE_FONT_DOWNLOADS = "1"
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
