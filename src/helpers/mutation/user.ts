import db from "@/lib/primsa-client";

type NewUser = {
       id: string
       name: string | null
       password: string | null
       image: string | null
       role: string
}


export async function createUser(email: string, hashedPassword: string, name: string): Promise<NewUser | null> {
       try {
          const newUser = await db.user.create({
              select: {
                  id: true,
                  name: true,
                  password: true,
                  image: true,
                  role: true
              },
               data: {
                 email,
                 password: hashedPassword,
                 name
               }
          })
          return newUser
       } catch (error) {
              console.log(error)
              return null
       }
}