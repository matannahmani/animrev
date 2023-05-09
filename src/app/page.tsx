import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiVanila } from "@/utils/ssr";

// export const runtime = "experimental-edge";
export const metadata: Metadata = {
  title: "AnimRev",
  description: "AnimRev Home Page",
};
/// key note this is just playground

async function HomePage() {
  return (
    <main>
      <h1>SPRING 2023</h1>
      {/* <Suspense fallback={<Skeleton className="h-12 w-[200px] " />}>
        <ComboBoxLoader />
      </Suspense> */}
    </main>
  );
}

export default HomePage;
