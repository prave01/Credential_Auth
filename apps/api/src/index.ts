import { Hono } from 'hono'

type Env = {
  Bindings: {
    FIRST_ENV: string
  }
}

const app = new Hono<Env>()

app.get('/register', (c) => {
  return c.json({ message: "Fuck" }, 200)
})


export default app
