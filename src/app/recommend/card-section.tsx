"use client";
import { RQProvider } from "@/components/rq-provider";
import { Button } from "@/components/ui/button";
import { atom, useAtom, useAtomValue } from "jotai";
import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { splitAtom } from "jotai/utils";
import { RouterOutputs } from "@/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { apiVanila } from "@/utils/ssr";
import { useRouter } from "next/navigation";
import AnimeCard from "./anime-card";

type AnimeShow = RouterOutputs["v1"]["public"]["anime"]["retreive"][0];

export type showAtom = AnimeShow | null;

const showsAtom = atom<showAtom[]>([null]);
const showAtomsAtom = splitAtom(showsAtom);
export const useSelectShowsId = () => {
  const shows = useAtomValue(showsAtom);
  return shows.map((show) => show?.id);
};

const CardSectionFooter = () => {
  const [list, setList] = useAtom(showsAtom);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const canGenerate = useMemo(() => {
    // filter out null
    const filtered = list.filter((item) => item !== null);
    return filtered.length >= 2 && filtered.length <= 5;
  }, [list]);
  const canAdd = useMemo(() => {
    return list.length < 5;
  }, [list]);
  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => {
          setList((current) => [...current, null]);
        }}
        disabled={!canAdd}
        size="sm"
        variant="outline"
      >
        <Plus />
      </Button>
      <Button
        size="sm"
        onClick={async () => {
          setLoading(true);
          try {
            const res = await apiVanila.v1.public.anime.list.generate.mutate({
              showIds: list.map((item) => item?.id ?? -1),
            });
            router.push(`/list/${res.listId}`);
            console.log(res);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
        disabled={!canGenerate || isLoading}
        variant="default"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate List
      </Button>
    </div>
  );
};

const CardSection = () => {
  const [showAtoms, dispatch] = useAtom(showAtomsAtom);
  const [conRef] = useAutoAnimate();
  return (
    <RQProvider>
      <div
        ref={conRef}
        className="mt-10 flex w-full max-w-sm flex-col space-y-2"
      >
        {showAtoms.map((atom, index) => {
          return (
            <AnimeCard
              removeHandler={() => {
                dispatch({ type: "remove", atom });
              }}
              atom={atom}
              key={index}
            />
          );
        })}
        <CardSectionFooter />
      </div>
    </RQProvider>
  );
};

export default CardSection;
