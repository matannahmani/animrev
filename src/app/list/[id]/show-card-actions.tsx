"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

const ShowCardActions = ({ id }: { id: number }) => {
  const [mode, setMode] = useState<"like" | "dislike" | "neutral">("neutral");
  return (
    <div className="ml-auto flex flex-row items-center justify-start gap-2">
      <Button
        className={cn(
          "text-emerald-500",
          mode === "like" && "!bg-emerald-500 text-white"
        )}
        onClick={() => setMode("like")}
        size="xs"
        variant={"ghost"}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        className={
          mode === "dislike" ? " !bg-rose-500 text-white" : "text-rose-500"
        }
        onClick={() => setMode("dislike")}
        variant={"ghost"}
        size="xs"
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ShowCardActions;
