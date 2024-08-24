import prisma from "@/db";

export async function getUserByEmail({ email }: { email : string }) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        return user;
    } catch (error) {
        return null
    }
}

export async function getUserById(id: string) {
    try {
       const user = prisma.user.findUnique({
        where : {
            id
        }
       })
       return user
    } catch (error) {
        return null
    }
}