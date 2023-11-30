import NextAuth, { Awaitable, SessionStrategy, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/libs/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userFound = await db.users.findUnique({
          where: {
            UserName: credentials?.username,
          },
        });
        if (!userFound)
          throw new Error("Not user found. Please check your credentials.");

        return {
          id: userFound.UUID,
          uuid: userFound.UUID,
          name: userFound.UserName,
          email: userFound.Email,
          rol: userFound.role_id,
        } as Awaitable<User | null>;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.user as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
