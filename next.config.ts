import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Demo placeholder photos (Lorem Picsum). Swap/extend for real project image
    // hosts when you have them.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
}

export default nextConfig
