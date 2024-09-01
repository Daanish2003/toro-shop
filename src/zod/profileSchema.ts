import { UserRole } from "@prisma/client";
import { z } from "zod";

export const MAX_FILE_SIZE = 5000000; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

export const ProfileSchema  = z.object({
    image: z.optional(z.any().refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB"))
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .or(z.string()),
    name: z
    .string()
    .min(2, { message: "Name should be atleast 2 charactors"})
    .max(100, {message: "Max of 100 character"}),
     role: z.nativeEnum(UserRole, {message: "Role is required"}).refine((data) => {
      if(data !== UserRole.ADMIN) {
       return {message: "Admin role is not allowed"}
      }
     }),
     phone: z.string().regex(phoneRegex, "Invalid Number"),
})

export type profileType = z.infer<typeof ProfileSchema>