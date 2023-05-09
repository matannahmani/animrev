"use client";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { MoreHorizontal, Tags, Trash } from "lucide-react";
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
import { ratingToColor } from "./ratingToColor";
import { getTailwindColorsForString } from "./getTailwindColorsForString";
import { AnimeSearchCommand } from "./AnimeSearchCommand";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

export type AnimeShow = RouterOutputs["v1"]["public"]["anime"]["retreive"][0];

function AnimeCard({
  atom,
  removeHandler,
}: {
  atom: PrimitiveAtom<showAtom>;
  removeHandler: () => void;
}) {
  const [show, setShow] = useAtom(atom);
  const [open, setOpen] = React.useState(false);

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
        <Swiper
          wrapperClass="flex h-8  items-center space-x-2"
          className="flex w-full items-center justify-start"
          slidesPerView={"auto"}
        >
          {show.AnimeGenre.map((genre) => (
            <SwiperSlide className="flex min-w-fit max-w-fit items-center justify-start ">
              <Badge
                key={genre.genreId}
                className={cn(
                  "cursor-pointer p-1.5 py-1",
                  getTailwindColorsForString(genre.genreId)
                )}
              >
                {genre.genreId}
              </Badge>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default React.memo(AnimeCard);
