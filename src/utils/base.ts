import superjson from "superjson";
import { createTRPCContext } from "@/server/api/trpc";
import { createTRPCNext } from "@trpc/next";
import { prisma } from "@/server/db";
import { loggerLink, httpBatchLink, httpLink } from "@trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
/** A set of type-safe react-query hooks for your tRPC API. */
export const trpcConfig = {
  /**
   * Transformer used for data de-serialization from the server.
   *
   * @see https://trpc.io/docs/data-transformers
   */
  transformer: superjson,

  /**
   * Links used to determine request flow from client to server.
   *
   * @see https://trpc.io/docs/links
   */
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    // this is for ClientSide allow batching
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
};

export const trpcConfigSSR = {
  transformer: superjson,
  links: [
    // this is for ServerSide disable batching
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      async headers(ctx) {
        // if headers and headers are object
        if (
          ctx.op.context?.headers &&
          typeof ctx.op.context.headers === "object"
        ) {
          return ctx.op.context.headers as Record<string, string>;
        }
        return {};
      },
    }),
  ],
};
