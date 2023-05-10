import type { Metadata } from "next";
import ListTabs from "./tabs";
import { getListData } from "./server-code";

export const revalidate = 86400; // revalidate every 24 hour
export const dynamic = "force-static"; // force static generation

export async function generateStaticParams() {
  // const ids = await prisma.recommendList.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   take: 25,
  // });
  // return ids.map(({ id }) => ({ id: id.toString() }));
  return [];
}

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
  const data = await getListData({ id });
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
        {/* <Suspense fallback={<Skeleton className="mr-auto h-10 w-[240px]" />}> */}
        <ListDescription id={params.id} />
        {/* </Suspense> */}
      </div>
      {/* <Suspense fallback={<Skeleton className="my-4 mr-auto h-10 w-[240px]" />}> */}
      <ListTabs id={params.id} />
      {/* </Suspense> */}
    </main>
  );
}

export default ListPage;
