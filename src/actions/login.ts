"use server"

import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/helpers/mail/authMail";
import { createTwoFactorConfirmation, deleteTwoFactorConfirmation, deleteTwoFactorToken } from "@/helpers/mutation/deleteTwoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/helpers/query/getConfirmation";
import { getTwoFactorTokenByEmail } from "@/helpers/query/getToken";
import { getUserByEmail } from "@/helpers/query/getUser"
import { createSession } from "@/lib/session"
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { signinSchema, signinType } from "@/zod/signinSchema";
import { verify } from "argon2";

export default async function login(values: signinType) {
     const validatedFields = signinSchema.safeParse(values)

     if(!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
     }

     const { email, password, code } = validatedFields.data

     const existingUser = await getUserByEmail(email);

     console.log(existingUser)

     if(!existingUser || !existingUser.email || !existingUser.password) {
        return {
            error: "Email does not exist"
        }
     }

     const validPassword = await verify(existingUser.password, password)

     if(!validPassword) {
        return {
            error: "Invalid Password"
        }
     }

     if(!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      )

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return { success: "Confirmation email sent"};
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email) {
      if(code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
           existingUser.email
        );

        if(!twoFactorToken) {
         return {
            error: "Invalid Code"
         }
        }

        if(twoFactorToken.token !== code) {
           return { error: "Invalid code!"}
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if(hasExpired) {
           return {
            error: "Code has expired"
           }
        }

        await deleteTwoFactorToken(twoFactorToken.id)

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
             existingUser.id
        )

        if(existingConfirmation) {
            await deleteTwoFactorConfirmation(existingConfirmation.id)
        
         }

         await createTwoFactorConfirmation(existingUser.id)
      } else {
         const twoFactorToken = await generateTwoFactorToken(existingUser.email)
         await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
         );

         return { twoFactor: true}
      }
    }
    
     await createSession(existingUser.id , existingUser.role)

     return {
        success: "Logged In"
     }
     
     
}