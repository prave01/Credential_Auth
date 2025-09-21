import { integer, pgTable, varchar } from "drizzle-orm/pg-core"

export const userTable = pgTable("users", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),
  FirstName: varchar({ length: 254 }).notNull(),
  LastName: varchar({ length: 254 }),
  Age: integer().notNull(),
  Email: varchar({ length: 255 }).notNull().unique()
})
