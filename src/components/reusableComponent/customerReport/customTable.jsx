import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { formatCurrency } from "../../../utils/formatData";
import CardContent from "./customCardContent";
import ImportColumn from "./column/ImportCulomn";
import ExportColumn from "./column/ExportCulomn";
import InvoiceImportColumn from "./column/InvoiceImportCulomn";
import InvoiceExportColumn from "./column/InvoiceExportCulomn";

function CostumeTable({
  tableHeader,
  tableBody,
  dataItem,
  totalImportQuantity,
  totalImportValue,
  ColumnKey,
}) {
  return (
    <Card elevation={0} sx={{ mb: 3, }}>
      <TableContainer >
        <Table size="small" sx={{ border: "1px solid #000" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "white" }}>
              {tableHeader?.map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    color: "#000",
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #000",
                    "@media print": {
                      backgroundColor: "white !important",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    },

                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {ColumnKey === "import" && <ImportColumn tableBody={tableBody} />}
          {ColumnKey === "exports" && <ExportColumn tableBody={tableBody} />}
          {ColumnKey === "InvoiceImport" && (
            <InvoiceImportColumn tableBody={tableBody} />
          )}
          {ColumnKey === "InvoiceExport" && (
            <InvoiceExportColumn tableBody={tableBody} />
          )}
        </Table>
      </TableContainer>
      {ColumnKey === "import" && (
        <CardContent
          totalImportQuantity={`أجمالي الكمية المستوردة: ${totalImportQuantity} ${dataItem?.measuring_unit}`}
          totalImportValue={`أجمالي قيمة الواردات: ${formatCurrency(
            totalImportValue
          )}`}
          dataItem={dataItem?.material}
        />
      )}
      {ColumnKey === "exports" && (
        <CardContent
          totalImportQuantity={`أجمالي الصادر: ${totalImportQuantity} ${dataItem?.measuring_unit}`}
          totalImportValue={`أجمالي قيمة الصادرات: ${formatCurrency(
            totalImportValue
          )}`}
          dataItem={dataItem?.material}
        />
      )}
    </Card>
  );
}
export default CostumeTable;
