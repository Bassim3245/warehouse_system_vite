import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Print from "@mui/icons-material/Print";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import { toast } from "react-toastify";
import { StyledTableCell, StyledTableRow } from "../../../../style/generalStyle";
import {
  FormatDataNumber,
  formatDateYearsMonth,
} from "../../../../utils/formatData";
import { cellStyles, InfoRow, TableHeader } from "./utils";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { useTranslation } from "react-i18next";
const PrintDialogInventory = ({
  InventoryArchiveData,
  loading,
  dataUserById,
  warehouse_name,
  filterDocumentType,
  Factories_name,
  Labs_name,
}) => {
  const componentRef = useRef();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve, reject) => {
        if (!componentRef.current || !InventoryArchiveData?.length) {
          reject("No content to print");
          return;
        }
        document.body.classList.add("printing");
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => document.body.classList.remove("printing"),
    onPrintError: (error) => {
      console.error("Print failed:", error);
      toast.error("فشل الطباعة. يرجى المحاولة مرة أخرى");
    },
    pageStyle: `
      @page {
        size: landscape !important;
        margin: 4mm !important;
      }
      @media print {
        body { direction: rtl !important; }
      }
    `,
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const FormContent = () => (
    <Box sx={{ direction: "rtl" }}>
      <Box
        ref={componentRef}
        sx={{
          p: 2,
          backgroundColor: "#fff",
          borderRadius: 1,
          boxShadow: 1,
          direction: "rtl",
          "@media print": {
            p: 0,
            m: 0,
            boxShadow: "none",
            backgroundColor: "white !important",
          },
        }}
      >
        {/* الهيدر المتوازن */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 2,
            mb: 2,
            borderBottom: "2px solid #eee",
            "@media print": {
              borderBottom: "2px solid #000",
            },
          }}
        >
          {/* المعلومات اليسرى */}
          <Box sx={{ flex: 1 }}>
            <InfoRow label="الشركة" value={dataUserById?.Entities_name} />
            <InfoRow label="المصنع" value={Factories_name} />
          </Box>
          {/* العنوان الوسطي */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1976d2",
                fontFamily: "Times New Roman, sans-serif !important",
                mb: 1,
              }}
            >
              استمارة نظام الموجودات المخزنية
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#666",
                fontFamily: "Times New Roman, sans-serif !important",
              }}
            >
              {new Date().toLocaleDateString("ar-EG")}
            </Typography>
          </Box>

          {/* المعلومات اليمنى */}
          <Box sx={{ flex: 1, textAlign: "right" }}>
            <InfoRow label="المعمل" value={Labs_name} />
            <InfoRow label="المخزن" value={warehouse_name} />
          </Box>
        </Box>

        {/* الجدول */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !InventoryArchiveData?.length ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography color="text.secondary">لا توجد بيانات متاحة</Typography>
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              border: "1px solid #eee",
              "@media print": {
                border: "none",
                overflow: "visible",
              },
            }}
          >
            <Table sx={{ width: "100%", direction: "rtl" }}>
              <TableHeader filterDocument={filterDocumentType} />
              <TableBody>
                {InventoryArchiveData?.map((item, index) => (
                  <StyledTableRow
                    key={item?.id || index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                      "@media print": {
                        backgroundColor: index % 2 === 0 ? "#f8f8f8" : "#fff",
                      },
                    }}
                  >
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.cod_material}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.name_of_material}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.measuring_unit}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.document_number}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateYearsMonth(item?.document_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.document_type}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.quantity}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.specification}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateYearsMonth(item?.production_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateYearsMonth(item?.expiration_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="right">
                      {item?.origin}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {formatDateYearsMonth(item?.purchase_date) || "---"}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.price}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {FormatDataNumber(item?.price * item?.quantity)}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.minimum_stock_level}
                    </StyledTableCell>
                    <StyledTableCell sx={cellStyles} align="center">
                      {item?.state_name}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
  const FormActions = () => (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      {" "}
      <Button
        onClick={handleClose}
        variant="outlined"
        disabled={loading}
        size="small"
      >
        {t("close")}
      </Button>
      <ButtonTheme
        variant="contained"
        color="success"
        onClick={handlePrint}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Print />}
        size="small"
      >
        طباعة الجرد
      </ButtonTheme>
    </Stack>
  );
  return (
    <div>
      <Tooltip title="طباعة الجرد الشهري">
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<Print />}
        >
          طباعة الجرد
        </Button>
      </Tooltip>
      <PopupForm
        title="إكمال الجرد الشهري وأرشفة المستندات"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        icon={<Print color="success" />}
        width="100%"
        fullheight={true}
        is_margin={true}
        content={<FormContent />}
        footer={<FormActions />}
      />
    </div>
  );
};
export default PrintDialogInventory;
