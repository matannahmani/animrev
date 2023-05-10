import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <main className=" mt-2 flex flex-wrap content-start items-start justify-center text-start">
      <div className="flex basis-full flex-col items-start justify-center gap-2">
        <h1 className="basis-full scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl">
          <Skeleton className="mr-auto h-8 w-[240px]" />
        </h1>
        <Skeleton className="mr-auto h-6 w-[240px]" />
      </div>
      <Skeleton className="my-4 mr-auto h-10 w-[240px] sm:w-[420px]" />
    </main>
  );
};

export default LoadingPage;
