import z from "zod"

const CreateUserValidate = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  age: z.number(),
  password: z.string()
})

export { CreateUserValidate }
