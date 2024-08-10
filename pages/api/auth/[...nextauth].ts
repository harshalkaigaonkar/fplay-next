import axios from 'axios';
import NextAuth, { NextAuthOptions, Profile } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: `${process.env.GOOGLE_CLIENT_ID}`,
			clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		maxAge: 30 * 24 * 60 * 60 * 100,
	},
	callbacks: {
		async signIn({ profile }: { profile?: Profile }) {
			try {
				const { data } = await axios.post(
					`${
						process.env.NODE_ENV === 'production'
							? process.env.NEXTAUTH_URL
							: 'http://localhost:3000'
					}/api/user`,
					{
						profile,
					},
				);
				if (data.data) return true;
				return false;
			} catch (error) {
				console.error(`Error: some issue with adding user | ${error}`);
				return false;
			}
		},
	},
	pages: {
		signIn: '/login',
		error: '/error',
	},
};

export default NextAuth(authOptions);
