"use client";
import Content from "@/components/Content";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="flex justify-center  min-h-screen">
      <main className="mr-[160px] ml-[160px] w-full ">
        <Nav />

        <Content />
      </main>
    </div>
  );
}
