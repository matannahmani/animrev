import { Metadata } from "next";
import { ComboBox } from "./combo-box";
import getQueryClient from "@/components/utils/store";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { ssrApi } from "@/utils/ssr";

export const metadata: Metadata = {
  title: "AnimRev",
  description: "AnimRev Home Page",
};
/// key note this is just playground

async function HomePage() {
  await ssrApi.v1.genre.list.prefetch();
  const dehydratedState = ssrApi.dehydrate({
    shouldDehydrateQuery: () => true,
  });
  return (
    <main>
      <Hydrate state={dehydratedState}>
        <h1>Home Page</h1>
        <ComboBox />
      </Hydrate>
    </main>
  );
}

export default HomePage;
