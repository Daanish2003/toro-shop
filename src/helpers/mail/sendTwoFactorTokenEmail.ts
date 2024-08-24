import TwoFactorEmailTemplate from '@/components/Email/TwoFactorEmailTemplate';
import { resend } from '@/lib/resend';


export default async function sendTwoFactorTokenEmail(email: string, token: string) {
  try {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: '2FA Code',
        react: TwoFactorEmailTemplate(token)
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
