import { CredentialsSignin } from "@auth/core/errors"
import bcrypt from "bcryptjs"

// Check valid passowrd
const verifyPassword = async (inputPassword: string, storedHash: string) => {
  if (!inputPassword || !storedHash) {
    throw new Error("Bad Request")
  }
  return await bcrypt.compare(inputPassword, storedHash)
}

// Helper error handlers
class InvalidCreds extends CredentialsSignin {
  code = "Invalid Credentials"
}

class UserNotExists extends CredentialsSignin {
  code = "User not exists"
}

class InvalidPassword extends CredentialsSignin {
  code = "Invalid Password"
}



export { verifyPassword, InvalidCreds, UserNotExists, InvalidPassword }
