"use client";
import { RQProvider } from "@/components/rq-provider";
import AnimeCard from "./anime-card";
import { Button } from "@/components/ui/button";
import { atom, useAtom, useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { splitAtom } from "jotai/utils";
import { RouterOutputs } from "@/utils/api";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type AnimeShow = RouterOutputs["v1"]["anime"]["list"][0];

export type showAtom = AnimeShow | null;

const showsAtom = atom<showAtom[]>([null]);
const showAtomsAtom = splitAtom(showsAtom);
export const useSelectShowsId = () => {
  const shows = useAtomValue(showsAtom);
  return shows.map((show) => show?.id);
};
const CardSectionFooter = () => {
  const [list, setList] = useAtom(showsAtom);
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
      <Button size="sm" disabled={!canGenerate} variant="default">
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
