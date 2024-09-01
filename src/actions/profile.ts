"use server"
import getSession from "@/helpers/query/getSession";
import db from "@/lib/primsa-client";
import { ProfileSchema, profileType } from "@/zod/profileSchema";

export default async function profile(values: profileType) {
    const session = await getSession();
    if(!session) {
        return {
            error: "Not Authenticated"
        }
    }

    const validatedFields = ProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Inavlid Fields"
        }
    }

    console.log("Successfully Validated Fields")

    const { name, role, phone } = validatedFields.data


    console.log("Success fully updated cookie")

    await db.user.update({
        where: {
            id: session.userId
        },
        data: {
           name,
           role,
           mobile: phone
        }
    })
    

    return {
        success: "Profile has been created"
    }

}