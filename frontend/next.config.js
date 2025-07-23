/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'res.cloudinary.com', 
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'images-cdn.ubuy.co.in',
      'encrypted-tbn0.gstatic.com',
      'cdn3.evostore.io'
    ]
  }
}

module.exports = nextConfig
