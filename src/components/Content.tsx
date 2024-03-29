import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BoltIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  SparklesIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
export default function Content() {
  return (
    <>
      <div className="flex flex-col mt-20 p-2">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-start text-3xl lg:text-6xl font-bold">
              Automate Your Gas Price Signage
            </p>
          </div>
          <Image
            draggable="false"
            className=" shadow-lg rounded-lg md:rounded-3xl  lg:rounded-[40px]"
            src={"/main-image.svg"}
            width={1500}
            height={500}
            alt={"dashboard image"}
          />
        </div>
        <div className="flex flex-col gap-5 mt-20">
          <p className=" text-start text-3xl lg:text-6xl font-bold ">
            Automate in 3 Easy Steps!
          </p>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 mt-4 justify-items-center">
            <Card className="">
              <CardHeader>
                <CardTitle className="text-lg">Step 1️⃣</CardTitle>
                <LockClosedIcon className="w-28 h-28" />
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
            <Card className="">
              <CardHeader>
                <CardTitle className="text-lg">Step 2️⃣</CardTitle>
                <Cog6ToothIcon className="w-28 h-28" />
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
            <Card className="">
              <CardHeader>
                <CardTitle className="text-lg">Step 3️⃣</CardTitle>
                <SparklesIcon className="w-28 h-28" />
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
        <div className="mt-20 mb-4">
          <p id="why" className="text-start text-3xl lg:text-6xl font-bold">
            Why GasTechSign ?
          </p>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 mt-4">
            <Card className="w-full lg:w-1/2">
              <CardHeader className="">
                <CardTitle className="font-bold text-2xl">
                  <div className="flex items-center gap-2">
                    <WifiIcon width={50} height={50} />
                    <p className="font-bold text-2xl">Remote Access</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xl">
                GasTechSign can be accessed remotely, allowing operators to
                manage signage operations from anywhere, at any time, using
                mobile devices or computers.
              </CardContent>
            </Card>
            <Card className="w-full lg:w-1/2">
              <CardHeader className="">
                <CardTitle className="font-bold text-2xl">
                  <div className="flex items-center">
                    <BoltIcon width={50} height={50} />
                    <p className="font-bold text-2xl">Real-time Update</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xl">
                With GasTechSign, changes to pricing or promotional content are
                reflected instantly on the price signs, ensuring accurate and
                up-to-date information for customers.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
