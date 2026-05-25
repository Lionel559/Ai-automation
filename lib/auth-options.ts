import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== "google") {
        return true;
      }

      const normalizedEmail = user.email?.trim().toLowerCase();

      if (!normalizedEmail) {
        return false;
      }

      await connectToDatabase();

      const existingUser = await User.findOne({ email: normalizedEmail });

      if (!existingUser) {
        await User.create({
          name: user.name?.trim() || normalizedEmail.split("@")[0],
          email: normalizedEmail,
          password: "",
          provider: "google",
          plan: "free",
          dailyLimit: 10,
        });
      }

      return true;
    },
    async redirect({ baseUrl, url }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/dashboard`;
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }

      return `${baseUrl}/dashboard`;
    },
  },
};
