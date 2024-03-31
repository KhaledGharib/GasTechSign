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
import { useState } from "react";
import PlacesAutocomplete from "./Places";
import { useUser } from "@clerk/nextjs";

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
    location: "",
    ipAddress: "",
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

    if (!coordinates.location) {
      newErrors.location = "Location is required.";
      valid = false;
    } else {
      newErrors.location = "";
    }

    if (!selectedDisplay?.ipAddress) {
      newErrors.ipAddress = "IP Address is required.";
      valid = false;
    } else {
      newErrors.ipAddress = "";
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

  const handelSubmit = async () => {
    if (user && user.id && displays && validateForm()) {
      const ownerId = user.id.replace("auth0|", "");
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId,
          displayName: selectedDisplay?.displayName,
          location: coordinates.location,
          fuel91: selectedDisplay?.fuel91,
          fuel95: selectedDisplay?.fuel95,
          fuelDI: selectedDisplay?.fuelDI,
          ipAddress: selectedDisplay?.ipAddress,
          isActive: selectedDisplay?.isActive,
          lat: coordinates.lat,
          lng: coordinates.lng,
        }),
      });

      const newDisplay = await response.json();
      if (response.ok && newDisplay.message === "Created") {
        setDisplays([...displays, newDisplay.data]);
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
              {errors.location && (
                <p className="text-red-500">{errors.location}</p>
              )}
              <Label htmlFor="IP Address">IP Address</Label>
              <Input
                id="IP Address"
                name="IP Address"
                placeholder="IP Address"
                value={selectedDisplay?.ipAddress}
                onChange={(e) =>
                  setSelectedDisplay((prevDisplay: any) => ({
                    ...prevDisplay,
                    ipAddress: e.target.value,
                  }))
                }
              />
              {errors.ipAddress && (
                <p className="text-red-500">{errors.ipAddress}</p>
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
