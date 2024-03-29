"use client";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Pricing",
    href: "/",
    description: "",
  },
  {
    title: "Mobile version",
    href: "/",
    description: "",
  },
];

export default function Nav() {
  return (
    <>
      <div className="w-full p-3 flex justify-between items-center  ">
        <p className="font-bold text-4xl">GasTechSign</p>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex flex-col items-center justify-center h-full w-full select-none rounded-md bg-purple-400 bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md relative"
                            target="_blank"
                            href="https://github.com/KhaledGharib/GasTechSign"
                          >
                            <div className="flex items-center justify-center absolute inset-0 opacity-50">
                              <Image
                                alt=""
                                src={"/github-mark.svg"}
                                width={100}
                                height={100}
                                className="transition-opacity duration-500 hover:opacity-100"
                              />
                            </div>
                            <p className="mb-2 text-lg font-medium z-10 w-full">
                              GasTechSign Repo ⭐️
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="https://github.com/KhaledGharib/GasTechSign#installation"
                        title="Installation"
                      >
                        Steps for Installing Locally on Your Desktop.
                      </ListItem>
                      <ListItem
                        href="mailto:contact@gharib.com?subject=GasTechSign%20System&body=Hello,%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20GasTechSign%20System.%0A%0ARegards,"
                        title="Request a demo"
                      ></ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Quick links</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/docs" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Documentation
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex justify-center items-center gap-5">
          <ModeToggle />

          <Link href="/api/auth/login">
            <Button className="dark:bg-slate-800 dark:text-white">Login</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
