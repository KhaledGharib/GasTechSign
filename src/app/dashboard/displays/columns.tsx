"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DisplayProps, DisplayPropsArray } from "@/context/useContext";
import { Switch } from "@radix-ui/react-switch";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };
export const arrayD: (string | DisplayProps | undefined)[] = [];

export const columns: ColumnDef<DisplayProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);
          if (!value) {
            for (let i = arrayD.length; i > 0; i--) {
              arrayD.pop();
            }
            console.log(arrayD);
          } else {
            for (let i = arrayD.length; i > 0; i--) {
              arrayD.pop();
            }
            table.options.data.map((e) => {
              arrayD.push(e);
            });
            console.log(arrayD);
          }
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
          const index = arrayD.indexOf(row.original);

          if (value) {
            arrayD.push(row.original);
          } else {
            arrayD.splice(index, 1);
          }
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Display Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              {/* <Dialog open={open} onOpenChange={setOpen}>
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
              </Dialog> */}
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send</DropdownMenuItem>
            <DropdownMenuItem>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
