import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Credentials from '@auth/core/providers/credentials'
import { CustomDrizzleAdapter } from './libs/custom-adapter'
import { cors } from 'hono/cors'

type Env = {
  Bindings: {
    AUTH_SECRET: string
  }
}

const app = new Hono<Env>()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.use(logger())

app.use(
  '*',
  initAuthConfig((c) => ({
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
          firstName: {
            label: "First name",
            type: "name"
          },
          lastName: {
            label: "Last name",
            type: "name"
          },
          age: {
            label: "age",
            type: "number"
          }
        },
        async authorize(credentials) {

          // Check user already exists
          const checkUser = await CustomDrizzleAdapter.checkUserWithEmail(credentials.email as string)

          if (checkUser) {
            console.log("User already exists")
            return {
              email: checkUser?.email,
              name: `${checkUser?.firstName} ${checkUser?.lastName}`
            }
          }

          const { email, age, firstName, lastName, password } = credentials

          // Creating the user
          const user = await CustomDrizzleAdapter.createUser({
            email: email as string,
            age: Number(age),
            password: password as string,
            firstName: firstName as string,
            lastName: lastName as string
          })

          return {
            email: user?.email,
            name: `${user?.firstName} ${user?.lastName}`
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
        c.redirect('/api/protected')
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
      }
    }
  }))
)

app.use("/api/auth/*", authHandler())

app.use("/api/*", verifyAuth())

app.get('/api/protected', (c) => {
  const auth = c.get('authUser')
  return c.json(auth)
})


export default app
