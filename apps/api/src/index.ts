import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import Credentials from '@auth/core/providers/credentials'
import { CustomDrizzleAdapter } from './libs/custom-adapter'
import { cors } from 'hono/cors'
import { InvalidCreds, InvalidPassword, UserNotExists, verifyPassword } from './libs/utils'
import z from "zod"
import { CreateUserValidate } from './zod/AdapterValidations'
import * as jwt from "@auth/core/jwt";
import { getCookie, setCookie } from 'hono/cookie'
import { refreshToken } from 'better-auth/api'

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
    maxAge: 30,
    updateAge: 20
  },
  jwt: {
    maxAge: 5 * 60 * 60,
  },
  callbacks: {
    async signIn({ user }) {
      if (!user) {
        throw new Error("User not exists")
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        console.log("erere", account?.refresh_token)


        // // generate refresh token
        // const refreshToken = await jwt.encode({
        //   secret: c.env.AUTH_SECRET,
        //   salt: "refresh",
        //   token: { email: user.email, name: user.name },
        //   maxAge: 60 * 60 * 24 * 7,
        // });
        //

      }
      return token; // return token normally
    }, async session({ token, session }) {
      if (token?.name) {
        session.user.email = token?.email!
        session.user.name = token?.name!
      }
      return session
    },
    redirect() {
      return ""
    }
  },
})))

app.post("/api/auth/refresh", async (c) => {

  // sends new access token to the client
  try {
    const refreshToken = getCookie(c, "refresh-token")

    console.log("asdfas", refreshToken)

    if (!refreshToken) {
      throw new Error("No refresh token founded")
    }

    // verify refreshToken
    const verify = await jwt.decode({
      salt: "refresh",
      secret: c.env.AUTH_SECRET,
      token: refreshToken
    })

    if (!verify) {
      throw new Error("Invalid refresh token")
    }

    //create new accessToken
    const newAccessToken = await jwt.encode({
      secret: c.env.AUTH_SECRET,
      salt: "authjs.session-token",
      token: {
        email: verify.email,
        name: verify.name
      },
      maxAge: 5 * 60 * 60,
    })

    return c.json({ newAccessToken }, 200)
  } catch (err: any) {
    return c.json(err, 400)
  }
});


app.post("/api/auth/signup", async (c) => {
  try {
    const body = await c.req.json()

    // Check user already exists
    const checkUser = await CustomDrizzleAdapter.checkUserWithEmail(body.email)
    if (checkUser) {
      throw new Error("User already exists, Try logging in")
    }

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

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.error("Validation error:", err.issues);
      return c.json(err.toString(), 400)
    }
    return c.json(err.toString(), 400)
  }
})

app.use("/api/auth/*", authHandler())

app.use("/api/*", verifyAuth())

app.get('/api/protected', (c) => {
  const auth = c.get('authUser')
  return c.json(auth)
})

export default app
