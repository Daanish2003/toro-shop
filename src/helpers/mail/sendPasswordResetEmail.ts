import passwordResetTemplate from '@/components/Email/passwordResetTemplate';
import { domain, resend } from '@/lib/resend';

export default async function sendPasswordResetEmail(email: string, token: string) {
  try {
    const resetLink = `${domain}/new-password?token=${token}`
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your Password',
        react: passwordResetTemplate(resetLink)
      });
      return {
        success: "Email has been sent successfully"
      }
  } catch (error) {
    return {
        error: "Failed to send Email"
    }
  }
}
