import NextAuth, { NextAuthOptions, Profile } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { findOrCreateUser } from 'helpers/server/db';

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
		maxAge: 30 * 24 * 60 * 60,
	},
	callbacks: {
		async signIn({ profile }: { profile?: Profile }) {
			try {
				if (!profile) return false;
				const user = await findOrCreateUser(profile);
				return !!user;
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
