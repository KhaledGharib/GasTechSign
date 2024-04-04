import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisplayProps, useStateContext } from "@/context/useContext";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import PlacesAutocomplete from "./Places";

export default function AddDisplay() {
  const { user } = useUser();
  const { displays, setDisplays, retailFuels } = useStateContext();

  // State variables and validation functions for form fields
  const [errors, setErrors] = useState({
    displayName: "",
    StationID: "",
    Gasoline91: "",
    Gasoline95: "",
    Diesel: "",
  });
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [values, setValues] = useState<DisplayProps | null>(null);

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
  const handleLatLngChange = (lat: number, lng: number, location: string) => {
    setValues({ lat, lng, location });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!values?.displayName) {
      newErrors.displayName = "Display Name is required.";
      valid = false;
    } else {
      newErrors.displayName = "";
    }

    if (!values?.displayId) {
      newErrors.StationID = "StationID is required.";
      valid = false;
    } else {
      newErrors.StationID = "";
    }

    if (!values?.Gasoline91) {
      newErrors.Gasoline91 = "Price is required.";
      valid = false;
    } else {
      newErrors.Gasoline91 = "";
    }
    if (!values?.Gasoline95) {
      newErrors.Gasoline95 = "Price is required.";
      valid = false;
    } else {
      newErrors.Gasoline95 = "";
    }
    if (!values?.Diesel) {
      newErrors.Diesel = "Price is required.";
      valid = false;
    } else {
      newErrors.Diesel = "";
    }

    setErrors(newErrors);
    return valid;
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
  const handelSubmit = async () => {
    if (user && user.id && displays && validateForm()) {
      const userId = user.id;
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          displayName: values?.displayName,
          location: values?.location,
          Gasoline91: values?.Gasoline91,
          Gasoline95: values?.Gasoline95,
          Diesel: values?.Diesel,
          displayId: values?.displayId,
          isActive: values?.isActive,
          lat: values?.lat,
          lng: values?.lng,
        }),
      });

      const newDisplay = await response.json();
      if (response.ok && newDisplay.message === "Created") {
        setDisplays([...displays, newDisplay.data]);
        handelSend(newDisplay.displayId);
        setOpen(false);
        setValues(null);
      } else {
        console.error("Error deleting display:", newDisplay.message);
      }
    }
  };
  const handelSwitch = () => {
    if (checked) {
      setChecked(false);
      setValues((prevFormData) => ({
        ...prevFormData,
        Gasoline91: "",
        Gasoline95: "",
        Diesel: "",
      }));
    } else {
      syncFunction();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={syncFunction}>Add new Display</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new Fuelight</DialogTitle>
            <DialogDescription>
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
              <Label htmlFor="location">Location:</Label>
              <div className="border rounded-md">
                <PlacesAutocomplete
                  location={values?.location!}
                  lat={values?.lat!}
                  lng={values?.lng!}
                  onLatLngChange={handleLatLngChange}
                />
              </div>
              <Label htmlFor="displayId">displayId</Label>
              <Input
                id="displayId"
                name="displayId"
                placeholder="displayId"
                value={values?.displayId}
                onChange={handelOnChange}
              />
              {errors.StationID && (
                <p className="text-red-500">{errors.StationID}</p>
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
              {errors.Diesel && <p className="text-red-500">{errors.Diesel}</p>}
              <div className="flex mt-5 justify-around">
                <Button onClick={handelSubmit} type="submit">
                  Add
                </Button>
                <div className="flex items-center gap-3">
                  <Switch id="sync" onClick={handelSwitch} checked={checked} />
                  <Label htmlFor="sync">Auto Price</Label>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
