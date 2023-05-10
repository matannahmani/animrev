import { apiVanila } from "@/utils/ssr";
import ShowTabs from "./tabs-client";
import { RouterOutputs } from "@/utils/api";
import { getListData } from "./server-code";

function topGenres(arr: string[]): string[] {
  const frequencyMap: { [key: string]: number } = {};

  // Count the frequency of each string in the array
  arr.forEach((str) => {
    if (frequencyMap[str]) {
      frequencyMap[str]++;
    } else {
      frequencyMap[str] = 1;
    }
  });

  // Sort the strings based on their frequency
  const sortedStrings = Object.keys(frequencyMap).sort(
    // @ts-ignore
    (a, b) => frequencyMap?.[b] - frequencyMap?.[a]
  );

  // Return the top 4 frequent strings
  return sortedStrings.slice(0, 4);
}

export type ListShowItem =
  RouterOutputs["v1"]["public"]["anime"]["list"]["find"]["RecommendListAnimes"][0];

const ListTabs = async ({ id }: { id: string }) => {
  const data = await getListData({ id });

  const genres = topGenres(
    data.RecommendListAnimes.map((item) =>
      item.anime.AnimeGenre.flatMap((i) => i.genreId)
    ).flat()
  );

  return <ShowTabs data={data.RecommendListAnimes} genres={genres} />;
};

export default ListTabs;
