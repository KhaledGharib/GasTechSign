// "use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserData } from "@/components/UserData";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Display {
  ownerId: string;
  name: string;
  location: string;
  price: string;
}

export default function DashButton() {
  const { user } = useUser();
  const [display, setDisplay] = useState<Display>({
    ownerId: "",
    name: "",
    location: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user && user.sub) {
      const { name, value } = e.target;
      const ownerId = user.sub.replace("auth0|", "");
      setDisplay((prevDisplay) => ({ ...prevDisplay, ownerId, [name]: value }));
    }
  };

  const submit = async () => {
    try {
      const response = await fetch("/api/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(display),
      });

      if (response.ok) {
        const data = await response.json();
        setDisplay({
          ownerId: "",
          name: "",
          location: "",
          price: "",
        });
        console.log(data);
      } else {
        throw new Error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      <div className="flex gap-2 items-center">
        <Dialog>
          <DialogTrigger className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2 rounded-sm ">
            Add new Fuelight
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
                  value={display.name}
                  onChange={handleChange}
                />
                <Label htmlFor="location">Location:</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Enter Location"
                  value={display.location}
                  onChange={handleChange}
                />
                <Label htmlFor="price">Price:</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="Enter Price"
                  onChange={(e) => {
                    const price = e.target.value;
                    const isValidInput = /^-?\d*\.?\d*$/.test(price);
                    if (isValidInput || price === "") {
                      setDisplay((prevDisplay) => ({ ...prevDisplay, price }));
                    }
                  }}
                  value={display.price}
                />
                <Button onClick={submit} type="submit">
                  Add
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className=" bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-4 py-2 rounded-sm  ">
            Show all
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Price List</DialogTitle>
              <DialogDescription>
                <Table className="text-lg mt-10 mx-auto shadow-md rounded-md">
                  <TableCaption>{UserData[0].quote}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">SR/L</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {UserData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="text-center">
                          {data.figure}
                        </TableCell>
                        <TableCell className="font-medium text-center">
                          {data.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
