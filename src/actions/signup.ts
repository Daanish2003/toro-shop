"use server"
import { signupSchema } from "@/zod/signupSchema"
import { z } from "zod"
import { hash } from "argon2"
import { getUserByEmail } from "@/helpers/query/getUser"
import { createUser } from "@/helpers/mutation/user"
import { sendVerificationEmail } from "@/helpers/mail/authMail"
import { generateVerificationToken } from "@/lib/token"


export const signup = async(values: z.infer<typeof signupSchema>) => {
     const validatedFields = signupSchema.safeParse(values)

     if(!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
     }

     const { email, password } = validatedFields.data

     const hashedPassword = await hash(password)
     console.log(hashedPassword)

     const existingUser = await getUserByEmail(email)

     console.log(existingUser)

     if(existingUser) {
      try {
         if(existingUser.emailVerified === null) {
            return {
               error: "User already exist please verify your email"
            }
         }

         return {
            error: "User already exists"
         }
      } catch (error) {
         return null
      }
     }


     const newUser = await createUser(email, hashedPassword)

     console.log(newUser)

     if (!newUser) {
        return {
            error: "Failed to create user"
        }
     }

   
     const verificationToken = await generateVerificationToken(email)

     const response = await sendVerificationEmail(email, verificationToken.token)
    
     if(response.error) {
         return {
            error: response.error
         }
     }

     return {
        success: response.success
     }
}