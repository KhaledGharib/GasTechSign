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
import { useState } from "react";
import PlacesAutocomplete from "./Places";

export default function AddDisplay() {
  const [open, setOpen] = useState(false);

  const [selectedDisplay, setSelectedDisplay] = useState<DisplayProps | null>(
    null
  );
  const { displays, setDisplays } = useStateContext();

  const { user } = useUser();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
    location: string;
  }>({
    lat: 0,
    lng: 0,
    location: "",
  });
  const handleLatLngChange = (lat: number, lng: number, location: string) => {
    setCoordinates({ lat, lng, location });
  };

  // State variables and validation functions for form fields
  const [errors, setErrors] = useState({
    displayName: "",
    StationID: "",
    fuel91: "",
    fuel95: "",
    fuelDI: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!selectedDisplay?.displayName) {
      newErrors.displayName = "Display Name is required.";
      valid = false;
    } else {
      newErrors.displayName = "";
    }

    if (!selectedDisplay?.displayId) {
      newErrors.StationID = "StationID is required.";
      valid = false;
    } else {
      newErrors.StationID = "";
    }

    if (!selectedDisplay?.fuel91) {
      newErrors.fuel91 = "Price is required.";
      valid = false;
    } else {
      newErrors.fuel91 = "";
    }
    if (!selectedDisplay?.fuel95) {
      newErrors.fuel95 = "Price is required.";
      valid = false;
    } else {
      newErrors.fuel95 = "";
    }
    if (!selectedDisplay?.fuelDI) {
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
            message: {
              fuel91: espData.fuel91,
              fuel95: espData.fuel95,
              fuelDI: espData.fuelDI,
            },
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
          displayName: selectedDisplay?.displayName,
          location: coordinates.location,
          fuel91: selectedDisplay?.fuel91,
          fuel95: selectedDisplay?.fuel95,
          fuelDI: selectedDisplay?.fuelDI,
          displayId: selectedDisplay?.displayId,
          isActive: selectedDisplay?.isActive,
          lat: coordinates.lat,
          lng: coordinates.lng,
        }),
      });

      const newDisplay = await response.json();
      if (response.ok && newDisplay.message === "Created") {
        setDisplays([...displays, newDisplay.data]);
        handelSend(newDisplay.displayId);
        setOpen(false);
        setSelectedDisplay(null);
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
            setSelectedDisplay(null);
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
                id="name"
                name="name"
                placeholder="Enter Display Name"
                value={selectedDisplay?.displayName}
                onChange={(e) =>
                  setSelectedDisplay((prevDisplay: any) => ({
                    ...prevDisplay,
                    displayName: e.target.value,
                  }))
                }
              />
              {errors.displayName && (
                <p className="text-red-500">{errors.displayName}</p>
              )}
              <Label htmlFor="location">Location:</Label>
              <div className="border rounded-md">
                <PlacesAutocomplete
                  location={coordinates.location}
                  lat={coordinates.lat}
                  lng={coordinates.lng}
                  onLatLngChange={handleLatLngChange}
                />
              </div>
              <Label htmlFor="displayId">displayId</Label>
              <Input
                id="displayId"
                name="displayId"
                placeholder="displayId"
                value={selectedDisplay?.displayId}
                onChange={(e) =>
                  setSelectedDisplay((prevDisplay: any) => ({
                    ...prevDisplay,
                    displayId: e.target.value,
                  }))
                }
              />
              {errors.StationID && (
                <p className="text-red-500">{errors.StationID}</p>
              )}
              <Label htmlFor="price">fuel91</Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter Price (e.g., 00.00)"
                value={selectedDisplay?.fuel91}
                onChange={(e) => {
                  let price = e.target.value;

                  price = price.replace(/[^0-9.]/g, "");

                  if (/^\d{2}$/.test(price)) {
                    price = price + ".";
                  }
                  const hasMultipleDecimals = price.split(".").length > 2;
                  const isValidFormat = /^\d{0,2}(\.\d{0,2})?$/.test(price);
                  if (!hasMultipleDecimals && isValidFormat) {
                    setSelectedDisplay((prevDisplay: any) => ({
                      ...prevDisplay,
                      fuel91: price,
                    }));
                  }
                }}
              />
              <Label htmlFor="price">fuel95:</Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter Price (e.g., 00.00)"
                value={selectedDisplay?.fuel95}
                onChange={(e) => {
                  let price = e.target.value;

                  price = price.replace(/[^0-9.]/g, "");

                  if (/^\d{2}$/.test(price)) {
                    price = price + ".";
                  }
                  const hasMultipleDecimals = price.split(".").length > 2;
                  const isValidFormat = /^\d{0,2}(\.\d{0,2})?$/.test(price);
                  if (!hasMultipleDecimals && isValidFormat) {
                    setSelectedDisplay((prevDisplay: any) => ({
                      ...prevDisplay,
                      fuel95: price,
                    }));
                  }
                }}
              />
              <Label htmlFor="price">fuelDI:</Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter Price (e.g., 00.00)"
                value={selectedDisplay?.fuelDI}
                onChange={(e) => {
                  let price = e.target.value;

                  price = price.replace(/[^0-9.]/g, "");

                  if (/^\d{2}$/.test(price)) {
                    price = price + ".";
                  }
                  const hasMultipleDecimals = price.split(".").length > 2;
                  const isValidFormat = /^\d{0,2}(\.\d{0,2})?$/.test(price);
                  if (!hasMultipleDecimals && isValidFormat) {
                    setSelectedDisplay((prevDisplay: any) => ({
                      ...prevDisplay,
                      fuelDI: price,
                    }));
                  }
                }}
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
