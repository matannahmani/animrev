import { type showAtom } from "./card-section";
export function sanitizeString(input: string): string {
  // Replace any HTML tags and their attributes with an empty string
  const sanitizedString = input.replace(/<[^>]*>/gi, "");

  // Remove any remaining special characters and new lines
  return sanitizedString.replace(/[^a-zA-Z0-9\s]|[\r\n]/g, "");
}
export function generatePrompt(shows: showAtom[]) {
  const descriptions = shows.map((show) =>
    sanitizeString(show?.description ?? "")
  );
  const generes = shows.map(
    (show) => show?.AnimeGenre.map((gen) => gen.genreId) ?? []
  );
  return `
  CONTEXT:
  You're preapring a json object that will be used to scan a vector database of anime shows to find best recommandations.
  1. Find the common description between the shows.
  2. Find the common generes clusters between the shows.
  TASK:
  Return a json object with the following format:
  {
    "commonDesc": string[]
    "commonGenres": string[]
  }
  DATASET:
  ${JSON.stringify({ descriptions, generes }, null, 2)}
  `;
}
