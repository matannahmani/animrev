import AniListScraper from "./seed/anilist/scrape";

// const scraper = new AniListScraper("https://graphql.anilist.co");

// scraper.scrape();
import { MODEL, openai } from "../src/utils/openai";
import { PrismaClient } from "@prisma/client";
import { sanitizeString } from "@/app/recommend/generatePrompt";
import { pinecone } from "@/utils/pinecone";

const prisma = new PrismaClient();

const createDemoEmbeddings = async () => {
  await pinecone.init({
    environment: "asia-southeast1-gcp-free",
    apiKey: process.env.PINECONE_KEY as string,
  });

  const batchSize = 250;
  const countShows = await prisma.anime.count({
    where: {
      OR: [
        {
          description: {
            not: "",
          },
        },
        {
          description: {
            not: null,
          },
        },
      ],
    },
  });
  console.log(countShows);

  const numBatches = Math.ceil(countShows / batchSize);

  for (let i = 0; i < numBatches; i++) {
    const animeShows = await prisma.anime.findMany({
      where: {
        OR: [
          {
            description: {
              not: "",
            },
          },
          {
            description: {
              not: null,
            },
          },
        ],
      },
      select: {
        id: true,
        romajiTitle: true,
        studio: true,
        type: true,
        englishTitle: true,
        description: true,
        studioId: true,
      },
      skip: i * batchSize,
      take: batchSize,
    });

    const toEmbedText = animeShows.map(
      (anime) =>
        `English Title: ${anime.englishTitle}\nRomaji Title: ${
          anime.romajiTitle
        }\nDescription: ${sanitizeString(anime.description ?? "")}`
    );

    const embeddings = await openai.createEmbedding({
      input: toEmbedText,
      model: MODEL,
    });

    const embeddingsWithId = embeddings.data.data.map((embedding, index) => {
      return {
        values: embedding.embedding,
        id: (animeShows[index]?.id || -1).toString(),
        metadata: {
          description: animeShows[index]?.description || "",
          englishTitle: animeShows[index]?.englishTitle || "",
          romajiTitle: animeShows[index]?.romajiTitle || "",
          mediaType: animeShows[index]?.type || "",
          studio: animeShows[index]?.studio?.name || "",
        },
      };
    });

    await pinecone.Index("animrev").upsert({
      upsertRequest: {
        vectors: embeddingsWithId,
      },
    });

    console.log(`Upserted batch ${i + 1} of ${numBatches}`);
  }
};

// createDemoEmbeddings();
