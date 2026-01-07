import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../../../utils/formatData";

export default function InvoiceImportColumn({ tableBody }) {
  return (
    <TableBody>
      {tableBody?.map((importItem, index) => (
        <TableRow
          key={index}
          sx={{
            "&:nth-of-type(even)": { bgcolor: "#f9f9f9" },
            bgcolor: "white",
          }}
        >
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem?.index}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem?.item_code}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem?.item_name}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem.quantity} {importItem?.measuring_unit}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
              fontWeight: "bold",
            }}
          >
            {formatCurrency(importItem?.price)}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
              fontWeight: "bold",
            }}
          >
            {formatCurrency(importItem?.price * importItem?.quantity)}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem?.purchase_date}
          </TableCell>
          <TableCell
            sx={{
              ...importItem?.style,
            }}
          >
            {importItem?.beneficiary}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
