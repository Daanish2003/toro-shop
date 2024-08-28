"use server"
import db from "@/lib/primsa-client"

export async function getVerificationTokenByEmail(email: string) {
    try {
       const verificationToken = await db.verificationToken.findFirst({
           where: { email },
           select: { id : true }
       });

       return verificationToken;
    } catch (error) {
        console.log(error)
        return null
    }
 }

 export async function getVerificationTokenByToken(token: string) {
    try {
       const verificationToken = await db.verificationToken.findUnique({
           where: { token },
           select: { id : true, email: true, expires: true, }
       });

       return verificationToken;
    } catch (error) {
        console.log(error)
        return null
    }
 }

 export async function getTwoFactorTokenByEmail(email: string) {
    try{
       const twoFactorToken = await db.twoFactorToken.findFirst({
         where: {
            email
         },
         select: {
            id: true,
            token: true,
            expires: true
         }
       })
       return twoFactorToken
    } catch (error) {
      console.log(error);
      return null
    }
 }

 export async function getPasswordResetTokenByEmail(email: string) {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: { email },
            select: { id: true }
        });
        return passwordResetToken;
    } catch (error) {
        console.log(error);
        return null;
    }
 }

 export async function getPasswordResetTokenByToken(token: string) {
   try {
       const passwordResetToken = await db.passwordResetToken.findFirst({
           where: { token },
           select: { id: true, email: true, expires: true }
       });
       return passwordResetToken;
   } catch (error) {
       console.log(error);
       return null;
   }
}