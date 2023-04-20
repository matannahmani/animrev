"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { RouterOutputs } from "@/utils/api";
import { ScrollArea } from "@/components/ui/scroll-area";
type Genre = RouterOutputs["v1"]["genre"]["list"];
export function ComboBox() {
  return (
    <React.Suspense fallback={<Skeleton className="h-12 w-[200px]" />}>
      <ComboBoxLoaded />
    </React.Suspense>
  );
}

function ComboBoxLoaded() {
  const { data: genres } = api.v1.genre.list.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    suspense: true,
  });
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-12 w-[200px] "
        >
          <div className="ml-[auto] flex h-6 items-center">
            <ScrollArea className="h-full w-full">
              {value.length === 0 && (
                <div className="flex items-center justify-center text-sm text-gray-500">
                  Select genre/s...
                </div>
              )}
              {value.length > 0 && (
                <div className="flex flex-wrap items-center justify-center text-sm">
                  {value.map((genre, index) => (
                    <>
                      <span key={genre}>{genre}</span>
                      {index !== value.length - 1 && (
                        <span className="mx-1">,</span>
                      )}
                    </>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <ChevronsUpDown className="ml-[auto] h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search genre..." />
          <CommandEmpty>No genre found.</CommandEmpty>
          <ScrollArea className="h-[200px]">
            <CommandGroup>
              {genres?.map((genre) => (
                <CommandItem
                  key={genre.name}
                  onSelect={(currentValue) => {
                    if (value.includes(currentValue)) {
                      setValue((prev) =>
                        prev.filter((value) => value !== currentValue)
                      );
                    } else {
                      setValue((prev) => [...prev, currentValue]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      ...(value.includes(genre.name.toLowerCase())
                        ? ["opacity-100", "text-primary-500"]
                        : ["opacity-0", "text-transparent"])
                    )}
                  />
                  {genre.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
