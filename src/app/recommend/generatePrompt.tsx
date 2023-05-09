import { type showAtom } from "./card-section";
export function sanitizeString(input: string): string {
  // Replace any HTML tags and their attributes with an empty string
  const sanitizedString = input.replace(/<[^>]*>/gi, "");

  // Remove any remaining special characters and new lines
  return sanitizedString.replace(/[^a-zA-Z0-9\s]|[\r\n]/g, "");
}
export function outputExtractor(output: string): string {
  const start = output.indexOf("STRINGSTART");
  const end = output.indexOf("STRINGEND");
  if (start === -1 || end === -1) {
    return "";
  }
  return output.slice(start + 11, end);
}

export function generatePrompt(description: string[], genres: string[][]) {
  const descriptions = description.map((desc) => sanitizeString(desc ?? ""));
  const generes = genres.flat();
  return `
  CONTEXT:
  Extract the common keywords from the description.
  ONLY OUTPUT USING THIS FORMAT:
  STRINGSTART
  ** OUTPUT **
  STRINGEND
    DATASET:
  ${JSON.stringify({ descriptions, generes }, null, 2)}
  `;
}
