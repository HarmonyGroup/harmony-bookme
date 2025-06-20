import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

// Define session and JWT types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role:
        | "explorer"
        | "merchant"
        | "team_member"
        | "super_admin"
        | "sub_admin";
      permissions: string[];
      avatar: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "explorer" | "merchant" | "team_member" | "super_admin" | "sub_admin";
    permissions: string[];
    avatar: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password || user.status !== "active") {
          throw new Error("Invalid credentials or account not activated");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name:
            user.role === "explorer"
              ? `${user.firstName} ${user.lastName}`
              : user.businessName || user.email,
          email: user.email,
          role: user.role,
          permissions: user.permissions || [],
          avatar: user.avatar || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
