"use client";

import AddDisplay from "@/components/AddDisplay";
// import AddDisplay from "@/components/AddDisplay";
import AramcoPrice from "@/components/AramcoPrice";
import MapComponent from "@/components/Map";
import Recent from "@/components/Recent";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStateContext } from "@/context/useContext";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
export default function Dashboard() {
  const { displays } = useStateContext();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pb-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="font-medium  text-2xl">
              Aramco Price
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Request Update For Price</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <AramcoPrice />
          </CardContent>
        </Card>
        <Card className=" md:col-span-2 rounded-2xl ">
          <CardContent className="p-3">
            <MapComponent pins={displays || []} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="font-medium text-2xl">Recent Added</CardTitle>
          <AddDisplay />
        </CardHeader>
        <CardContent>
          <Recent />
        </CardContent>
      </Card>
    </>
  );
}
