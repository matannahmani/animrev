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
      const genres = await prisma.genre.findMany({});
      return genres;
    }),
    createOne: publicProcedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { name } = input;
        const genre = await prisma.genre.create({
          data: {
            name,
          },
        });
        return genre;
      }),
  }),
  anime: createTRPCRouter({
    list: publicProcedure
      .input(
        z
          .object({
            order: z.enum(["ASC", "DESC"]).optional(),
            title: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const { order, title } = input || {};
        const anime = await prisma.anime.findMany({
          take: 10,
          where: {
            OR: [
              {
                englishTitle: {
                  contains: title,
                },
              },
              {
                romajiTitle: {
                  contains: title,
                },
              },
            ],
          },
          orderBy: {
            averageScore: "desc",
            ...(order && title ? { title: order } : undefined),
          },
          include: {
            AnimeGenre: true,
          },
        });
        return anime;
      }),
  }),
});
