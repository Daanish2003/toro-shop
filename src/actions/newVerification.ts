"use server"

import prisma from "@/db";
import { getUserByEmail } from "@/helpers/data/getUser";
import { getVerificationTokenByToken } from "@/helpers/data/getVerification"

export default async function newVerification(token: string) {
    const existingToken = await getVerificationTokenByToken(token);

    if(!existingToken) {
        return { error: "Token does not exist!"};
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return {
            error: "Token has expired"
        }
    }

    const existingUser = await getUserByEmail({ email: existingToken.email })

    if (!existingUser) {
        return {
            error: "Email does not exist"
        }
    }

    await prisma.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    await prisma.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return { success: "Email verified"}
}