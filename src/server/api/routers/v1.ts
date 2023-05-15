import {
  generatePrompt,
  outputExtractor,
} from "@/app/recommend/generatePrompt";
import { prisma } from "@/server/db";
import { MODEL, openai } from "@/utils/openai";
import { pinecone } from "@/utils/pinecone";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const v1 = createTRPCRouter({
  public: createTRPCRouter({
    genre: createTRPCRouter({
      list: publicProcedure.query(async ({ ctx }) => {
        const genres = await prisma.genre.findMany({});
        return genres;
      }),
    }),
    anime: createTRPCRouter({
      retreive: publicProcedure
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
              studio: true,
              relationsToAnime: true,
              relationsFromAnime: true,
            },
          });
          return anime;
        }),
      list: createTRPCRouter({
        generate: publicProcedure
          .input(
            z.object({
              showIds: z.number().array().min(2).max(5),
            })
          )
          .mutation(async ({ input }) => {
            const shows = await prisma.anime.findMany({
              where: {
                id: {
                  in: input.showIds,
                },
              },
              include: {
                AnimeGenre: true,
                studio: true,
                relationsToAnime: true,
                relationsFromAnime: true,
              },
            });
            const promp = generatePrompt(
              shows.map((show) => show.description ?? ""),
              shows.map((show) => show.AnimeGenre.map((genre) => genre.genreId))
            );
            const openaiResponse = await openai.createChatCompletion({
              messages: [
                // {
                //   role: "system",
                //   content: `We need to find the right description to use in our anime shows database for cosine similarity.`,
                // },
                {
                  content: promp,
                  role: "user",
                },
              ],
              model: "gpt-3.5-turbo",
            });
            const choice = openaiResponse.data.choices[0]?.message;
            if (!choice)
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "OpenAI did not return a choice",
              });
            const getResEmbeddings = openai.createEmbedding({
              model: MODEL,
              input: outputExtractor(choice.content),
            });
            const initPromise = pinecone.init({
              environment: "asia-southeast1-gcp-free",
              apiKey: process.env.PINECONE_KEY as string,
            });
            const [resEmbeddings] = await Promise.all([
              getResEmbeddings,
              initPromise,
            ]);
            const topK = await pinecone.Index("animrev").query({
              queryRequest: {
                vector: resEmbeddings.data.data[0]?.embedding,
                topK: 50,
              },
            });
            const topKShows = await prisma.anime.findMany({
              where: {
                id: {
                  in: topK.matches?.map((match) => Number(match.id)) || [],
                },
              },
              include: {
                AnimeGenre: true,
                studio: true,
                relationsToAnime: true,
                relationsFromAnime: true,
              },
            });
            const output = {
              originalPrompt: promp,
              promptChoice: outputExtractor(choice.content),
              shows: topKShows.map((show) => ({
                ...show,
                accuracy:
                  (topK.matches?.find((match) => Number(match.id) === show.id)
                    ?.score ?? 0) * 100,
              })),
            };
            // lastly we need to create the list
            const newList = await prisma.recommendList.create({
              data: {},
            });
            const newItemsPromise = prisma.recommendListPromptShows.createMany({
              data: shows.map((show) => ({
                recommendListId: newList.id,
                animeId: show.id,
              })),
            });
            const listRecommendationsPromise =
              prisma.recommendListAnimes.createMany({
                data: output.shows.map((show) => ({
                  recommendListId: newList.id,
                  animeId: show.id,
                  accuracy: show.accuracy,
                })),
              });
            await Promise.all([newItemsPromise, listRecommendationsPromise]);
            return {
              ...output,
              listId: newList.id,
            };
          }),
        find: publicProcedure
          .input(
            z.object({
              id: z.string(),
            })
          )
          .query(async ({ input }) => {
            const list = await prisma.recommendList.findUnique({
              where: {
                id: Number(input.id),
              },
              include: {
                RecommendListAnimes: {
                  include: {
                    anime: {
                      include: {
                        AnimeGenre: true,
                        studio: true,
                      },
                    },
                  },
                  orderBy: {
                    accuracy: "desc",
                  },
                },
                RecommendListPromptShows: {
                  include: {
                    anime: {
                      include: {
                        AnimeGenre: true,
                      },
                    },
                  },
                },
              },
            });
            if (!list) throw new TRPCError({ code: "NOT_FOUND" });
            return list;
          }),
      }),
    }),
  }),
});
