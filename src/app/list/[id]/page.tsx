import { Separator } from "@/components/ui/separator";
import { apiVanila } from "@/utils/ssr";
import type { Metadata } from "next";
import ListTabs from "./tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// The `fetch` response is cached and reused between both functions
// below, resulting in a single API request. If you cannot use `fetch`
// directly, you can use `cache`. Learn more:
// https://beta.nextjs.org/docs/data-fetching/caching

// export const revalidate = 86400; // revalidate every 24 hour
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  // const product = apiVanila.v1.public.anime.retreive.query({
  //   title: id,
  // });
  // console.log(product);
  // console.log((await product));

  return { title: `List - ${params.id}` };
}

const ListDescription = async ({ id }: { id: string }) => {
  const data = await apiVanila.v1.public.anime.list.find.query(id);
  return (
    <blockquote className="italic text-slate-500">
      Generated from{" "}
      {data.RecommendListPromptShows.map(
        (show) => `#${show.anime.englishTitle || show.anime.romajiTitle}`
      ).join(" ")}
    </blockquote>
  );
};

async function ListPage({ params }: { params: { id: string } }) {
  return (
    <main className=" mt-2 flex flex-wrap content-start items-start justify-center text-start">
      <div className="flex basis-full flex-col items-start justify-center">
        <h1 className="basis-full scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          List #{params.id}
        </h1>
        <Suspense fallback={<Skeleton className="mr-auto h-10 w-[240px]" />}>
          <ListDescription {...params} />
        </Suspense>
      </div>
      <Suspense fallback={<Skeleton className="my-4 mr-auto h-10 w-[240px]" />}>
        <ListTabs {...params} />
      </Suspense>
    </main>
  );
}

export default ListPage;
