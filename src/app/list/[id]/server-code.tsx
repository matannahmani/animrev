import { apiVanila } from "@/utils/ssr";
import { cache } from "react";

const getListData = cache(({ id }: { id: string }) => {
  return apiVanila.v1.public.anime.list.find.query({
    id,
  });
});

export { getListData };
