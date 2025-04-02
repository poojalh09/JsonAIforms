/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

// module.exports = {
//   output: 'export',
//   excludeFiles: [
//     'app/api/get-table-ids/**',  // Excludes entire directory
//     // or
//     'app/api/get-table-ids/route.js'  // Excludes specific file
//   ]
// }
