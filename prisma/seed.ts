import AniListScraper from "./seed/anilist/scrape";

const scraper = new AniListScraper("https://graphql.anilist.co");

scraper.scrape();
