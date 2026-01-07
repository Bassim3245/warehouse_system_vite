import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { formatCurrency } from '../../../../utils/formatData'

export default function ImportColumn({tableBody}) {
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
          {importItem?.purchase_date}
        </TableCell>
        <TableCell
          sx={{
            ...importItem?.style,
          }}
        >
          {importItem?.expiration_date}
        </TableCell>
        <TableCell
          sx={{
            ...importItem?.style,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              px: 1,
              py: 0.5,
              display: "inline-block",
              fontWeight: "bold",
            }}
          >
            {`${parseFloat(importItem?.remaining_quantity).toFixed(
              2
            )} ${importItem?.measuring_unit}`}
          </Typography>
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
