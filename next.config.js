/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'c.saavncdn.com',
			},
			{
				protocol: 'https',
				hostname: 'www.jiosaavn.com',
			},
			{
				protocol: 'https',
				hostname: 'static.saavncdn.com',
			},
		],
	},
};

module.exports = nextConfig;
