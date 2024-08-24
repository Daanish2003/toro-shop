// "use server"

// import { LoginSchema } from "@/lib/zod/loginSchema";
// import { z } from "zod";
// import { getUserByEmail } from "@/helpers/data/getUser";
// import { generateVerificationToken } from "@/helpers/token/genVerificationToken";
// import { sendVerificationEmail } from "@/helpers/mail/sendVerificationEmail";
// import { getTwoFactorTokenByEmail } from "@/helpers/data/getTwoFactorTokenByEmail";
// import prisma from "@/db";
// import { getTwoFactorConfirmationByUserId } from "@/helpers/data/getTwoFactor";
// import generateTwoFactorToken from "@/helpers/token/genTwofactorToken";
// import sendTwoFactorTokenEmail from "@/helpers/mail/sendTwoFactorTokenEmail";
// import { signIn } from "next-auth/react";
// import { DEFAULT_LOGIN_REDIRECT } from "@/route";

// export default async function login(values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) {
//     const validatedFields = LoginSchema.safeParse(values);

//     if (!validatedFields.success) {
//         return {
//             error: "Invalid fields",
//         }
//     }

//     const { email, password, code } = validatedFields.data

//     const existingUser =  await getUserByEmail({email});

//     if(!existingUser || !existingUser.email || !existingUser.password) {
//         return {
//             error: "User not found",
//         }
//     }

//     if (!existingUser.emailVerified) {
//         const verificationToken  =  await generateVerificationToken(existingUser.email);

        
//     await sendVerificationEmail(
//         verificationToken.email, 
//         verificationToken.token
//     );

//     return { success: "Confirmation email send"}
//     }

//     if(existingUser.isTwoFactorEnabled && existingUser.email) {
//         if(code) {
//             const twoFactorToken = await getTwoFactorTokenByEmail(
//                 existingUser.email
//             )

//             if(!twoFactorToken) {
//                 return { error: "Invalid code"}
//             }

//             if (twoFactorToken.token !== code) {
//                 return { error: "Invalid code!" };
//               }
            
//               const hasExpired = new Date(twoFactorToken.expires) < new Date();

//               if(hasExpired) {
//                 return { error: "Code has expired" };
//               }

//               await prisma.twoFactorToken.delete({
//                 where: {
//                     id:  twoFactorToken.id
//                 }
//               });

//               const existingConfirmation = await getTwoFactorConfirmationByUserId(
//                 existingUser.id
//               );

//               if(existingConfirmation) {
//                 await prisma.twoFactorConfirmation.delete({
//                     where: {
//                         id: existingConfirmation.id
//                     }
//                 });
//               }

//               await prisma.twoFactorConfirmation.create({
//                 data: {
//                     userId: existingUser.id,
//                 }
//               });
//         } else {
//             const twoFactorToken = await generateTwoFactorToken(existingUser.email)
//             await sendTwoFactorTokenEmail(
//                 twoFactorToken.email,
//                 twoFactorToken.token
//             );

//             return { twoFactor: true}

//         }
//     }

//     try {
//         await signIn("credentials", {
//           email,
//           password,
//           redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
//         })
//       } catch (error) {
//         throw error;
//       }
// }