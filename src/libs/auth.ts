import Database from "better-sqlite3";
import { betterAuth } from "better-auth";

const db = new Database("./auth.db");

export const auth = betterAuth({
  database: db,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET!,

  emailAndPassword: {
    enabled: true,
  },
});