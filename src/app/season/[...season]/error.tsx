"use client"; // Error components must be Client components

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const nav = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex flex-col items-center px-4 align-middle sm:px-1">
      <Alert className="w-fit">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Something went wrong while rendering this page. Please try again
        </AlertDescription>
      </Alert>
      <Button
        className="mt-4 w-fit"
        variant="destructive"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => {
            // can use-reset
            nav.replace("/");
          }
        }
      >
        Try again
      </Button>
    </div>
  );
}
