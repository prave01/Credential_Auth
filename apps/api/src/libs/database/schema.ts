import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core"

export const authUserTable = pgTable("auth_users", {
  id: serial('id').primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  userName: text('userName').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
