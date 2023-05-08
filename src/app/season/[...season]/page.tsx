import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDaysIcon } from "lucide-react";

const seasonMonths = [
  [1, 2, 3], // winter
  [4, 5, 6], // spring
  [7, 8, 9], // summer
  [10, 11, 12], // fall
];
const seasons = ["winter", "spring", "summer", "fall"];

function extractAndValidateSeason(season: string[]) {
  if (season.length !== 2) {
    throw new Error("Invalid season");
  }
  const year = parseInt(season[0] as string);
  if (isNaN(year)) {
    throw new Error("Invalid year");
  }
  const seasonNumber = seasons.indexOf(season[1] as string);
  if (seasonNumber === -1) {
    throw new Error("Invalid season");
  }

  return {
    year,
    seasonNumber,
    seasonName: seasons[seasonNumber],
    seasonMonths: seasonMonths[seasonNumber],
  };
}

// refactor to other file
function CardSkeleton() {
  return (
    <div
      className=" flex h-[265px] w-full max-w-md flex-wrap overflow-hidden
    rounded-md bg-card text-card-foreground shadow-sm
    "
    >
      {/* image */}
      <Skeleton className="h-[265px] w-[185px] rounded-none " />
      {/* title */}
      <div className="flex-1 space-y-1 p-2">
        <Skeleton className="mb-2 h-[32px] w-full rounded-sm " />
        <Skeleton className="h-[10px] w-full rounded-sm " />
        <Skeleton className="h-[10px] w-full rounded-sm " />
        <Skeleton className="h-[10px] w-full rounded-sm " />
        <Skeleton className="h-[10px] w-[80%] rounded-sm " />
      </div>

      {/* <Skeleton className="h-[20px] w-[217px] " /> */}
    </div>
  );
}

function SeasonPage({
  params,
}: {
  params: {
    season: string[];
  };
}) {
  const { year, seasonNumber, seasonName, seasonMonths } =
    extractAndValidateSeason(params.season);
  return (
    <>
      <div className="flex flex-wrap content-start ">
        <div className="flex flex-auto cursor-pointer select-none  items-center space-x-2">
          <div className="relative h-6 w-6">
            <CalendarDaysIcon className="absolute h-full w-full" />
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-orange-400 opacity-75"></span>
          </div>
          <h1 className="text-2xl font-semibold capitalize">
            {seasonName} {year}
          </h1>
        </div>
        <div className="flex-space-2 my-auto mt-6 flex flex-wrap justify-center gap-4 gap-y-12">
          {/* load childrens or skeletons for now */}
          {new Array(6).fill(0).map((i, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}

export default SeasonPage;
