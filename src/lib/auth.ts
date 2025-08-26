
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.hashedPassword) return null;
        const ok = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!ok) return null;
        return { id: user.id, name: user.name || null, email: user.email || null, image: user.image || null, role: user.role };
      }
    })
  ],
  callbacks: {
    async session({ session, user, token }) {
      // For database strategy, user is available
      if (session.user) {
        // @ts-ignore
        session.user.id = user.id;
        // @ts-ignore
        session.user.role = user.role;
      }
      return session;
    }
  },
};
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
