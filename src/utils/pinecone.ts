import { PineconeClient } from "@pinecone-database/pinecone";

const pinecone = new PineconeClient();
pinecone.init({
  environment: "asia-southeast1-gcp-free",
  apiKey: process.env.PINECONE_KEY as string,
});
export { pinecone };
