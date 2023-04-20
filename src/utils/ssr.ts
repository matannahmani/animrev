import superjson from "superjson";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";

export const ssrApi = createServerSideHelpers({
  router: appRouter,
  transformer: superjson,
  ctx: {
    session: null,
    prisma,
  },
});
