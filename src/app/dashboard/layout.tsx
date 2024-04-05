import Side from "@/components/Side";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage Gas Price Signage efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex bg-white min-h-screen overflow-y-hidden ">
        <Side />
        <div className="bg-[#F2F1EF] dark:bg-slate-950 rounded-l-3xl w-full p-10 shadow-inner  ">
          {children}
          <SpeedInsights />
        </div>
      </div>
    </>
  );
}
