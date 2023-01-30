/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "c.saavncdn.com",
      "www.jiosaavn.com",
    ]
  }
}

module.exports = nextConfig
