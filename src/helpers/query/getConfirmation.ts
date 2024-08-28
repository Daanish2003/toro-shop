import db from "@/lib/primsa-client";

export async function getTwoFactorConfirmationByUserId(userId: string) {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({
               where: {
                userId
               },
               select: {
                id: true,
               }
        })
        return twoFactorConfirmation
    } catch (error) {
        console.log(error);
        return null;
    }
}