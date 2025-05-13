import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ferf1mheo22r9ira.public.blob.vercel-storage.com",
        port: "", // kosong jika default 443
        pathname: "/**", // semua path di bawah hostname ini
      },
    ],
  },
};

export default nextConfig;
