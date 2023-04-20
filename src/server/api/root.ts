import { v1 } from "./routers/v1";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  v1,
});

// export type definition of API
export type AppRouter = typeof appRouter;
