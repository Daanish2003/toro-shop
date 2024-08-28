"use server"
import EmailVerificationTemplate from "@/components/Email/emailVerificationTemplate";
import passwordResetTemplate from "@/components/Email/passwordResetTemplate";
import TwoFactorEmailTemplate from "@/components/Email/TwoFactorEmailTemplate";
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(
    email: string,
    token: string
) {
   const confirmLink = `${domain}/auth/new-verification?token=${token}`

   const {data, error } = await resend.emails.send({
     from: 'Acme <onboarding@resend.dev>',
     to: [email],
     subject: "Email Verification",
     react: EmailVerificationTemplate(confirmLink)
   })

   if (error) {
    return {
        error: "Failed to send Email"
    }
   }

   return {
    success: "Verification Email has been sent"
   }
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "2FA Code",
    react: TwoFactorEmailTemplate(token)
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  const response = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Reset your password",
    react:passwordResetTemplate(resetLink)
  });

  if(response.error) {
    return {
      error: response.error
    }
  }

  return {
     success: response.data
  }
};