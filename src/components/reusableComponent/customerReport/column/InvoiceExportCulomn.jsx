import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function InvoiceExportColumn({ tableBody }) {
    return (
        <TableBody>
            {tableBody?.map((exportItem, index) => (
                <TableRow
                    key={index}
                    sx={{
                        "&:nth-of-type(even)": { bgcolor: "#f9f9f9" },
                        bgcolor: "white",
                    }}
                >
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.index}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.item_code}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.item_name}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.specification}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.quantity}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                        }}
                    >
                        {exportItem?.measuring_unit}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                            fontWeight: "bold",
                        }}
                    >
                        {exportItem?.price}
                    </TableCell>
                    <TableCell
                        sx={{
                            ...exportItem?.style,
                            fontWeight: "bold",
                        }}
                    >
                        {exportItem?.total_price}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}
