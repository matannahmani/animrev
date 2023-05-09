"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import ShowCard from "./show-card";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type ListShowItem } from "./tabs";

const ShowCardSection = ({
  genres,
  data,
  value,
}: {
  value: string;
  data: ListShowItem[];
  genres: string[];
}) => {
  const [conRef] = useAutoAnimate();
  const filtredData = data.filter((item) =>
    item.anime.AnimeGenre.map((g) => g.genreId).includes(value)
  );
  return (
    <TabsContent className="w-full" value={value}>
      <div className="flex w-full flex-wrap gap-4" ref={conRef}>
        {value === "ALL" &&
          data.map((item) => <ShowCard key={item.id} showItem={item} />)}
        {value !== "ALL" &&
          filtredData.map((item) => <ShowCard key={item.id} showItem={item} />)}
      </div>
    </TabsContent>
  );
};

export default ShowCardSection;
