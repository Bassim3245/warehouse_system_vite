
import { formatCurrency } from '../../../../utils/formatData'
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function ExportColumn({ tableBody }) {
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
            {importItem?.document_number}
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
            }}
          >
            {importItem?.export_date}
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
  )
}
