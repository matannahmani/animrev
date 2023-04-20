import { PrismaClient, Anime, Prisma } from "@prisma/client";

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
  episodes?: number;
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
type GQLResponse = {
  data: {
    Page: {
      media: IAnime[];
      pageInfo: { hasNextPage: boolean; total: number };
    };
  };
  errors: string[] | string | undefined;
};

const QUERY = `
query($page: Int, $perPage: Int, $maxRating: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, averageScore_greater: $maxRating,sort: POPULARITY_DESC) {
      title {
        romaji
        english
        native
      }
      id
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
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          page: this.page,
          perPage: this.batchSize,
          maxRating: this.maxRating,
        },
      }),
    });
    const { data, errors } = (await response.json()) as GQLResponse;

    if (errors) {
      console.error(errors);
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
    const createShows: Prisma.AnimeCreateInput[] = animeBatch.map((anime) => {
      const {
        title,
        type,
        id,
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

      const animeDBObject: Prisma.AnimeCreateManyInput = {
        aniListId: id,
        romajiTitle: title.romaji,
        englishTitle: title.english,
        nativeTitle: title.native,
        type,
        format,
        status,
        episodes: episodes || 0,
        duration: duration,
        coverImage: coverImageUrl,
        bannerImage: bannerImage,
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
      return animeDBObject;
    });

    // here we create the animes
    await prisma.anime.createMany({ data: createShows, skipDuplicates: true });
    // here we retrieve the animes we just created
    const createdAnime = await prisma.anime.findMany({
      where: { aniListId: { in: animeBatch.map((anime) => anime.id) } },
      select: { id: true, aniListId: true },
    });
    // here we map the genres to an array of unique genres to filter out duplicates
    const uniqueGenres = Array.from(
      new Set(animeBatch.flatMap((anime) => anime.genres))
    );
    // here we create the genres
    await prisma.genre.createMany({
      data: uniqueGenres.map((genre) => ({ name: genre })),
      skipDuplicates: true,
    });

    const animeGenres: Prisma.AnimeGenreCreateManyInput[] = [];
    // here we map the genres to the anime to create the connection
    animeBatch.forEach((anime) => {
      const animeId =
        createdAnime.find((a) => a.aniListId === anime.id)?.id ?? -1;
      anime.genres.forEach((genre) => {
        return animeGenres.push({
          animeId,
          genreId: genre,
        });
      });
    });
    // here we connect the genres to the anime
    await prisma.animeGenre.createMany({
      data: animeGenres,
      skipDuplicates: true,
    });

    console.log(
      `Seeded ${createShows.length} shows (total ${
        createShows.length * this.page
      })`
    );
  }

  public async scrape(): Promise<void> {
    console.log("Seeding AniList...");
    try {
      while (this.hasNextPage) {
        const now = new Date();
        const animeBatch = await this.fetchShows();
        if (animeBatch.length > 0) {
          await this.createAnimeBatch(animeBatch);
        }
        const timeElapsed = new Date().getTime() - now.getTime();
        console.log(`Time elapsed: ${timeElapsed}ms`);
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
