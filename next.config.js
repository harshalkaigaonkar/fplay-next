/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "c.saavncdn.com"
    ]
  }
}

module.exports = nextConfig
