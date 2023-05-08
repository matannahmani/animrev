"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Calendar, MoreHorizontal, Tags, Trash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouterOutputs } from "@/utils/api";
import { cn } from "@/lib/utils";
import { PrimitiveAtom, useAtom } from "jotai";
import { showAtom } from "./card-section";
import { Badge } from "@/components/ui/badge";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react"; //
import { ratingToColor } from "./ratingToColor";
import { getTailwindColorsForString } from "./getTailwindColorsForString";
import { MutationPlugin, ResizePlugin } from "./MutationPlugin";
import { AnimeSearchCommand } from "./AnimeSearchCommand";

export type AnimeShow = RouterOutputs["v1"]["anime"]["list"][0];

function AnimeCard({
  atom,
  removeHandler,
}: {
  atom: PrimitiveAtom<showAtom>;
  removeHandler: () => void;
}) {
  const [show, setShow] = useAtom(atom);
  const [open, setOpen] = React.useState(false);
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      renderMode: "performance",
      drag: true,
      mode: "free-snap",
      slides: { perView: "auto", spacing: 8 },
    },
    [MutationPlugin, ResizePlugin]
  );
  return (
    <div className="flex w-full flex-wrap items-center justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
      <p
        style={{ width: "calc(100% - 48px)" }}
        className=" flex items-center text-sm font-medium leading-none"
      >
        <span
          className={cn(
            "mr-2 rounded-lg px-2 py-1 text-xs text-primary-foreground",
            ratingToColor(show?.meanScore || 0)
          )}
        >
          {!show ? "Empty" : show?.meanScore}
        </span>
        <span className="truncate text-muted-foreground">
          {show?.englishTitle || show?.romajiTitle}
        </span>
      </p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tags className="mr-2 h-4 w-4" />
                Search Show
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[160px] p-0 sm:w-[200px]">
                <AnimeSearchCommand
                  selectHandler={(show: AnimeShow) => {
                    setShow(show);
                  }}
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                removeHandler();
              }}
              //   disabled={!canDelete}
              //   className={
              //     canDelete ? "text-red-500" : "cursor-not-allowed opacity-50"
              //   }
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {!!show?.AnimeGenre && (
        <div className=" flex h-8 w-full items-center">
          <div
            ref={sliderRef}
            className="keen-slider flex items-center justify-start "
          >
            {show.AnimeGenre.map((genre) => (
              <Badge
                key={genre.genreId}
                style={{
                  minWidth: "fit-content",
                  maxWidth: "fit-content",
                }}
                className={cn(
                  "keen-slider__slide cursor-pointer p-1.5 py-1",
                  getTailwindColorsForString(genre.genreId)
                )}
              >
                {genre.genreId}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(AnimeCard);
