import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseHostname: string | undefined;
try {
  if (supabaseUrl) supabaseHostname = new URL(supabaseUrl).hostname;
} catch {
  // ignore
}

const remotePatterns = [
  ...(supabaseHostname
    ? [
        {
          protocol: "https" as const,
          hostname: supabaseHostname,
          pathname: "/storage/v1/object/public/**",
        },
        {
          protocol: "https" as const,
          hostname: supabaseHostname,
          pathname: "/storage/v1/object/sign/**",
        },
      ]
    : []),
  {
    protocol: "https" as const,
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

const nextConfig: NextConfig = {
  images: remotePatterns.length ? { remotePatterns } : undefined,
};

export default nextConfig;
