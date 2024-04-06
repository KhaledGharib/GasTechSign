"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import Edit, { Open } from "@/components/Edit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DisplayProps, DisplayPropsArray } from "@/context/useContext";
import { useState } from "react";

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
    header: "Status",
    accessorKey: "isActive",
    cell: ({ row }) => {
      return (
        <p>{row.original.isActive ? "🟢 Connected" : "🔴 Disconnected"}</p>
      );
    },
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
      function setOpen(open: boolean): void {
        console.log(open);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog open={Open} onOpenChange={setOpen}>
              <DropdownMenu>
                <DropdownMenuItem>
                  <DialogTrigger className="w-full text-start">
                    Edit
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenu>

              <DialogContent>
                <Edit data={row.original} />
                {/* <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Delete</Button>
                </DialogFooter> */}
              </DialogContent>
            </Dialog>

            <DropdownMenuSeparator />
            <DropdownMenuItem>Send</DropdownMenuItem>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuItem>
                  <DialogTrigger className="w-full text-start">
                    Remove
                  </DialogTrigger>
                </DropdownMenuItem>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    Do you want to delete the entry? Deleting this entry cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
