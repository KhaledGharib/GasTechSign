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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { DisplayProps, useStateContext } from "@/context/useContext";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Recent() {
  const { displays } = useStateContext();
  return (
    <>
      {displays.length === 0 ? (
        <p className="p-2">You do not have any display yet!</p>
      ) : (
        ""
      )}
      <Carousel>
        <CarouselContent>
          {displays ? (
            displays.map((item: DisplayProps) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
                <Card className=" ">
                  <CardHeader>
                    <CardTitle>{item.displayName}</CardTitle>
                    <CardDescription>{item.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.displayId}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p>{item.isActive ? "🟢 Connected" : "🔴 Disconnected"}</p>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </CardFooter>
                </Card>
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
