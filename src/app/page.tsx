"use client";
import Content from "@/components/Content";
import { ModeToggle } from "@/components/ModeToggle";
import Nav from "@/components/Nav";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex justify-center  min-h-screen">
      <main className="mr-[160px] ml-[160px] w-full ">
        <Nav />

        <Content />
      </main>
    </div>
  );
}
