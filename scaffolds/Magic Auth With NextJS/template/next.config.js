/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		MAGIC_API_KEY: process.env.MAGIC_API_KEY,
	},
}

module.exports = nextConfig
