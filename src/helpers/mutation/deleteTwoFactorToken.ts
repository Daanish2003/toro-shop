import db from "@/lib/primsa-client";

export async function deleteTwoFactorToken(id: string) {
    try {
        await db.twoFactorToken.delete({
            where: {
                id
            }
        });

        return {
            success: "Token deleted"
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function deleteTwoFactorConfirmation(id: string) {
    try {
        await db.twoFactorConfirmation.delete({
            where: {
                id
            }
        });

        return {
            success: "Confirmation deleted"
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createTwoFactorConfirmation(id: string) {
    try {
        await db.twoFactorConfirmation.create({
            data: {
                userId: id
            }
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}