import { getTailwindColorsForString } from "@/app/recommend/getTailwindColorsForString";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SwiperRender } from "./swiper";
import { sanitizeString } from "@/app/recommend/generatePrompt";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crosshair, Frown, Smile } from "lucide-react";
import ShowCardActions from "./show-card-actions";
import { type ListShowItem } from "./tabs";

function textToColor(str: string) {
  const colorPairs = [
    "text-red-500 hover:text-red-500",
    "text-orange-500 hover:text-orange-500",
    "text-emerald-500 hover:text-emerald-500",
    "text-purple-500 hover:text-purple-500",
    "text-rose-500 hover:text-rose-500",
    "text-pink-500 hover:text-pink-500",
    "text-teal-500 hover:text-teal-500",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }

  // Ensure the hash is positive and calculate the index for the colorPairs array
  const index = Math.abs(hash) % colorPairs.length;
  return (colorPairs?.[index] || colorPairs[0]) as string;
}

const ShowCard = ({ showItem }: { showItem: ListShowItem }) => {
  const show = showItem.anime;
  return (
    <div
      className="flex	 h-[265px] w-full overflow-hidden rounded bg-slate-900 shadow-lg shadow-slate-900/60
      md:w-[460px]
    "
    >
      <div className="absolute z-0 h-[265px] w-[185px] bg-gradient-to-t from-black to-transparent">
        <div className="absolute bottom-0 flex flex-col items-start space-y-2 px-2 py-2 text-start">
          <span
            className={cn(
              textToColor(show.romajiTitle),
              "cursor-pointer text-sm font-semibold text-white transition-colors duration-300 ease-linear"
            )}
          >
            {show.englishTitle || show.romajiTitle}
          </span>
          {/* main studio */}
          <span
            className={cn(
              "cursor-pointer text-xs",
              textToColor(show.romajiTitle)
            )}
          >
            {show.studio?.name}
          </span>
        </div>
      </div>
      <Image
        priority
        width={185}
        height={265}
        className="!h-[265px] !w-[185px] object-cover"
        src={show.coverImage || show.bannerImage || ""}
        alt={show.englishTitle || show.romajiTitle}
      />

      <div className="relative w-full">
        <div className="flex w-full flex-col items-start space-y-1 p-2 text-start">
          <div className="flex w-full flex-row">
            <div className="flex flex-col items-start space-y-1">
              <span className="text-normal flex font-semibold">
                {show.format} {show.seasonYear} {show.season}
              </span>
              <div className="flex w-12 flex-row gap-3 ">
                {/* rating with smile */}
                <span
                  className={cn(
                    "flex w-full items-center gap-2 text-xs font-bold"
                  )}
                >
                  {show.averageScore > 80 ? (
                    <Smile className={"h-5 w-5 "} />
                  ) : (
                    <Frown className={"h-5 w-5 "} />
                  )}
                  {show.averageScore}%
                </span>
                <span
                  className={cn(
                    "flex w-full items-center gap-2 text-xs font-bold"
                  )}
                >
                  <Crosshair className={"h-5 w-5 "} />
                  {showItem.accuracy}%
                </span>
              </div>
            </div>

            <ShowCardActions id={show.id} />
          </div>
          {/* description */}
          <ScrollArea className="h-[180px]">
            <span className="flex text-xs">
              {sanitizeString(show.description ?? "")}
            </span>
          </ScrollArea>
        </div>
        <div className="absolute bottom-0 z-10 flex h-12 w-full bg-slate-900 px-2">
          <SwiperRender>
            {show.AnimeGenre.map((genre) => (
              <Badge
                key={genre.genreId}
                className={cn(
                  "h-fit w-max cursor-pointer p-1.5 py-1",
                  getTailwindColorsForString(genre.genreId)
                )}
              >
                {genre.genreId}
              </Badge>
            ))}
          </SwiperRender>
        </div>
      </div>
    </div>
  );
};
export default ShowCard;
