import { getUsersCollection } from "@/libs/collection";
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    // 🧩 1️⃣ Create or enrich JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email || "";
        token.name = user.name || "";
        token.image = user.image || "";
        token.role = "user"; // default role
      }

      try {
        if (token.email) {
          const users = await getUsersCollection();
          const dbUser = await users.findOne({ email: token.email });
          if (dbUser?.role) {
            token.role = dbUser.role;
          }
        }
      } catch (err) {
        console.error("DB fetch failed:", err);
      }

      return token;
    },

    // 🧩 2️⃣ Attach token fields to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    // 🧩 3️⃣ Create or update user in DB on sign-in
    async signIn({ user, account }) {
      const users = await getUsersCollection();

      if (account?.provider === "google") {
        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          await users.insertOne({
            name: user.name,
            email: user.email,
            provider: "google",
            image: user.image,
            role: "user", // default role
            createdAt: new Date().toISOString(),
            lastSignInAt: new Date().toISOString(),
          });
        } else {
          await users.updateOne(
            { _id: existingUser._id },
            { $set: { lastSignInAt: new Date().toISOString() } },
          );
        }
      }

      return true;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
};

const { handlers } = NextAuth(authOptions);
export { handlers as GET, handlers as POST };
