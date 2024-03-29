"use client";

import AddDisplay from "@/components/AddDisplay";
// import AddDisplay from "@/components/AddDisplay";
import AramcoPrice from "@/components/AramcoPrice";
import MapComponent from "@/components/Map";
import Recent from "@/components/Recent";
import { useStateContext } from "@/context/useContext";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const { displays } = useStateContext();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pb-10">
        <div className="bg-[#101323] rounded-2xl p-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">Aramco Price</p>
            <EllipsisVerticalIcon className="w-9 h-9 border-2 rounded-md hover:cursor-pointer hover:bg-slate-600" />
          </div>
          <AramcoPrice />
        </div>
        <div className="bg-[#95CFDA] md:col-span-2 rounded-2xl ">
          <div className="p-3">
            <MapComponent pins={displays || []} />
          </div>
        </div>
      </div>
      <div className="bg-[#D9BDA7] mt-auto rounded-2xl p-3">
        <div className="flex justify-between items-center p-2">
          <p className="font-medium text-2xl">Recent Added</p>
          <AddDisplay />
        </div>
        <Recent />
      </div>
    </>
  );
}
