"use server"
import { getPasswordResetTokenByEmail, getPasswordResetTokenByToken, getVerificationTokenByToken } from "@/helpers/query/getToken";
import { getUserByEmail } from "@/helpers/query/getUser";
import db from "@/lib/primsa-client";
import { newPasswordSchema, newPasswordType } from "@/zod/newPasswordSchema";
import { hash } from "argon2";

export default async function newPassword(values: newPasswordType, token?: string | null) {
    console.log(token)
    if(!token) {
        return {
            error: "Invalid Token"
        }
    }
    
    const validatedFields = newPasswordSchema.safeParse(values);


    if(!validatedFields.success) {
        return  {
            error: "Invalid Fields"
        }
    }

    const { password } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return {
            error: "Invalid existing token"
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return  {
            error: "Token has expired"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return  {
            error: "Email does not exist!"
        }
    }

    const hashedPassword = await hash(password);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    });

    return { success: "Password updated!" }
}