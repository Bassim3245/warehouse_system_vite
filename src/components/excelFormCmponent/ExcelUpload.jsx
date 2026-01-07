import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentPasteGo from "@mui/icons-material/ContentPasteGo";
import Download from "@mui/icons-material/Download";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DescriptionIcon from "@mui/icons-material/Description";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import ExcelJS from "exceljs";
import excelImage from "../../assets/image/pngwing.com.png";
import { toast } from "react-toastify";
import { arrayDataInventory } from "../../constants/arrayFuction";
export default function ExcelUpload({ setDataFileExcel }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Expected header structure
  const expectedHeaders = arrayDataInventory;
  // Handle file upload and data extraction
  const handleFileExcelUpload = async () => {
    if (!file) {
      toast.warning("يرجى اختيار ملف قبل التحميل.");
      return;
    }

    setIsProcessing(true);
    setUploadStatus(null);

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        throw new Error("ملف الإكسل لا يحتوي على أي أوراق عمل.");
      }

      // Validate header row
      const headerRow = worksheet.getRow(1).values.slice(1);
      const isValidHeaders = expectedHeaders.every(
        (header, i) => headerRow[i]?.trim() === header
      );

      // Extract and validate data
      const extractedData = [];
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          const rowData = {
            code: row.getCell(1).text?.trim() || null,
            materialName: row.getCell(2).text?.trim() || null,
            origin: row.getCell(3).text?.trim() || null,
            materialStatus: row.getCell(4).text?.trim() || null,
            unitMeasuring: row.getCell(5).text?.trim() || null,
            specification: row.getCell(6).text?.trim() || null,
            minimum_stock_level: row.getCell(7).text?.trim() || null,
          };

          const hasValue = Object.values(rowData).some(
            (value) => value !== null && value !== "" && value !== "yyyy-mm-dd"
          );

          if (hasValue) {
            extractedData.push(rowData);
          }
        }
      });

      setDataFileExcel(extractedData);
      setUploadStatus('success');
      toast.success(`تم رفع الملف بنجاح! تم استخراج ${extractedData.length} عنصر.`);
    } catch (error) {
      console.error("خطأ في معالجة ملف الإكسل:", error.message);
      setUploadStatus('error');
      toast.error(
        error.message || "حدث خطأ أثناء معالجة الملف. تأكد من أن الملف صالح ويتوافق مع التنسيق المطلوب."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (fileExtension !== "xlsx") {
        toast.error("تنسيق الملف غير صحيح. يُسمح فقط بملفات .xlsx");
        setFile(null);
        setFilePreview(null);
        setUploadStatus(null);
        return;
      }

      if (uploadedFile.size > maxSize) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى المسموح 10 ميجابايت.");
        setFile(null);
        setFilePreview(null);
        setUploadStatus(null);
        return;
      }

      setFile(uploadedFile);
      setFilePreview(URL.createObjectURL(uploadedFile));
      setUploadStatus(null);
      toast.success("تم اختيار الملف بنجاح!");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 2 }}>
      {!filePreview ? (
        <Fade in={true} timeout={600}>
          <Card
            elevation={0}
            sx={{
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              borderRadius: 3,
              backgroundColor: isDark
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.primary.light, 0.02),
              transition: "all 0.3s ease",
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.6),
                backgroundColor: isDark
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.primary.light, 0.05),
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              }
            }}
          >
            <CardContent sx={{ p: 6, textAlign: "center" }}>
              <input
                type="file"
                id="fileUploadInput"
                accept=".xlsx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <label htmlFor="fileUploadInput" style={{ cursor: "pointer", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <CloudUploadIcon
                    sx={{
                      fontSize: 80,
                      color: theme.palette.primary.main,
                      opacity: 0.8,
                      transition: "all 0.3s ease",
                      '&:hover': {
                        transform: "scale(1.1)",
                        opacity: 1,
                      }
                    }}
                  />

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                      mb: 1
                    }}
                  >
                    رفع ملف Excel
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      maxWidth: "400px",
                      lineHeight: 1.6
                    }}
                  >
                    اضغط هنا لاختيار ملف Excel أو اسحب الملف إلى هذه المنطقة
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip
                      label=".xlsx فقط"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label="حد أقصى 10 ميجابايت"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label="100 منتج كحد أقصى"
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              </label>
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <Fade in={true} timeout={600}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 3,
                  backgroundColor: isDark
                    ? alpha(theme.palette.background.default, 0.5)
                    : alpha(theme.palette.grey[50], 0.8),
                }}
              >
                <Box sx={{ mr: 3 }}>
                  <img
                    src={excelImage}
                    alt="Excel File"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      boxShadow: theme.shadows[2]
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <DescriptionIcon color="primary" />
                    {file.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 2
                    }}
                  >
                    حجم الملف: {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
                  </Typography>

                  {uploadStatus && (
                    <Box sx={{ mb: 2 }}>
                      {uploadStatus === 'success' ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="تم استخراج البيانات بنجاح"
                          color="success"
                          variant="filled"
                        />
                      ) : (
                        <Chip
                          icon={<ErrorIcon />}
                          label="فشل في استخراج البيانات"
                          color="error"
                          variant="filled"
                        />
                      )}
                    </Box>
                  )}

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleFileExcelUpload}
                      disabled={isProcessing}
                      startIcon={isProcessing ? null : <ContentPasteGo />}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        '&:hover': {
                          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                          transform: "translateY(-1px)",
                          boxShadow: theme.shadows[4],
                        },
                        '&:disabled': {
                          backgroundImage: "none",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isProcessing ? "جاري المعالجة..." : "استخراج البيانات"}
                    </Button>

                    <Button
                      variant="outlined"
                      href={filePreview}
                      download={file.name}
                      startIcon={<Download />}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        border: `2px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          transform: "translateY(-1px)",
                          boxShadow: theme.shadows[2],
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      تحميل الملف
                    </Button>
                  </Stack>
                </Box>
              </Box>

              {uploadStatus === 'success' && (
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderTop: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.success.dark,
                      fontWeight: 500,
                      textAlign: "center"
                    }}
                  >
                    ✅ تم استخراج البيانات بنجاح! يمكنك الآن الانتقال إلى الخطوة التالية لمراجعة البيانات.
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
