import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // Needed for X (Twitter)
    }),
  ],
  pages: {
    signIn: "/login", // Custom login page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl; // always redirect to home after login
    },
  },
});

export { handler as GET, handler as POST };
