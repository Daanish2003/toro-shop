"use server"
import { verifySession } from "@/lib/session";

export default async function getSession() {
    const session = await verifySession()

    if(!session) {
        return null
    }

    return session
}