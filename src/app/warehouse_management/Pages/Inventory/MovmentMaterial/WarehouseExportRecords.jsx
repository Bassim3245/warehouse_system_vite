import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import { BackendUrl } from "../../../../../redux/api/axios";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useTheme } from "@mui/material/styles"; import Chip from "@mui/material/Chip";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";

import ExcelJS from "exceljs";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../../../../redux/LanguageState";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import { getToken } from "../../../../../utils/handelCookie";
import "../../../../../style/DetailsCard.css";
import { CustomNoRowsOverlay } from "../../../../../utils/Function";
import {
  SectionTitle,
  StyledTableCell,
  StyledTableRow,
} from "../../../../../style/generalStyle";
import {
  formatCurrency,
  FormatDataNumber,
  formatDateAr,
  formatDateYearsMonth,
} from "../../../../../utils/formatData";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import Loader from "../../../../../components/reusableComponent/Loader";
export default function MaterialMovementExport() {
  const { id } = useParams();
  const [paramsQuery] = useSearchParams();
  const [deleteItem, setDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materialMovements, setMaterialMovements] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  useEffect(() => {
    const fetchDataByProjectId = async () => {
      try {
        setLoading(true);
        const [movementsResponse] = await Promise.all([
          axiosInstance.get(
            `${BackendUrl}/api/warehouse/materialExportMovements?id=${paramsQuery.get(
              "movement_material_id"
            )}&materialId=${paramsQuery.get("material_id")}`,
            {
              headers: { authorization: token },
            }
          ),
        ]);
        if (movementsResponse?.data) {
          setMaterialMovements(movementsResponse?.data?.data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDataByProjectId();
  }, [id, deleteItem, anchorEl, refreshButton]);
  const componentRef = useRef();
  const tableRef = useRef();
  // Excel Export Function
  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(t("حركة المادة - الصادر"), {
        rightToLeft: true,
      });
      // Define columns
      const columns = [
        { header: "#", key: "index", width: 10 },
        { header: t("رقم الرمزي"), key: "cod_material", width: 15 },
        { header: t("أسم المادة"), key: "name_of_material", width: 20 },
        { header: t("نوع المستند"), key: "document_type2", width: 15 },
        { header: t("رقم المستند"), key: "document_number2", width: 15 },
        { header: t("الكمية"), key: "quantity", width: 12 },
        { header: t("الوحدة"), key: "measuring_unit", width: 12 },
        { header: t("السعر"), key: "price", width: 15 },
        { header: t("تاريخ البيع"), key: "production_date", width: 15 },
        { header: t("تاريخ الإدخال"), key: "export_date", width: 15 },
        { header: t("الجهة المستفيدة"), key: "beneficiary", width: 20 },
      ];

      worksheet.columns = columns;

      // Style the header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "366092" },
      };
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;

      // Add data rows
      materialMovements.forEach((movement, index) => {
        const row = worksheet.addRow({
          index: index + 1,
          cod_material: movement?.cod_material || "N/A",
          name_of_material: movement?.name_of_material || "N/A",
          document_type2: movement?.document_type || "N/A",
          document_number2: movement?.document_number || "N/A",
          quantity: movement?.total_quantity || "0",
          measuring_unit: movement?.measuring_unit || "N/A",
          price: movement?.price ? `${movement.price} دينار` : "N/A",
          production_date:
            formatDateYearsMonth(movement?.production_date) || "N/A",
          export_date: formatDateYearsMonth(movement?.export_date) || "N/A",
          beneficiary: movement?.beneficiary || movement?.beneficiary || "N/A",
        });

        // Style data rows
        row.alignment = { horizontal: "center", vertical: "middle" };
        row.height = 25;

        // Alternate row colors
        if (index % 2 === 0) {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F8F9FA" },
          };
        }
      });
      // Add borders to all cells
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warehouse-export-records-${new Date().toISOString().split("T")[0]
        }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <div className="w-100">
      {loading && <Loader />}
      <div
        className={`p-3 rad-10 ${theme?.palette?.mode === "dark" ? "bg-dark" : "bg-white"
          }`}
        ref={componentRef}
      >
        <Box className="d-flex justify-content-end">
          <Header
            title={t("معلومات المادة")}
          // subTitle={t("معلومات المادة التفصيلية")}
          />
        </Box>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            padding: "15px",
            justifyContent: "flex-start",
          }}
        >
          <div
            className="detailsCard mt-4"
            style={{ margin: "10px", width: "100%", maxWidth: "none" }}
            ref={tableRef}
          >
            <div className="detailsCardBody">
              <Paper elevation={3} sx={{ mb: 4, width: "100%" }}>
                <ButtonTheme
                  sx={{ mr: 2 }}
                  onClick={handleExportToExcel}
                  startIcon={<FileDownloadOutlined />}
                >
                  {t("تصدير إلى Excel")}
                </ButtonTheme>
                <SectionTitle variant="h5" sx={{ textAlign: "left" }}>
                  {t("حركة المادة")}
                </SectionTitle>
                <TableContainer sx={{ textAlign: "left" }}>
                  <Table dir={"rtl"}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 50 }}
                        >
                          #
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 120 }}
                        >
                          {t("رقم الرمزي")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 150 }}
                        >
                          {t("أسم المادة")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 120 }}
                        >
                          {t("نوع المستند")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 120 }}
                        >
                          {t("رقم المستند")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 100 }}
                        >
                          {t("الكمية")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 100 }}
                        >
                          {t("الوحدة")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 120 }}
                        >
                          {t("السعر")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 120 }}
                        >
                          {t("تاريخ الإدخال")}
                        </StyledTableCell>
                        <StyledTableCell
                          className="header"
                          sx={{ minWidth: 150 }}
                        >
                          {t("الجهة المستفيدة")}
                        </StyledTableCell>
                        <StyledTableCell className="header">
                          {t(" الاجراء ")}
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materialMovements.length > 0 ? (
                        <>
                          {materialMovements.map((movement, index) => (
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
                                sx={{ fontWeight: "bold", color: "success.main" }}
                              >
                                {FormatDataNumber(movement?.total_quantity) || "0"}
                              </StyledTableCell>
                              <StyledTableCell>
                                {movement?.measuring_unit || "N/A"}
                              </StyledTableCell>
                              <StyledTableCell
                                sx={{ fontWeight: "bold", color: "success.main" }}
                              >
                                {movement?.price
                                  ? `${formatCurrency(movement.price)} دينار`
                                  : "N/A"}
                              </StyledTableCell>
                              <StyledTableCell>
                                {formatDateAr(movement?.created_at) ||
                                  "N/A"}
                              </StyledTableCell>
                              <StyledTableCell>
                                {movement?.beneficiary ||
                                  movement?.beneficiary ||
                                  "N/A"}
                              </StyledTableCell>
                              <StyledTableCell>---</StyledTableCell>
                            </StyledTableRow>
                          ))}
                          <StyledTableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
                            <StyledTableCell colSpan={5} sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem" }}>
                              {t("إجمالي الكمية:")}
                            </StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: "bold", color: "primary.main", fontSize: "1.1rem" }}>
                              {FormatDataNumber(materialMovements.reduce((acc, curr) => acc + (Number(curr?.total_quantity) || 0), 0))}
                            </StyledTableCell>
                            <StyledTableCell colSpan={5}></StyledTableCell>
                          </StyledTableRow>
                        </>
                      ) : (
                        <StyledTableRow>
                          <StyledTableCell colSpan={12}>
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
        </div>
      </div>
    </div>
  );
}
