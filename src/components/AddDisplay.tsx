import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DisplayProps, useStateContext } from "@/context/useContext";
import { useUser } from "@clerk/nextjs";
import { ReactEventHandler, useState } from "react";
import PlacesAutocomplete from "./Places";

export default function AddDisplay() {
  const { user } = useUser();
  const { displays, setDisplays } = useStateContext();

  // State variables and validation functions for form fields
  const [errors, setErrors] = useState({
    displayName: "",
    StationID: "",
    fuel91: "",
    fuel95: "",
    fuelDI: "",
  });
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<DisplayProps | null>(null);

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "fuel91" || name === "fuel95" || name === "fuelDI") {
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

    if (!values?.fuel91) {
      newErrors.fuel91 = "Price is required.";
      valid = false;
    } else {
      newErrors.fuel91 = "";
    }
    if (!values?.fuel95) {
      newErrors.fuel95 = "Price is required.";
      valid = false;
    } else {
      newErrors.fuel95 = "";
    }
    if (!values?.fuelDI) {
      newErrors.fuelDI = "Price is required.";
      valid = false;
    } else {
      newErrors.fuelDI = "";
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
            fuel91: espData.fuel91,
            fuel95: espData.fuel95,
            fuelDI: espData.fuelDI,
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
          fuel91: values?.fuel91,
          fuel95: values?.fuel95,
          fuelDI: values?.fuelDI,
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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          asChild
          onClick={() => {
            setValues(null);
          }}
        >
          <Button>Add new Display</Button>
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
              <Label htmlFor="price">fuel91:</Label>
              <Input
                name="fuel91"
                placeholder="Enter Price (e.g., 00.00)"
                value={values?.fuel91}
                onChange={handelOnChange}
              />
              <Label htmlFor="price">fuel95:</Label>
              <Input
                name="fuel95"
                placeholder="Enter Price (e.g., 00.00)"
                value={values?.fuel95}
                onChange={handelOnChange}
              />
              <Label htmlFor="price">fuelDI:</Label>
              <Input
                name="fuelDI"
                placeholder="Enter Price (e.g., 00.00)"
                value={values?.fuelDI}
                onChange={handelOnChange}
              />
              {errors.fuelDI && <p className="text-red-500">{errors.fuelDI}</p>}

              <Button onClick={handelSubmit} type="submit">
                Add
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
