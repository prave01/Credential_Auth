import { CreateUserValidate } from "../zod/AdapterValidations"
import z from "zod"
import db from "./database/db"
import { authUserTable } from "./database/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs";

// Infer from zod
type CreateUserTypes = z.infer<typeof CreateUserValidate>

export const CustomDrizzleAdapter = {
  createUser: async ({
    email,
    password,
    firstName,
    lastName,
    age
  }: CreateUserTypes) => {
    try {
      const data = {
        email,
        age,
        password,
        firstName,
        lastName,
      }

      // zod check request input
      const valid = CreateUserValidate.parse(data)

      //password hashing
      const hashedPassword = await bcrypt.hash(valid.password, 10)

      // create user in db
      const [user] = await db.insert(authUserTable).values({
        email: valid.email,
        firstName: valid.firstName,
        lastName: valid.lastName,
        age: valid.age,
        password: hashedPassword
      }).returning()

      return user
    }
    catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Validation error:", err.issues);
        throw new Error("Invalid input");
      }
      console.error("Database error:", err);
      throw err;
    }
  },
  checkUserWithEmail: async (email: string) => {

    //Checks email already exists
    try {
      const validEmail = z.object({
        email: z.email()
      }).parse({ email })

      const result = await db.select().from(authUserTable).where(eq(authUserTable.email, validEmail.email))

      if (result.length > 0) {
        return result[0]
      }
      return false
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        console.error("Validation error:", err.issues);
        throw new Error("Invalid input");
      }
      console.error("Database error:", err);
      throw new Error(err.toString())
    }
  }
}
