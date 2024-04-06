import { DisplayProps, useStateContext } from "@/context/useContext";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export default function Edit(display: any) {
  const { data } = display;
  const { retailFuels, displays, setDisplays } = useStateContext();
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const [errors, setErrors] = useState({
    displayName: "",
    StationID: "",
    Gasoline91: "",
    Gasoline9: "",
    fuelDI: "",
  });
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

  const [values, setValues] = useState<DisplayProps | null>(null);
  useEffect(() => {
    setValues(data);
  }, [data]);
  const { user } = useUser();
  console.log(values);
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
  const handleUpdate = async (userId: string) => {
    if (values) {
      try {
        const response = await fetch("/api/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId: userId,
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
  //   console.log(data);
  return (
    <>
      <Label htmlFor="name">Display Name:</Label>
      <Input
        id="displayName"
        name="displayName"
        placeholder="Enter Display Name"
        value={values?.displayName}
        onChange={handelOnChange}
      />
      {errors.displayName && (
        <p className="text-red-500">{errors.displayName}</p>
      )}

      <Label htmlFor="price">Gasoline 91:</Label>
      <Input
        disabled={checked}
        name="Gasoline91"
        placeholder="Enter Price (e.g., 00.00)"
        value={values?.Gasoline91}
        onChange={handelOnChange}
      />
      <Label htmlFor="price">Gasoline 95:</Label>
      <Input
        disabled={checked}
        name="Gasoline95"
        placeholder="Enter Price (e.g., 00.00)"
        value={values?.Gasoline95}
        onChange={handelOnChange}
      />
      <Label htmlFor="price">Diesel:</Label>
      <Input
        disabled={checked}
        name="Diesel"
        placeholder="Enter Price (e.g., 00.00)"
        value={values?.Diesel}
        onChange={handelOnChange}
      />
      {errors.fuelDI && <p className="text-red-500">{errors.fuelDI}</p>}
      <div className="flex mt-5 justify-around">
        <Button
          onClick={() => {
            handleUpdate(values?.id!);
          }}
          type="submit"
        >
          Save
        </Button>
        <div className="flex items-center gap-3">
          <Switch id="sync" onClick={handelSwitch} checked={checked} />
          <Label htmlFor="sync">Auto Price</Label>
        </div>
      </div>
    </>
  );
}
