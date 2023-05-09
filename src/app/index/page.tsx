import { Metadata } from "next";
import ComboBox from "./combo-box";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiVanila } from "@/utils/ssr";

export const runtime = "experimental-edge";
export const metadata: Metadata = {
  title: "AnimRev",
  description: "AnimRev Home Page",
};
/// key note this is just playground

async function ComboBoxLoader() {
  const genres = await apiVanila.v1.public.genre.list.query(undefined, {
    context: {},
  });

  return <ComboBox genres={genres} />;
}

async function HomePage() {
  return (
    <main>
      <h1>Season 2023</h1>
      <Suspense fallback={<Skeleton className="h-12 w-[200px] " />}>
        <ComboBoxLoader />
      </Suspense>
    </main>
  );
}

export default HomePage;
