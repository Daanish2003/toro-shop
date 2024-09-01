import db from "@/lib/primsa-client";

type NewUser = {
       id: string
       password: string | null
       role: string
}


export async function createUser(email: string, hashedPassword: string): Promise<NewUser | null> {
       try {
          const newUser = await db.user.create({
              select: {
                  id: true,
                  password: true,
                  role: true
              },
               data: {
                 email,
                 password: hashedPassword,
               }
          })
          return newUser
       } catch (error) {
              console.log(error)
              return null
       }
}