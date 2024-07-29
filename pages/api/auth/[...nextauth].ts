import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [

		GoogleProvider({
			clientId: `${process.env.GOOGLE_CLIENT_ID}`,
			clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
			authorization: {
				params: {
				  prompt: "consent",
				  access_type: "offline",
				  response_type: "code"
				}
			  }
		}),
	],
	secret: 'secret',
	session: {
		maxAge: 30 * 24 * 60 * 60 * 100,
	},
	// debug: true,
	callbacks: {
		
		async signIn({ profile, ...rest }: any) {
			// console.log({profile});
			// return true
			try {console.log({profile}, "------ from signIn ---")
			const { data } = await axios.post(
				`${process.env.NODE_ENV === 'production' ? `/` : process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/user`,
				{
					profile,
				},
			);
			if (data.data) return true;
			return false;}
			 catch(error) {
				console.log("error", error)
				return false
			 }
		},
		
		 redirect({ url, baseUrl } : any) {
		  console.log({url, baseUrl})
		//   return baseUrl;
		// Allows relative callback URLs
		if (url.startsWith("/")) return `${baseUrl}${url}`
		// Allows callback URLs on the same origin
		else if (new URL(url).origin === baseUrl) return url
		return baseUrl
		 },
		//  async session({ session, user, token } : any) {
		//   console.log({ session, user, token })
		//   return session
		//  },
		//  async jwt(param : any) {
		//   console.log(param, "------ from jwt -----")
		//   return param.token
		// }
	},
	pages: {
		signIn: '/login',
	},
};

export default NextAuth(authOptions);
