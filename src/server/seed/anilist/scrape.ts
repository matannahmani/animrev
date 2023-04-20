import fetch from "node-fetch";
import { PrismaClient, Anime } from "@prisma/client";

const prisma = new PrismaClient();

interface IAnime {
  id: number;
  title: {
    romaji: string;
    english?: string;
    native?: string;
  };
  type: string;
  format: string;
  status: string;
  episodes: number;
  duration?: number;
  genres: string[];
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  averageScore: number;
  meanScore: number;
  popularity: number;
  startDate?: {
    year: number;
    month: number;
    day: number;
  };
  endDate?: {
    year: number;
    month: number;
    day: number;
  };
  season?: string;
  seasonYear?: number;
  description?: string;
}
const QUERY = `
          query($page: Int, $perPage: Int, $maxRating: Float) {
            Page(page: $page, perPage: $perPage) {
              media(type: ANIME, averageScore_greater: $maxRating) {
                id
                title {
                  romaji
                  english
                  native
                }
                type
                format
                status
                episodes
                duration
                genres
                coverImage {
                  extraLarge
                  large
                  medium
                }
                bannerImage
                averageScore
                meanScore
                popularity
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                season
                seasonYear
                description
              }
              pageInfo {
                hasNextPage
                total
              }
            }
          }
`;

class AniListScraper {
  private batchSize = 1000;
  private maxRating = 6;
  private page = 1;
  private hasNextPage = true;

  constructor(private readonly apiUrl: string) {}

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async fetchShows(): Promise<IAnime[]> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          page: this.page,
          perPage: this.batchSize,
          maxRating: this.maxRating,
        },
      }),
    });

    const { data, errors } = (await response.json()) as {
      data: {
        Page: {
          media: IAnime[];
          pageInfo: { hasNextPage: boolean; total: number };
        };
      };
      errors: string[] | string | undefined;
    };

    if (errors) {
      throw new Error(
        Array.isArray(errors) ? errors?.join(", ") : "Unknown error"
      );
    }

    const shows: IAnime[] = data.Page.media;

    this.hasNextPage = data.Page.pageInfo.hasNextPage;
    this.page++;

    return shows;
  }

  private async createAnimeBatch(animeBatch: IAnime[]): Promise<void> {
    const createShows: Anime[] = animeBatch.map((anime) => {
      const {
        id,
        title,
        type,
        format,
        status,
        episodes,
        duration,
        genres,
        coverImage,
        bannerImage,
        averageScore,
        meanScore,
        popularity,
        startDate,
        endDate,
        season,
        seasonYear,
        description,
      } = anime;

      const coverImageUrl =
        coverImage?.extraLarge || coverImage?.large || coverImage?.medium;

      return <Anime>{
        id,
        romajiTitle: title.romaji,
        englishTitle: title.english ?? null,
        nativeTitle: title.native ?? null,
        type,
        format,
        status,
        episodes,
        duration,
        genres,
        coverImage: coverImageUrl,
        bannerImage,
        averageScore,
        meanScore,
        popularity,
        startDate: startDate
          ? new Date(startDate.year, startDate.month - 1, startDate.day)
          : undefined,
        endDate: endDate
          ? new Date(endDate.year, endDate.month - 1, endDate.day)
          : undefined,
        season,
        seasonYear,
        description,
      };
    });

    await prisma.anime.createMany({ data: createShows });

    console.log(
      `Seeded ${createShows.length} shows (total ${
        createShows.length * this.page
      })`
    );
  }

  public async scrape(): Promise<void> {
    try {
      while (this.hasNextPage) {
        const animeBatch = await this.fetchShows();
        if (animeBatch.length > 0) {
          await this.createAnimeBatch(animeBatch);
        }

        await this.sleep(1000); // Wait 1 second between requests to avoid rate limiting
      }
    } catch (error) {
      console.error(error);
    } finally {
      await prisma.$disconnect();
      console.log("Seeding complete!");
    }
  }
}

export default AniListScraper;
