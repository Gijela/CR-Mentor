/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cr-mentor.top',
			},
		],
	},
};

export default nextConfig;
