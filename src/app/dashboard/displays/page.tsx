"use client";
import AddDisplay from "@/components/AddDisplay";
import PlacesAutocomplete from "@/components/Places";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DisplayProps, useStateContext } from "@/context/useContext";
import { useUser } from "@clerk/nextjs";

import { useState } from "react";

export default function Displays() {
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
  const handleLatLngChange = (lat: number, lng: number, location: string) => {
    setValues({ lat, lng, location });
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
    <div>
      <AddDisplay />
      {displays ? (
        <Table className="text-lg m-5 mx-auto  shadow-md rounded-md  bg-[#101323]">
          <TableCaption>displays</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Displays</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displays.map((data: DisplayProps) => (
              <TableRow key={data.id}>
                <TableCell className="text-left">{data.displayName}</TableCell>
                <TableCell className="font-medium text-center  gap-2">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => {
                        handelDelete(data.id!);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        handelSend(data.id!);
                      }}
                    >
                      Send
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger
                        asChild
                        onClick={() => {
                          setValues(data);
                        }}
                      >
                        <Button>Edit</Button>
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
                              <p className="text-red-500">
                                {errors.displayName}
                              </p>
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
                            {errors.fuelDI && (
                              <p className="text-red-500">{errors.fuelDI}</p>
                            )}
                            <div className="flex mt-5 justify-around">
                              <Button
                                onClick={() => {
                                  handleUpdate();
                                }}
                                type="submit"
                              >
                                Save
                              </Button>
                              <div className="flex items-center gap-3">
                                <Switch
                                  id="sync"
                                  onClick={handelSwitch}
                                  checked={checked}
                                />
                                <Label htmlFor="sync">Auto Price</Label>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>loading</p>
      )}
    </div>
  );
}
