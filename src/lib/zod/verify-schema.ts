import { z } from "zod";

export const verifyEmailSchema = z.object({
    code : z.number().min(1, 'Code is required').max(6, 'Code must be 6 digits long'),
})