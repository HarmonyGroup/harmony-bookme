import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/users";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string | null;
    role: string;
    permissions: string[];
    avatar: string;
    isNewsletterSubscribed: boolean;
    businessName?: string | null; // Added for vendor role
    vendorAccountPreference?: string; // Added for vendor role
    lastLogin: string | null; // Added for last login timestamp
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      phone: string | null;
      role: string;
      permissions: string[];
      avatar: string;
      isNewsletterSubscribed: boolean;
      businessName?: string | null; // Added for vendor role
      vendorAccountPreference?: string; // Added for vendor role
      lastLogin: string | null; // Added for last login timestamp
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            lastLogin: new Date().toISOString(),
          });

          return {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            businessName: user.role === "vendor" ? user.businessName || null : null,
            username: (user as { username?: string }).username || user.email,
            email: user.email,
            phone: user.phone || null,
            role: user.role,
            permissions: user.permissions || [],
            avatar: user.avatar || "",
            isNewsletterSubscribed: user.settings?.isNewsletterSubscribed || false,
            ...(user.role === "vendor" && {
              vendorAccountPreference: user.vendorAccountPreference,
            }),
            lastLogin: new Date().toISOString(),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
        token.email = user.email;
        token.phone = user.phone;
        token.role = user.role;
        token.permissions = user.permissions;
        token.avatar = user.avatar;
        token.isNewsletterSubscribed = user.isNewsletterSubscribed;
        token.businessName = user.businessName;
        token.vendorAccountPreference = user.vendorAccountPreference;
        token.lastLogin = user.lastLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string | null;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
        session.user.avatar = token.avatar as string;
        session.user.isNewsletterSubscribed = token.isNewsletterSubscribed as boolean;
        session.user.businessName = (token.businessName as string) ?? null;
        session.user.vendorAccountPreference = (token.vendorAccountPreference as string) ?? null;
        session.user.lastLogin = (token.lastLogin as string) ?? null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
