"use client";

import { Tabs } from "@/components/ui/tabs";
import ShowCardSection from "./show-card-section";
import TabsSwiper from "./swiper";
import { useState } from "react";
import { AnimeShow } from "@/app/recommend/anime-card";

const ShowTabs = ({
  data,
  genres,
}: {
  data: AnimeShow[];
  genres: string[];
}) => {
  const [value, setValue] = useState("ALL");
  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className="my-2 mr-auto w-full"
    >
      <TabsSwiper genres={genres} />
      <ShowCardSection value={value} data={data} genres={genres} />
    </Tabs>
  );
};

export default ShowTabs;
