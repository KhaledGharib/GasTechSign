"use client";
import { DisplayProps, useStateContext } from "@/context/useContext"; // Adjust the import path based on your project structure
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
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
  const { displays, setDisplays, retailFuels } = useStateContext();
  const [selectedDisplay, setSelectedDisplay] = useState<DisplayProps | null>(
    null
  );

  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    displayName: "",
    StationID: "",
    Gasoline91: "",
    Gasoline9: "",
    fuelDI: "",
  });

  const [values, setValues] = useState<DisplayProps | null>(null);
  const [checked, setChecked] = useState(false);

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Gasoline91" || name === "Gasoline95" || name === "Diesel") {
      let price = value;
      price = price.replace(/[^0-9.]/g, "");
      if (/^\d{2}$/.test(price)) {
        price = price + ".";
      }
      const hasMultipleDecimals = price.split(".").length > 2;
      const isValidFormat = /^\d{0,2}(\.\d{0,2})?$/.test(price);
      if (!hasMultipleDecimals && isValidFormat) {
        setValues((prevFormData) => ({
          ...prevFormData,
          [name]: price,
        }));
      }
    } else {
      setValues((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  const handelDelete = async (displayID: string) => {
    if (user && user.id && displays) {
      const userId = user.id;
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, displayID }),
      });

      if (response.ok) {
        const updatedDisplays = displays.filter(
          (display: DisplayProps) => display.id !== displayID
        );
        setDisplays(updatedDisplays);
      } else {
        const errorData = await response.json();
        console.error("Error deleting display:", errorData.error);
      }
    }
  };

  const handleUpdate = async () => {
    if (user && user.id && values) {
      try {
        const ownerId = user.id;
        const response = await fetch("/api/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId,
            displayID: values?.id,
            displayName: values?.displayName,
            location: values?.location,
            Gasoline91: values?.Gasoline91,
            Gasoline95: values?.Gasoline95,
            Diesel: values?.Diesel,
            displays: values?.displayId,
          }),
        });

        if (response.ok) {
          const updatedDisplay = await response.json();
          const updatedDisplays = displays?.map((display: DisplayProps) =>
            display.id === updatedDisplay.id ? updatedDisplay : display
          );
          setDisplays(updatedDisplays ?? []);
          handelSend(values.id!);
          setOpen(false);
        } else {
          const errorData = await response.json();
          console.error("Error updating display:", errorData.error);
        }
      } catch (error) {
        console.error("Error updating display:", error);
      }
    }
  };
  const handelSend = async (displayID: string) => {
    const userId = user?.id;
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          displayID,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const espData = data[0];

        // Modify this fetch request to send JSON data to your ESP
        const espResponse = await fetch("/api/aws", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: espData.displayId,
            fuel91: espData.Gasoline91,
            fuel95: espData.Gasoline95,
            fuelDI: espData.Diesel,
          }),
        });
        const res = await espResponse.json();
        if (espResponse.ok) {
          console.log(res.message);
        } else {
          console.error("Failed to send data to ESP");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const syncFunction = () => {
    setChecked(true);
    if (retailFuels) {
      retailFuels.map((e) => {
        setValues((prevFormData) => ({
          ...prevFormData,
          [e.fuelName.replace(" ", "")]: e.price,
        }));
      });
    }
  };
  const handelSwitch = () => {
    if (checked) {
      setChecked(false);
      setValues((prevFormData) => ({
        ...prevFormData,
        Gasoline91: values?.Gasoline91,
        Gasoline95: values?.Gasoline95,
        Diesel: values?.Diesel,
      }));
    } else {
      syncFunction();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={displays} />
    </div>
  );
}
