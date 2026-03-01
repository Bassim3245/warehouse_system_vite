import FileDownload from "@mui/icons-material/FileDownload";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Paper from "@mui/material/Paper";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import {
  CustomNoRowsOverlay,
  renderMenuItem,
} from "../../utils/Function";
import {
  SectionTitle,
  StyledTableCell,
  StyledTableRow,
} from "../../style/generalStyle";
import { formatCurrency, FormatDataNumber, formatDateAr, formatDateYearsMonth } from "../../utils/formatData";
import DropDownGrid from "../reusableComponent/CustomMennu";

const MaterialMovementsTable = ({
  materialMovements,
  openMovement,
}) => {
  const { t } = useTranslation();

  // Excel export function
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("حركة المادة");

      // Set RTL direction
      worksheet.views = [{ rightToLeft: true }];

      // Define headers
      const headers = [
        "#",
        "رمز المادة",
        "أسم المادة",
        "نوع المستند",
        "رقم المستند",
        "الكمية",
        "المتبقي",
        "الرصيد",
        "الحالة",
        "وحدة القياس",
        "السعر",
        "تاريخ الإنتاج",
        "تاريخ الإدخال",
        "تاريخ الانتهاء",
        "الجهة المستفيدة",
      ];

      // Add headers
      const headerRow = worksheet.addRow(headers);
      headerRow.font = { bold: true, size: 12 };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };

      // Add data rows
      materialMovements.forEach((movement, index) => {
        const row = worksheet.addRow([
          index + 1,
          movement?.cod_material || "N/A",
          movement?.name_of_material || "N/A",
          movement?.document_type || "N/A",
          movement?.document_number || "N/A",
          movement?.quantity_incoming_outgoing || "0",
          movement?.remaining_quantity || "0",
          movement?.balance || "0",
          movement?.state_name || "N/A",
          movement?.measuring_unit || "N/A",
          movement?.price ? `${movement.price} دينار` : "N/A",
          formatDateYearsMonth(movement?.production_date) || "N/A",
          formatDateYearsMonth(movement?.purchase_date) || "N/A",
          formatDateYearsMonth(movement?.expiry_date) || "N/A",
          movement?.beneficiary || movement?.beneficiary2 || "N/A",
        ]);

        // Style data rows
        row.alignment = { horizontal: "center", vertical: "middle" };
        row.font = { size: 10 };

        // Add borders
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach((column, index) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = Math.min(Math.max(maxLength + 2, 10), 50);
      });

      // Add borders to header
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Generate file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `حركة_المادة_${new Date().toISOString().split("T")[0]
        }.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };
  return (
    <div className="detailsCard mt-4" style={{ margin: "6px", width: "100%" }}>
      <div className="detailsCardBody">
        <Paper elevation={3} sx={{ mb: 4, p: 2, width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <SectionTitle variant="h5" sx={{ textAlign: "left" }}>
              {t("حركة المادة")}
            </SectionTitle>
            <Button
              variant="contained"
              color="success"
              startIcon={<FileDownload />}
              onClick={exportToExcel}
              disabled={materialMovements.length === 0}
            >
              {t("تصدير إلى Excel")}
            </Button>
          </div>
          <TableContainer sx={{ textAlign: "left" }}>
            <Table dir={"rtl"}>
              <TableHead>
                <TableRow>
                  <StyledTableCell className="header" sx={{ minWidth: 50 }}>
                    #
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("رقم الرمزي")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 150 }}>
                    {t("أسم المادة")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("نوع المستند")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("رقم المستند")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 100 }}>
                    {t("الكمية")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 100 }}>
                    {t("المتبقي")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 80 }}>
                    {t("الرصيد")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 100 }}>
                    {t("الحالة")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 100 }}>
                    {t("الوحدة")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("السعر")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("تاريخ الإنتاج")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("تاريخ الإدخال")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 120 }}>
                    {t("تاريخ الانتهاء")}
                  </StyledTableCell>
                  <StyledTableCell className="header" sx={{ minWidth: 150 }}>
                    {t("الجهة المستفيدة")}
                  </StyledTableCell>
                  <StyledTableCell className="header">
                    {t(" الاجراء ")}
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialMovements?.length > 0 ? (
                  materialMovements?.map((movement, index) => (
                    <StyledTableRow key={index} hover>
                      <StyledTableCell sx={{ fontWeight: "bold" }}>
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={movement?.cod_material || "N/A"}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: "medium" }}>
                        {movement?.name_of_material || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={movement?.document_type || "N/A"}
                          size="small"
                          color={
                            movement?.document_type === "مستند وارد"
                              ? "success"
                              : "info"
                          }
                          variant="filled"
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontFamily: "monospace" }}>
                        {movement?.document_number || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          fontWeight: "bold",
                          color: "success.main",
                        }}
                      >
                        {FormatDataNumber(movement?.quantity) || "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          fontWeight: "bold",
                          color: "warning.main",
                        }}
                      >
                        {FormatDataNumber(movement?.remaining_quantity) || "0"}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          fontWeight: "bold",
                          color: "primary.main",
                        }}
                      >
                        {FormatDataNumber(movement?.balance) || "0"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={movement?.state_name || "N/A"}
                          size="small"
                          color={
                            movement?.state_name === "جيدة"
                              ? "success"
                              : "warning"
                          }
                          variant="filled"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {movement?.measuring_unit || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          fontWeight: "bold",
                          color: "success.main",
                        }}
                      >
                        {movement?.price
                          ? `${formatCurrency(movement.price)} دينار`
                          : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDateAr(movement?.production_date) ||
                          "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDateAr(movement?.purchase_date) || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDateAr(movement?.expiry_date) || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {movement?.beneficiary ||
                          movement?.beneficiary2 ||
                          "N/A"}
                      </StyledTableCell>
                      <DropDownGrid>
                        {renderMenuItem(
                          "informationProduct",
                          () =>
                            openMovement(
                              movement?.inventory_id,
                              "Warehouse-out-Records"
                            ),
                          OpenInNew,
                          " حركات الاخراج  "
                        )}

                      </DropDownGrid>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={16}>
                      <CustomNoRowsOverlay />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default MaterialMovementsTable;
