"use server"
import prisma from "@/db";
import { RegisterSchema } from "@/lib/zod/registerSchema";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { getUserByEmail } from "@/helpers/data/getUser";
import { generateVerificationToken } from "@/helpers/token/genVerificationToken";
import { sendVerificationEmail } from "@/helpers/mail/sendVerificationEmail";

export default async function register(values: z.infer<typeof RegisterSchema>) {
      const validatedFields = RegisterSchema.safeParse(values);

      if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        }
      }

      const { firstName, lastName, email, password } = validatedFields.data

      const name = `${firstName} ${lastName}`;
      const hashPassword = await bcrypt.hash(password, 10);

      const existingUser = await getUserByEmail({email});

      if (existingUser) {
        return {
            error: "User already exists",
        }
      }

      // Create user`

      const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashPassword,
        }
      })

      const verificationToken = await generateVerificationToken(email);

      const response = await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      )

      if (response.error) {
        return{
            error: response.error
        }
      }

      return {
        success: response.success
      }
}