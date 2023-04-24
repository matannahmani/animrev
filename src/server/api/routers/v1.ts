import { prisma } from "@/server/db";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const v1 = createTRPCRouter({
  genre: createTRPCRouter({
    list: publicProcedure.query(async ({ ctx }) => {
      console.log("LIST GENRES");
      await sleep(2500);
      const genres = await prisma.genre.findMany({});
      return genres;
    }),
  }),
  anime: createTRPCRouter({
    list: publicProcedure.query(async () => {
      const anime = await prisma.anime.findMany({
        take: 20,
        orderBy: {
          averageScore: "desc",
        },
        include: {
          AnimeGenre: true,
        },
      });
      return anime;
    }),
  }),
});
