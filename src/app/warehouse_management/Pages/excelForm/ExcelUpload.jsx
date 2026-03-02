import { useState, useCallback, useMemo } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentPasteGo from "@mui/icons-material/ContentPasteGo";
import Download from "@mui/icons-material/Download";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";

import ExcelJS from "exceljs";
import excelImage from "../../../../assets/image/pngwing.com.png";
import { toast } from "react-toastify";

export default function ExcelUpload({ setDataFileExcel }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /** ----------------------------------------------------
   *  Memoized file preview
   ------------------------------------------------------*/
  const filePreview = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  /** ----------------------------------------------------
   *  Handle Excel Upload — Optimized
   ------------------------------------------------------*/
  const handleFileExcelUpload = useCallback(async () => {
    if (!file) {
      toast.warning("يرجى اختيار ملف قبل التحميل.");
      return;
    }

    try {
      setIsProcessing(true);
      setUploadStatus(null);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) throw new Error("ملف الإكسل لا يحتوي على أي أوراق عمل.");

      const headersMap = {};
      const extractedData = [];

      // ----------- 1) قراءة عناوين الأعمدة -----------
      const headerRow = worksheet.getRow(1);

      headerRow.eachCell((cell, colNumber) => {
        const label = cell.text?.trim();
        if (label) headersMap[label] = colNumber;
      });

      // ----------- 2) دالة مساعده لاختيار أول Label موجود -----------
      const getCellByLabel = (row, labels = []) => {
        for (const label of labels) {
          if (headersMap[label]) {
            return row.getCell(headersMap[label]).text?.trim() || null;
          }
        }
        return null;
      };

      // ----------- 3) قراءة الصفوف -----------
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowData = {
          code: getCellByLabel(row, ["الرقم الرمزي", "رمز المادة"]),
          materialName: getCellByLabel(row, ["أسم المادة", "اسم المادة"]),
          origin: getCellByLabel(row, ["المنشأ", "منشأ"]),
          unitMeasuring: getCellByLabel(row, ["وحدة القياس", "وحدة القياس"]),
          specification: getCellByLabel(row, ["المواصفات الفنية", "مواصفات فنية"]),
          status: getCellByLabel(row, ["حالة المادة", "حالة المادة"]),
          balance: getCellByLabel(row, ["الرصيد الافتتاحي", "رصيد افتتاحي","الرصيد"]),
          price: getCellByLabel(row, ["السعر المفرد", "سعر مفرد"]),
          minimum_stock_level: getCellByLabel(row, ["الحد الادنا للمخزون", "حد أدنى للمخزون"]),
        };

        const hasValue = Object.values(rowData).some(
          (v) => v && v !== "yyyy-mm-dd"
        );

        if (hasValue) extractedData.push(rowData);
      });

      setDataFileExcel(extractedData);
      setUploadStatus("success");

      toast.success(`تم استخراج ${extractedData.length} عنصر بنجاح!`);

    } catch (err) {
      console.error("Excel Upload Error:", err.message);
      setUploadStatus("error");
      toast.error(err.message || "حدث خطأ أثناء تحميل ملف Excel.");
    } finally {
      setIsProcessing(false);
    }
  }, [file, setDataFileExcel]);


  /** ----------------------------------------------------
   *  Handle File Change — Optimized
   ------------------------------------------------------*/
  const handleFileChange = useCallback((e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return;

    const ext = uploadedFile.name.split(".").pop().toLowerCase();
    const maxSize = 10 * 1024 * 1024;

    if (ext !== "xlsx") {
      toast.error("يسمح فقط بملفات XLSX");
      return setUploadStatus(null);
    }

    if (uploadedFile.size > maxSize) {
      toast.error("الحد الأقصى 10 ميجابايت.");
      return setUploadStatus(null);
    }

    setFile(uploadedFile);
    setUploadStatus(null);
    toast.success("تم اختيار الملف بنجاح!");
  }, []);

  /** ----------------------------------------------------
   *  Component UI
   ------------------------------------------------------*/
  const uploadBoxStyle = useMemo(
    () => ({
      border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
      borderRadius: 3,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.4)
        : alpha(theme.palette.primary.light, 0.02),
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        borderColor: alpha(theme.palette.primary.main, 0.6),
        backgroundColor: isDark
          ? alpha(theme.palette.background.paper, 0.6)
          : alpha(theme.palette.primary.light, 0.05),
        transform: "translateY(-2px)",
        boxShadow: theme.shadows[4],
      },
    }),
    [theme, isDark]
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 2 }}>
      {!filePreview ? (
        <Fade in timeout={600}>
          <Card elevation={0} sx={uploadBoxStyle}>
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              <input
                type="file"
                id="file-input"
                accept=".xlsx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 80,
                      color: theme.palette.primary.main,
                      opacity: 0.85,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.1)", opacity: 1 },
                    }}
                  />

                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    رفع ملف Excel
                  </Typography>

                  <Typography variant="body1" sx={{ maxWidth: 400, color: theme.palette.text.secondary }}>
                    اضغط لاختيار ملف أو اسحب الملف إلى هنا
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Chip label=".xlsx فقط" size="small" color="primary" variant="outlined" />
                    <Chip label="10 ميجابايت" size="small" color="secondary" variant="outlined" />
                  </Stack>
                </Box>
              </label>
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <Fade in timeout={600}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              {/* Header */}
              <Box sx={{ display: "flex", p: 3, gap: 2, alignItems: "center" }}>
                <img
                  src={excelImage}
                  alt="Excel File"
                  style={{ width: 80, borderRadius: 8, boxShadow: theme.shadows[1] }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", gap: 1 }}>
                    <DescriptionIcon color="primary" /> {file?.name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    الحجم: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>

                  {uploadStatus === "success" && (
                    <Chip icon={<CheckCircle />} label="تم استخراج البيانات" color="success" sx={{ mt: 1 }} />
                  )}
                  {uploadStatus === "error" && (
                    <Chip icon={<ErrorIcon />} label="خطأ في استخراج البيانات" color="error" sx={{ mt: 1 }} />
                  )}

                  {/* Buttons */}
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleFileExcelUpload}
                      disabled={isProcessing}
                      startIcon={!isProcessing && <ContentPasteGo />}
                    >
                      {isProcessing ? "جاري المعالجة..." : "استخراج البيانات"}
                    </Button>

                    <Button variant="outlined" href={filePreview} download={file.name} startIcon={<Download />}>
                      تحميل الملف
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {uploadStatus === "success" && (
                <Box sx={{ p: 2, textAlign: "center", backgroundColor: alpha(theme.palette.success.main, 0.1) }}>
                  <Typography sx={{ color: theme.palette.success.dark }}>
                    ✓ تم استخراج البيانات بنجاح
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      )}
    </Box>
  );
}
