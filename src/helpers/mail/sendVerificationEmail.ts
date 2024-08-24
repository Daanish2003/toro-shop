import EmailVerificationTemplate from '@/components/Email/emailVerificationTemplate';
import { domain, resend } from '@/lib/resend';

export async function sendVerificationEmail(email: string, token: string): Promise<ApiResponse> {
  try {
    const confirmLink = `${domain}/new-verification?token=${token}`;
    console.log(email)
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [email],
        subject: 'Email Verification',
        react: EmailVerificationTemplate(confirmLink)
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
