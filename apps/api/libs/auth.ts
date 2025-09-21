import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { pg } from "./database/db"

// Exports Auth Instance
export const Auth = betterAuth({
  database: drizzleAdapter(pg, {
    provider: "pg"
  })
})
