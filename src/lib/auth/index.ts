import { User, UserRole } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; 
import prisma from "@/db";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { LoginSchema } from "../zod/loginSchema";
import bcrypt from "bcrypt";
import { getUserByEmail, getUserById } from "@/helpers/data/getUser";
import getAccountByUserId from "@/helpers/data/getAccount";
import { getTwoFactorConfirmationByUserId } from "@/helpers/data/getTwoFactor";
import { SessionStrategy } from "next-auth";

export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     secret: process.env.AUTH_SECRET,
     session: {
        strategy: "jwt" as SessionStrategy,
     },
     pages: {
            signIn: "/auth/login",
            error: "/auth/error"
     },
     providers: [
         GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
         }),
         CredentialProvider({
             name:"Credentials",
                credentials : {
                    email : { label: "email", placenholder: "email", type: "email" },
                    password : { label: "password", placeholder: "password", type: "password" }
                },

                async authorize(credentials) {
                    const validatedFields = LoginSchema.safeParse(credentials);

                    if(!validatedFields.success) {
                        return null
                    }

                    const { email, password } = validatedFields.data;

                    const existingUser = await getUserByEmail({email})


                    if (!existingUser || !existingUser?.password || !existingUser?.email) {
                        return null
                    }

                    const passwordMatch = await bcrypt.compare(password, existingUser.password);

                    if(!passwordMatch) {
                       return null
                    }

                    return existingUser as User;
                }
        })
     ],
     callbacks: {
       async signIn({ user, account}) {
        if (account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user.id);

        if(!existingUser?.emailVerified) return false;

        if (existingUser.isTwoFactorEnabled) {
            const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
    
            if (!twoFactorConfirmation) return false;
    
            await prisma.twoFactorConfirmation.delete({
              where: { id: twoFactorConfirmation.id }
            });

          }
    

        return true
       },

       async session({ token, session}) {
        if (token.sub && session.user) {
            session.user.id = token.sub
        };

        if (token.role && session.user) {
            session.user.role = token.role as UserRole
        };

        if (session.user) {
            session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
          }

        if (session.user) {
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.isOAuth = token.isOAuth as boolean;
        };
        return session
       },

       async jwt({ token }) {
     
        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        const existingAccount = await getAccountByUserId(
            existingUser.id
        );

        token.isOAuth = !!existingAccount;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled

        return token
       }
     },
     events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: {id: user.id},
                data: { emailVerified: new Date()}
            })
        }
     }
}