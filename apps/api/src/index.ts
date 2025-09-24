import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Credentials from '@auth/core/providers/credentials'
import { CustomDrizzleAdapter } from './libs/custom-adapter'
import { cors } from 'hono/cors'
import { InvalidCreds, InvalidPassword, UserNotExists, verifyPassword } from './libs/utils'
import z from "zod"
import { CreateUserValidate } from './zod/AdapterValidations'

type Env = {
  Bindings: {
    AUTH_SECRET: string
  }
}

const app = new Hono<Env>()

app.use(
  '*',
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Custom-Header',
      'Upgrade-Insecure-Requests'
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

app.use(logger())

app.use("*", initAuthConfig((c) => ({
  secret: c.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password"
        },
        userName: {
          label: "Username",
          type: "user"
        },
      },
      async authorize(credentials) {

        if (!credentials.email || !credentials.password) {
          throw new InvalidCreds()
        }

        // Check user already exists
        const checkUser = await CustomDrizzleAdapter.checkUserWithEmail(credentials.email as string)
        if (!checkUser) {
          throw new UserNotExists()
        }

        if (!(await verifyPassword(credentials.password as string, checkUser.password))) {
          throw new InvalidPassword()
        }

        return {
          email: checkUser?.email,
          name: checkUser?.userName
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60
  },
  jwt: {
    maxAge: 2 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        throw new Error("User not exists")
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ token, session }) {
      if (token?.name) {
        session.user.email = token?.email!
        session.user.name = token?.name!
      }
      return session
    },
  }
})))


app.post("/api/auth/signup", async (c) => {
  try {
    const body = await c.req.json()

    // zod check request input
    const valid = CreateUserValidate.parse(body)

    const user = await CustomDrizzleAdapter.createUser({
      email: valid.email,
      userName: valid.userName,
      password: valid.password
    })

    return c.json({
      message: "User created",
      data: {
        email: user?.email,
        userName: user?.userName
      }
    }, 200)

  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("Validation error:", err.issues);
      throw new Error("Invalid input");
    }
    console.log(err)
  }

})

app.use("/api/auth/*", authHandler())

app.use("/api/*", verifyAuth())

app.get('/api/protected', (c) => {
  const auth = c.get('authUser')
  return c.json(auth)
})

export default app
