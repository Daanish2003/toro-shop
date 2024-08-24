import { publicProcedure, router } from "../utils/trpc";

export const appRouter = router({
    auth: authRouter
})

export type AppRouter = typeof appRouter;