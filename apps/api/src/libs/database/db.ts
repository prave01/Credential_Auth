import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { config } from "dotenv"
import * as schema from "./schema"

config({
  path: ".dev.vars"
})

// creates neon client
const pg = neon(process.env.NEON_URI as string)

// adds the drizzle adapter
const db = drizzle({
  client: pg,
  schema: schema
})

// exports the drizzle instance
export default db
