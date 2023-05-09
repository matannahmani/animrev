import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowCardSection from "./show-card-section";
import { apiVanila } from "@/utils/ssr";
import TabsSwiper from "./swiper";
import { Separator } from "@/components/ui/separator";
import ShowTabs from "./tabs-client";

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

const ListTabs = async ({ id }: { id: string }) => {
  const data = await apiVanila.v1.public.anime.retreive.query({
    title: id,
  });
  const genres = topGenres(
    data.map((item) => item.AnimeGenre.flatMap((i) => i.genreId)).flat()
  );

  return <ShowTabs data={data} genres={genres} />;
};

export default ListTabs;
