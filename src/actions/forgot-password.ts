"use server"
import { sendPasswordResetEmail } from "@/helpers/mail/authMail";
import { getUserByEmail } from "@/helpers/query/getUser";
import { generatePasswordResetToken } from "@/lib/token";
import { forgotPasswordSchema, forgotPasswordType } from "@/zod/forgotPasswordSchema";

export default async function forgotPassword(values: forgotPasswordType) {
    const validatedFields = forgotPasswordSchema.safeParse(values)

    if(!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    
    if(!existingUser) {
        return {
            error: "Email does not exist"
        }
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    const response = await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    if(response.error) {
        return {
            error: "Error sending email"
        }
    }

    return {
        success: "Email sent"
    }
}