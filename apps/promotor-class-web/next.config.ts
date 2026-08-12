import type { NextConfig } from "next";

// Workspace packages ship TypeScript source only (exports point at ./src/index.ts),
// so Next must compile them from source instead of resolving built output.
const nextConfig: NextConfig = {
  transpilePackages: [
    "@promotor/api-client",
    "@promotor/config",
    "@promotor/contracts",
    "@promotor/platform-core",
    "@promotor/promotor-class-fixtures",
  ],
};

export default nextConfig;
