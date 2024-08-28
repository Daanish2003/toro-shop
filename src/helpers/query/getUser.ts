"use server"

import db from "@/lib/primsa-client";


export async function getUserByEmail(email: string) {
    try {
        const user = await db.user.findUnique({
            select: {
                id: true,
                email: true,
                emailVerified: true,
                password: true,
                role: true,
                isTwoFactorEnabled: true
            },
            where: {
                email
            }
        })
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}