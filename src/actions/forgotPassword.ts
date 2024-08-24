"use server"
import { getUserByEmail } from "@/helpers/data/getUser";
import sendPasswordResetEmail from "@/helpers/mail/sendPasswordResetEmail";
import { generatePasswordResetToken } from "@/helpers/token/genPasswordResetToken";
import { resend } from "@/lib/resend";
import { ResetSchema } from "@/lib/zod/resetSchema";
import { z } from "zod";

export default async function forgotPassword(values: z.infer<typeof ResetSchema>) {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail({email});

    if (!existingUser) {
      return { error: "Email not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email)

    const response = await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    if(response.error) {
        return {
            error: response.error
        }
    }

    return {
        success: response.success
    }
}