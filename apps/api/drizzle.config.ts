import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({
  path: ".dev.vars"
})

export default defineConfig({
  out: './drizzle',
  schema: './src/libs/database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEON_URI as string,
  },
});
