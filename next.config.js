/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.flixcart.com'
      },
      {
        protocol: 'https',
        hostname: 'rukminim1.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukminim2.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukmini1.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukmini2.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukminim*.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: 'rukmini*.flixcart.com',
      },
      {
        protocol: 'https',
        hostname: '*.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.myntassets.com',
      },
      {
        protocol: 'https',
        hostname: '*.ajio.com',
      },
      {
        protocol: 'https',
        hostname: '*.nykaa.com',
      },
      {
        protocol: 'https',
        hostname: 'images.nykaa.com',
      }
    ],
    // More permissive format to ensure any external image can be loaded during development
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'via.placeholder.com',
      'images.unsplash.com',
      'i.imgur.com',
      'res.cloudinary.com',
      'www.example.com' // Add any other domains you might use for images
    ],
  },
  // Enable strict mode for better React development
  reactStrictMode: true,
   output: 'standalone',
};

module.exports = nextConfig;
