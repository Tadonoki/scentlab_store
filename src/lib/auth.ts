import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      account: schema.account,
      session: schema.session,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://scentlab-store.vercel.app",
    process.env.BETTER_AUTH_URL,
  ].filter(Boolean) as string[],
  baseURL: process.env.BETTER_AUTH_URL || "https://scentlab-store.vercel.app",
  secret: process.env.BETTER_AUTH_SECRET || "scentlab-store-super-secret-minimal-32-character",
});
