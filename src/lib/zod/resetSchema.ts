import { z } from "zod";

export const ResetSchema = z.object({
   email: z.string().email().min(1, 'Email is required'),
})