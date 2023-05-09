"use client";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function SwiperRender({ children }: { children: React.ReactNode[] }) {
  return (
    <Swiper
      wrapperClass="flex h-8  items-center space-x-2"
      className="!m-0 mr-auto flex w-fit items-center justify-start"
      slidesPerView={"auto"}
    >
      {children.map((child, index) => {
        return (
          <SwiperSlide
            className="!flex min-w-fit max-w-fit items-center justify-start"
            key={`child-${index}`}
          >
            {child}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

function TabsSwiper({ genres }: { genres: string[] }) {
  return (
    <>
      <TabsList className="w-[400px] max-w-full" asChild>
        <Swiper
          wrapperClass="flex h-8  items-center space-x-2"
          className="!ml-0 mb-4 mr-auto flex w-fit items-center justify-start"
          slidesPerView={"auto"}
        >
          <SwiperSlide className="flex min-w-fit max-w-fit items-center justify-start ">
            <TabsTrigger className="h-full" value="ALL">
              ALL
            </TabsTrigger>
          </SwiperSlide>
          {genres.map((genre, index) => {
            return (
              <SwiperSlide
                className="flex min-w-fit max-w-fit items-center justify-start "
                key={`tab-${genre}`}
              >
                <TabsTrigger className="h-full" value={genre}>
                  {genre}
                </TabsTrigger>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </TabsList>
    </>
  );
}

export default TabsSwiper;
