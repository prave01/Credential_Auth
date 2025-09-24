import z from "zod"

const CreateUserValidate = z.object({
  email: z.email(),
  password: z.string(),
  userName: z.string()
})

export { CreateUserValidate }
