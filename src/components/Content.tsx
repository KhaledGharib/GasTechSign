import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cog6ToothIcon,
  LockClosedIcon,
  MapIcon,
  MapPinIcon,
  PaintBrushIcon,
  SparklesIcon,
  UserCircleIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";
import React from "react";
export default function Content() {
  return (
    <>
      <div className="flex flex-col gap-28  p-5  ">
        <div className="flex flex-col justify-end gap-10 mt-10">
          <p className="ml-10 text-start text-3xl lg:text-6xl font-bold ">
            Automate your gas stations in 3 steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 justify-items-center">
            <Card className="bg-[#F9F4F0] border-none text-[#101323]  w-[250px]  lg:w-[300px] ">
              <CardHeader>
                <CardTitle className="text-lg">Step 1️⃣</CardTitle>
                <CardDescription>
                  <LockClosedIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Login to your account</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur
                </p>
              </CardFooter>
            </Card>
            <Card className="bg-[#F9F4F0] border-none text-[#101323]  w-[250px]  lg:w-[300px]">
              <CardHeader>
                <CardTitle className="text-lg">Step 2️⃣</CardTitle>
                <CardDescription>
                  <Cog6ToothIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Configure your displays</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur.
                </p>
              </CardFooter>
            </Card>
            <Card className="bg-[#F9F4F0] border-none text-[#101323] w-[250px]  lg:w-[300px]">
              <CardHeader>
                <CardTitle className="text-lg">Step 3️⃣</CardTitle>
                <CardDescription>
                  <SparklesIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Ready to go</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-10 mt-10 mb-10">
          <p className="ml-10 text-start text-3xl lg:text-6xl font-bold ">
            Features
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 justify-items-center">
            <Card className="bg-[#F9F4F0] border-none text-[#101323]  w-[250px]  lg:w-[300px]">
              <CardHeader>
                <CardTitle>Map</CardTitle>
                <CardDescription>
                  <MapPinIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>See all your displays on the map</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur.
                </p>
              </CardFooter>
            </Card>
            <Card className="bg-[#F9F4F0] border-none text-[#101323]  w-[250px]  lg:w-[300px]">
              <CardHeader>
                <CardTitle>Wifi</CardTitle>
                <CardDescription>
                  <WifiIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Control all of theme on one place</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur.
                </p>
              </CardFooter>
            </Card>
            <Card className="bg-[#F9F4F0] border-none text-[#101323]  w-[250px]  lg:w-[300px]">
              <CardHeader>
                <CardTitle>UI/UX</CardTitle>
                <CardDescription>
                  <PaintBrushIcon className="w-28 h-28" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Friendly Dashboard</p>
              </CardContent>
              <CardFooter>
                <p>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Ipsum consectetur.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
