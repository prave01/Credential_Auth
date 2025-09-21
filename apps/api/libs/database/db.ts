import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

export const pg = (env: { PG_URL: string }) => {
  if (env.PG_URL === "" || !env.PG_URL) {
    throw Error("Invald Database URL")
  }

  // Init NeonDB + Drizzle 
  const pg = drizzle({
    client: neon(env.PG_URL)
  })

  // returns the pg instance
  return pg
} 
