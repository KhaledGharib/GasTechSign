import { UserData } from "@/components/UserData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FuelPricesData, useStateContext } from "@/context/useContext";

const AramcoPrice: React.FC = () => {
  const currentDate = new Date().toDateString();
  const { retailFuels } = useStateContext();
  if (retailFuels) {
    return (
      <Table className="text-xl font-medium">
        <TableCaption>
          {<p>Aramco Retail Fuel price for {currentDate}</p>}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">SR/L</TableHead>
            <TableHead className="text-center">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {retailFuels.map((data: FuelPricesData, index: number) => (
            <TableRow key={index}>
              <TableCell className="text-center">{data.price}</TableCell>
              <TableCell className="font-medium text-center">
                {data.fuelName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  return (
    <Skeleton className="w-full h-[370px] rounded-md p-4 flex flex-col gap-5">
      <Skeleton className="w-full h-20 " />
      <Skeleton className="w-full h-20 " />
      <Skeleton className="w-full h-20 " />
      <Skeleton className="w-full h-20 " />
    </Skeleton>
  );
};
export default AramcoPrice;
