import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { config } from "dotenv"

config({
  path: ".dev.vars"
})

console.log("URI", process.env.NEON_URI!)

// creates neon client
const pg = neon(process.env.NEON_URI as string)

// adds the drizzle adapter
const db = drizzle(pg)

// exports the drizzle instance
export default db
