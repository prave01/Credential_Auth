import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./database/db"

// Exports Auth Instance
export const Auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  })
})
