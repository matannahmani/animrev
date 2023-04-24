import superjson from "superjson";
import type { AppRouter } from "@/server/api/root";
import { createTRPCProxyClient } from "@trpc/client";
import { trpcConfigSSR } from "./base";

export const apiVanila = createTRPCProxyClient<AppRouter>(trpcConfigSSR);
