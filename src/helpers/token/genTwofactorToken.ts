import prisma from "@/db";
import crypto from "crypto"
import { getTwoFactorTokenByEmail } from "@/helpers/data/getTwoFactorTokenByEmail";

export default async function generateTwoFactorToken(email: string) {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken) {
        await prisma.twoFactorToken.delete({
           where: {
             id: existingToken.id
           }
        });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;
}