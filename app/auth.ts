import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../app/lib/prisma";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

// ── Module augmentation for NextAuth v5 Beta ──────────────────────────────────
declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
  }
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  // ✅ NextAuth v5 Beta uses @auth/core/jwt — NOT next-auth/jwt
  interface JWT {
    id?: string;
    username?: string;
  }
}

function generateUsername(email: string) {
  return email.split("@")[0] + "_" + Math.floor(1000 + Math.random() * 9000);
}

const config: NextAuthConfig = {
  // ✅ Use NextAuthConfig as explicit type — NOT `satisfies`
  //    `satisfies` triggers stricter callback variance checks in v5 Beta
  debug: process.env.NODE_ENV === "development",
  trustHost: true,

  adapter: PrismaAdapter(prisma) as Adapter,

  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          username: user.username ?? undefined,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // ✅ NO explicit param type annotations — let NextAuth v5 Beta infer
    async signIn({ user, account }) {
      if (!user.email) return true;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        if (!existingUser.username) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { username: generateUsername(user.email) },
          });
        }

        if (account?.provider !== "credentials" && account) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
            },
          });
        }

        user.id = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            username: generateUsername(user.email),
          },
        });

        user.id = newUser.id;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
      }

      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);