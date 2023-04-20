import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const queryClient = new QueryClient();

const getQueryClient = cache(() => queryClient);

export default getQueryClient;
