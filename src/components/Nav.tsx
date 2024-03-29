"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import React from "react";
// import { LoginButton } from "./buttons/ login-button";
export default function Nav() {
  const { user } = useUser();

  return (
    <>
      <div className="bg-yellow-100 w-full p-3 flex justify-between items-center">
        <p className="font-bold text-4xl text-black">GasTechSign</p>
        <Link href="/api/auth/login">
          <Button className="dark:bg-slate-800 dark:text-white">Login</Button>
        </Link>
      </div>
    </>
  );
}
