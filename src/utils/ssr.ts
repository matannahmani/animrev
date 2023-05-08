import type { AppRouter } from "@/server/api/root";
import { createTRPCProxyClient } from "@trpc/client";
import { trpcConfigSSR } from "./base";

export const apiVanila = createTRPCProxyClient<AppRouter>(trpcConfigSSR);

// // default behavior
// next14Client.v1.anime.list.query()
// fetch("v1.anime.list", {
//     'next': {
//         'revalidate': 10, // default time
//         'tags': ["v1.anime.list"] // default tags
//     }
// })

// // custom behavior
// next14Client.v1.anime.list.query(undefined, {
//     next: {
//         revalidate: 60,
//     }
// })
// // equals to
// fetch("v1.anime.list", {
//     'next': {
//         'revalidate': 60, // custom time
//         'tags': ["v1.anime.list"] // default tags
//     }
// })

// // custom behavior with input
// next14Client.v1.anime.list.query({
//     order: 'ASC'
// }, {
//     next: {
//         revalidate: 60,
//     }
// })
// // equals to
// fetch("v1.anime.list", {
//     'next': {
//         'revalidate': 60, // custom time
//         'tags': ["v1.anime.list.order-asc",] // adjusted tag (default tags + input stringified)
//     }
// })

// const

// // allows us to have typesafe way to retrieve tags
// const getTag = createTRPCTagsRetriever<AppRouter>(trpcConfigSSR);

// // default behavior
// getTag('v1.anime.list')
// // or
// getTag('v1.anime.list', {order: 'ASC'})

// // lastly we might add a custom hook to make server actions easily
// const useServerAction = createTRPCServerAction<AppRouter>(trpcConfigSSR);

// // client usage | inspired by zact https://github.com/pingdotgg/zact
// // component.tsx
// "use client";

// import { useServerAction } from "~/utils/api";

// export const trpcServerComp = () => {
//   const { mutate, data, isLoading } = useServerAction("v1.anime.createOne");

//   return (
//     <div>
//       <button onClick={() => mutate({ name: "bleach" })}>
//         Create anime
//       </button>
//       {isLoading && <div>Loading...</div>}
//       {data?.message}
//     </div>
//   );
// };
