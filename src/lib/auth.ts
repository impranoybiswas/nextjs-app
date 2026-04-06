import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { client } from "@/lib/mongodb";
import { sendMail } from "./mailer";
import { verificationTemplate } from "./email-templates";

export type UserRole = "admin" | "moderator" | "user";

export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.DATABASE_NAME!)),

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        // ✅ reusable mailer
        to: user.email,
        subject: "Verify your email",
        html: verificationTemplate(user.name, url),
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // daily refresh
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  // Better Auth built-in admin plugin — role management handle করে
  plugins: [admin()],

  // নতুন user এর default role
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
        input: false, // user নিজে set করতে পারবে না
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
