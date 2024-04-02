"use client";
import AddDisplay from "@/components/AddDisplay";
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
  const { displays, setDisplays } = useStateContext();
  const [selectedDisplay, setSelectedDisplay] = useState<DisplayProps | null>(
    null
  );

  const { user } = useUser();
  const [open, setOpen] = useState(false);

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
    if (user && user.id && selectedDisplay) {
      try {
        const ownerId = user.id;
        const response = await fetch("/api/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerId,
            displayID: selectedDisplay.id,
            displayName: selectedDisplay.displayName,
            location: selectedDisplay.location,
            fuel91: selectedDisplay.fuel91,
            fuel95: selectedDisplay.fuel95,
            fuelDI: selectedDisplay.fuelDI,
            displays: selectedDisplay.displayId,
          }),
        });

        if (response.ok) {
          const updatedDisplay = await response.json();
          const updatedDisplays = displays?.map((display: DisplayProps) =>
            display.id === updatedDisplay.id ? updatedDisplay : display
          );
          setDisplays(updatedDisplays ?? []);
          handelSend(selectedDisplay.id);
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
                        handelDelete(data.id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        handelSend(data.id);
                      }}
                    >
                      Send
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger
                        asChild
                        onClick={() => {
                          setSelectedDisplay(data);
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
                            <Label htmlFor="location">Location:</Label>
                            <Input
                              id="location"
                              name="location"
                              placeholder="Enter Location"
                              value={selectedDisplay?.location}
                              onChange={(e) =>
                                setSelectedDisplay((prevDisplay: any) => ({
                                  ...prevDisplay,
                                  location: e.target.value,
                                }))
                              }
                            />
                            <Label htmlFor="IP Address">StationID</Label>
                            <Input
                              id="IP Address"
                              name="IP Address"
                              placeholder="IP Address"
                              value={selectedDisplay?.displayId}
                              onChange={(e) =>
                                setSelectedDisplay((prevDisplay: any) => ({
                                  ...prevDisplay,
                                  displayId: e.target.value,
                                }))
                              }
                            />
                            <Label htmlFor="price">91:</Label>
                            <Input
                              id="price"
                              name="price"
                              placeholder="Enter Price"
                              value={selectedDisplay?.fuel91}
                              onChange={(e) =>
                                setSelectedDisplay((prevDisplay: any) => ({
                                  ...prevDisplay,
                                  fuel91: e.target.value,
                                }))
                              }
                            />
                            <Label htmlFor="price">95:</Label>
                            <Input
                              id="price"
                              name="price"
                              placeholder="Enter Price"
                              value={selectedDisplay?.fuel95}
                              onChange={(e) =>
                                setSelectedDisplay((prevDisplay: any) => ({
                                  ...prevDisplay,
                                  fuel95: e.target.value,
                                }))
                              }
                            />
                            <Label htmlFor="price">DI:</Label>
                            <Input
                              id="price"
                              name="price"
                              placeholder="Enter Price"
                              value={selectedDisplay?.fuelDI}
                              onChange={(e) =>
                                setSelectedDisplay((prevDisplay: any) => ({
                                  ...prevDisplay,
                                  fuelDI: e.target.value,
                                }))
                              }
                            />
                            <Button
                              onClick={() => {
                                handleUpdate();
                              }}
                              type="submit"
                            >
                              Save
                            </Button>
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
