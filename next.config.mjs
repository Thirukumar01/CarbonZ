/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ["@supabase/ssr", "@supabase/supabase-js"],
  },
};

export default nextConfig;

