import { Hono } from 'hono'

type Env = {
  Bindings: {
    FIRST_ENV: string
  }
}

const app = new Hono<Env>()

app.get('/', (c) => {
  console.log(c.env.FIRST_ENV)
  return c.text('Hello Hono!')
})

export default app
