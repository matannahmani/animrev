"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { usePathname, useSearchParams } from "next/navigation";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;
const currentSeason =
  currentMonth < 4
    ? "winter"
    : currentMonth < 7
    ? "spring"
    : currentMonth < 10
    ? "summer"
    : "fall";

const NavbarPaths = [
  {
    name: "Featured",
    path: "/",
  },
  {
    name: "Seasons",
    path: `/season/${currentYear}/${currentSeason}`,
  },
  {
    name: "Recommend",
    path: "/recommend",
  },
  {
    name: "Community",
    path: "/community",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark flex h-12 items-center py-10">
      <div className="container-fluid space-x-4 first:mx-0">
        {NavbarPaths.map((path, index) => {
          return (
            <Link
              className={cn(
                "duration-250 text-xl transition-all hover:font-semibold hover:opacity-100",
                pathname === path.path
                  ? "font-semibold opacity-100"
                  : "opacity-50"
              )}
              href={path.path}
              key={path.path}
            >
              {path.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
