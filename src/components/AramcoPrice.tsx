import { UserData } from "@/components/UserData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AramcoPrice() {
  return (
    <Table className="text-lg m-5 mx-auto shadow-md rounded-md">
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
            <TableCell className="text-center">{data.figure}</TableCell>
            <TableCell className="font-medium text-center">
              {data.description}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
