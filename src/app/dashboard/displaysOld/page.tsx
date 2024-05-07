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

// "use client";

// import {
//   CaretSortIcon,
//   ChevronDownIcon,
//   DotsHorizontalIcon,
// } from "@radix-ui/react-icons";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import * as React from "react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { DisplayProps, useStateContext } from "@/context/useContext";
// const arrayD: (string | undefined)[] = [];

// export default function Displays() {

//   const { displays } = useStateContext();
//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});
//   const columns: ColumnDef<DisplayProps>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => {
//             table.toggleAllPageRowsSelected(!!value);
//             if (!value) {
//               for (let i = arrayD.length; i > 0; i--) {
//                 arrayD.pop();
//               }
//               console.log(arrayD);
//             } else {
//               displays.map((e) => {
//                 arrayD.push(e.id);
//               });
//               console.log(arrayD);
//             }
//           }}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value: any) => {
//             row.toggleSelected(!!value);
//             console.log(row);
//             const displayId = row.original.id;
//             const index = arrayD.indexOf(displayId);

//             if (value) {
//               arrayD.push(displayId);
//               console.log(arrayD);
//             } else {
//               arrayD.splice(index, 1);
//               console.log(arrayD);
//             }
//           }}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "displayName",
//       header: ({ column }) => {
//         return (
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Display Name
//             <CaretSortIcon className="ml-2 h-4 w-4" />
//           </Button>
//         );
//       },
//       cell: ({ row }) => (
//         <div className="lowercase">{row.getValue("displayName")}</div>
//       ),
//     },
//     {
//       accessorKey: "Action",
//       id: "actions",
//       enableHiding: false,
//       cell: ({ row }) => {
//         const payment = row.original;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <DotsHorizontalIcon className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem
//                 onClick={() =>
//                   navigator.clipboard.writeText(payment.id as string)
//                 }
//               >
//                 Edit
//               </DropdownMenuItem>
//               <DropdownMenuItem>Send</DropdownMenuItem>
//               {/* <DropdownMenuSeparator /> */}
//               <DropdownMenuItem>Remove</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];
//   const table = useReactTable({
//     data: displays,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   return (
//     <div className="w-full ">
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Filter Display Name..."
//           value={
//             (table.getColumn("displayName")?.getFilterValue() as string) ?? ""
//           }
//           onChange={(event) =>
//             table.getColumn("displayName")?.setFilterValue(event.target.value)
//           }
//           className="max-w-sm"
//         />
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of{" "}
//           {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <div className="space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
