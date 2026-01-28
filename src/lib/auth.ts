import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow sign in if email matches admin email
      const adminEmail = process.env.ADMIN_EMAIL;
      if (!adminEmail) {
        console.error("ADMIN_EMAIL not configured");
        return false;
      }
      return user.email === adminEmail;
    },
    async session({ session }) {
      // Add isAdmin flag to session
      if (session.user) {
        session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
