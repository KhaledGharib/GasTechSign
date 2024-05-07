"use client";
import { useStateContext } from "@/context/useContext"; // Adjust the import path based on your project structure
import { useUser } from "@clerk/nextjs";
import { columns } from "./columns";
import { DataTable } from "./data-table";

// async function getData(userId: string): Promise<DisplayProps[]> {
//   try {
//     const res = await fetch("/api/count", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     });
//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }
//     return res.json();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return [];
//   }
// }

export default function DemoPage() {
  const { displays } = useStateContext();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={displays} />
    </div>
  );
}
