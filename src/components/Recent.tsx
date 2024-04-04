import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { DisplayProps, useStateContext } from "@/context/useContext";

export default function Recent() {
  const { displays } = useStateContext();
  return (
    <>
      {displays?.length === 0 ? (
        <p className="p-2">You do not have any display yet!</p>
      ) : (
        ""
      )}
      <Carousel>
        <CarouselContent>
          {displays ? (
            displays.map((item: DisplayProps) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-[#F9F4F0] border-none text-[#101323] ">
                  <CardHeader>
                    <CardTitle>{item.displayName}</CardTitle>
                    <CardDescription>{item.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.displayId}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p>{item.isActive ? "🟢 Active" : "🔴 Inactive"}</p>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </CardFooter>
                </Card>
                {/* <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="bg-gray-400 border-dashed border  h-40 w-80 flex justify-center items-center ">
                        <PlusCircleIcon className="w-10 h-10" />
                      </div>
                    </CarouselItem> */}
              </CarouselItem>
            ))
          ) : (
            <Carousel>
              <CarouselContent>
                <CarouselItem className="basis-1/4">
                  <Skeleton className="bg-gray-400 h-40 w-80 " />
                </CarouselItem>
                <CarouselItem className="basis-1/4">
                  <Skeleton className="bg-gray-400 h-40 w-80 " />
                </CarouselItem>
                <CarouselItem className="basis-1/4">
                  <Skeleton className="bg-gray-400 h-40 w-80 " />
                </CarouselItem>

                <CarouselItem className="basis-1/4 ">
                  <Skeleton className="bg-gray-400 h-40 w-80 " />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          )}
        </CarouselContent>
        {/* <CarouselPrevious />
              <CarouselNext /> */}
      </Carousel>
    </>
  );
}
