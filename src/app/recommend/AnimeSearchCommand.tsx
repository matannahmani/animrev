"use client";
import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandPrimitive,
  CommandList,
} from "@/components/ui/command";
import { clientApi } from "@/utils/client";
import { cn } from "@/lib/utils";
import { useSelectShowsId } from "./card-section";
import { AnimeShow } from "./anime-card";

export function AnimeSearchCommand({
  selectHandler,
}: {
  selectHandler: (item: AnimeShow) => void;
}) {
  const [search, setSearch] = React.useState("");
  const selectedIds = useSelectShowsId();
  const { data, isInitialLoading } =
    clientApi.v1.public.anime.retreive.useQuery(
      {
        title: search,
      },
      {
        keepPreviousData: true,
        staleTime: 1000 * 60 * 60 * 24 * 7,
        retry: false,
      }
    );

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search a show"
        autoFocus={true}
      />
      <CommandList>
        <CommandEmpty>No Show found.</CommandEmpty>
        {isInitialLoading && (
          <CommandPrimitive.Loading>Fetching shows...</CommandPrimitive.Loading>
        )}
        <CommandGroup>
          {data &&
            data.map((show) => (
              <CommandItem
                key={show.id}
                className={cn(
                  selectedIds.includes(show.id)
                    ? "cursor-not-allowed opacity-50"
                    : "",
                  "transition-opacity"
                )}
                disabled={selectedIds.includes(show.id)}
                onSelect={(value) => {
                  selectHandler(show);
                }}
              >
                {show.englishTitle || show.romajiTitle}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
