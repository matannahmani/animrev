import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiVanila } from "@/utils/ssr";
import CardSection from "./card-section";
import { RQProvider } from "@/components/rq-provider";

// export const runtime = "experimental-edge";
export const metadata: Metadata = {
  title: "AnimRev - Recommendor",
  description: "AnimRev Home Page",
};
/// key note this is just playground

async function RecommendPage() {
  return (
    <main className="container mx-auto mt-2 flex flex-wrap content-start justify-center text-center">
      <div className="flex basis-full flex-col items-center justify-center">
        <h1 className="basis-full scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          Enter 2-5 Shows you have liked
        </h1>
        <blockquote className="mt-2 w-fit border-l-2 pl-6 italic">
          The more shows you enter, the better the recommendations will be.
        </blockquote>
      </div>
      <CardSection />
    </main>
  );
}

export default RecommendPage;
