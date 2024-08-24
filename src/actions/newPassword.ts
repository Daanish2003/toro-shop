"use server"

import { getPasswordResetTokenByToken } from "@/helpers/data/getPasswordResetTokenByEmail";
import { getUserByEmail } from "@/helpers/data/getUser";
import { NewPasswordSchema } from "@/lib/zod/newPasswordSchema";
import { z } from "zod";
import bcrypt from "bcryptjs"

export default async function newPassword(values: z.infer<typeof NewPasswordSchema>, token?: string | null) {
   if(!token) {
      return { error: "Missing token"} 
   }

   const validatedFields = NewPasswordSchema.safeParse(values);

   if(!validatedFields.success) {
    return {
        error: "Invalid Fields!"
    }
   }

   const { password } = validatedFields.data;

   const existingToken = await getPasswordResetTokenByToken(token);

   if(!existingToken) {
    return { error: "Invalid token"};
   }

   const hasExpired = new Date(existingToken.expires) < new Date();

   if(hasExpired) {
    return {
        error: "Token has expired!"
    }
   }

   const existingUser = await getUserByEmail({email: existingToken.email});

   if(!existingUser) {
    return { error: "Email does not exist!"}
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   await prisma.user.update({
    where: {
        id: existingUser.id
    },
    data: {
        password: hashedPassword
    }
   });

   await prisma.passwordResetToken.delete({
    where: {
        id: existingToken.id
    }
   });

   return { success: "Password updated"}
}