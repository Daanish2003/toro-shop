import prisma from "@/db"

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
      const twoFactorToken = await prisma.twoFactorToken.findFirst({
        where: {
            email
        }
      })
      return twoFactorToken;
    } catch {
        return null
    }
}

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
      const twoFactorToken = await prisma.twoFactorToken.findFirst({
        where: {
            token
        }
      })
      return twoFactorToken;
    } catch {
        return null
    }
}

