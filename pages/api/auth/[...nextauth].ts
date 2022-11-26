import axios from "axios"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  secret: process.env.SECRET,
  session: {
   maxAge: 30 * 24 * 60 * 60 * 100,
  },
  debug: false,
  callbacks: {
    async signIn({ profile, ...rest } : any) {
    const {data} = await axios.post('http://localhost:3000/api/user', {
        profile
      })
    if(data.data) return true
    return false
   }
  //  async redirect({ url, baseUrl } : any) { 
  //   console.log({url, baseUrl})
  //   return baseUrl;
  //  },
  //  async session({ session, user, token } : any) { 
  //   console.log({ session, user, token })
  //   return session
  //  },
  //  async jwt({ token, user, account, profile, isNewUser } : any) {
  //   console.log({ token, user, account, profile, isNewUser })
  //   return token
  // }
  },
  pages: {
   // newUser: "/",
  }
}

export default NextAuth(authOptions);