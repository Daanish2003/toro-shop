"use server";

import { getVerificationTokenByToken } from "@/helpers/query/getToken";
import { getUserByEmail } from "@/helpers/query/getUser";
import db from "@/lib/primsa-client";
import { createSession } from "@/lib/session";

export const verifyEmail = async(token: string) => {
    const existingToken = await getVerificationTokenByToken(token)

    if(!existingToken) {
        return { error: "Token does not exist"};
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return { error: "Token has expired"};
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await db.user.update({
        where: { email: existingToken.email},
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })

    await createSession(existingUser.id, existingUser.role)

    return { 
        success: "Email verified!",
    }
}