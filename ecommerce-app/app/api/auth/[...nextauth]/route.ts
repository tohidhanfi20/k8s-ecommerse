import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Dummy authentication - accept any email/password
        if (credentials?.email && credentials?.password) {
          return {
            id: "1",
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: "https://via.placeholder.com/150/3958D8/FFFFFF?text=User",
            role: "user"
          };
        }
        return null;
      }
    }),
  ],
  callbacks: {
    async session({ token, session }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role || "user";
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
