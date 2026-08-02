import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getDataStateName } from "../../redux/StateMartrialState/stateMatrialAction";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useTheme} from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import FileDownload from "@mui/icons-material/FileDownload";
import CheckCircle from "@mui/icons-material/CheckCircle";
import TableChart from "@mui/icons-material/TableChart";

import { toast } from "react-toastify";
import { arrayDataInventory } from "../../constants/arrayFuction";
export default function ExcelTemplate({ dataUnitMeasuring }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const labels = arrayDataInventory;
  useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch]);

  const applyDataValidation = (cell, options, required = true) => {
    cell.dataValidation = {
      type: "list",
      allowBlank: !required,
      formulae: [`"${options.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid Selection",
      error: "Please select a value from the dropdown.",
      editable: false,
    };
  };
  const applyDecimalValidation = (cell) => {
    cell.dataValidation = {
      type: "decimal",
      operator: "greaterThanOrEqual",
      formulae: [0],
      showErrorMessage: true,
      errorTitle: "خطأ في الإدخال",
      error: "يرجى إدخال رقم صحيح أكبر من أو يساوي 0",
      allowBlank: true,
    };
  };

  const exportToExcel = async () => {
    setIsGenerating(true);
    setDownloadReady(false);
    
    const fileName = `templateExcel_${new Date().toISOString().split('T')[0]}.xlsx`;
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Template");
      
      // Add header row with modern styles
      worksheet.addRow(labels).eachCell((cell, colNumber) => {
        cell.font = { 
          bold: true, 
          color: { argb: "FFFFFFFF" },
          size: 12,
          name: "Segoe UI"
        };
        cell.alignment = { 
          horizontal: "center", 
          vertical: "middle",
          wrapText: true
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isDark ? "FF1976D2" : "FF2196F3" },
        };
        cell.border = {
          top: { style: "medium", color: { argb: "FF1565C0" } },
          left: { style: "medium", color: { argb: "FF1565C0" } },
          bottom: { style: "medium", color: { argb: "FF1565C0" } },
          right: { style: "medium", color: { argb: "FF1565C0" } },
        };
        worksheet.getColumn(colNumber).width = Math.max(labels[colNumber-1]?.length + 8, 18);
      });
      
      const dataUnitMeasuringOptions = dataUnitMeasuring?.map((item) =>
        item?.measuring_unit?.replace(/,/g, "")
      ) || ["No Data Available"];

      const stateMaterialOptions = stateMaterial?.map((item) =>
        item?.state_name?.replace(/,/g, "")
      ) || ["No Data Available"];

      const dropdownRange = 100;

      // Populate rows with data validation and formatting
      for (let i = 2; i <= dropdownRange; i++) {
        applyDataValidation(worksheet.getCell(`D${i}`), stateMaterialOptions);
        applyDataValidation(
          worksheet.getCell(`E${i}`),
          dataUnitMeasuringOptions,
          false
        );
        // Apply decimal validation to specific columns
        ["H"].forEach((col) => {
          const cell = worksheet.getCell(`${col}${i}`);
          applyDecimalValidation(cell);
        });
      }

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const excelData = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(excelData, fileName);
      
      setDownloadReady(true);
      toast.success("تم إنشاء وتحميل القالب بنجاح!");
      
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("حدث خطأ أثناء إنشاء القالب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  // const handelGetTemplateFileExcel = async () => {
  //   try {
  //     // Display a loading message or spinner
  //     console.log("Downloading template...");

  //     // Make the request to the backend API
  //     const response = await axios.get(
  //       `${BackendUrl}/api/getTemplateFileExcel`,
  //       {
  //         headers: {
  //           authorization: getToken(),
  //         },
  //         responseType: "blob", // Ensure the response is treated as a binary file
  //       }
  //     );

  //     // Create a blob from the response data
  //     const blob = new Blob([response?.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     // Create a download link
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = "templateExcel.xlsx"; // Name of the downloaded file
  //     document.body.appendChild(link);
  //     link.click();

  //     // Clean up the link element
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     // Optionally, provide feedback to the user
  //     console.log("Template downloaded successfully!");
  //   } catch (error) {
  //     console.error("Error downloading template:", error);

  //     // Optionally, display a user-friendly message
  //     // alert("Failed to download the template. Please try again.");
  //   }
  // };

  return (
    <Box sx={{ width: "100%", maxWidth: "700px", mx: "auto", p: 2 }}>
      <Fade in={true} timeout={800}>
        <Card 
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: isDark 
              ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: "relative",
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            <Box sx={{ mb: 4 }}>
              <Box 
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  mb: 3,
                  boxShadow: theme.shadows[8],
                  position: "relative",
                  '&::after': {
                    content: '""',
                    position: "absolute",
                    inset: "8px",
                    borderRadius: "50%",
                    background: alpha(theme.palette.common.white, 0.1),
                  }
                }}
              >
                <TableChart
                  sx={{
                    fontSize: 50,
                    color: "white",
                    zIndex: 1,
                  }}
                />
              </Box>
              
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                قالب Excel للمواد
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
                lineHeight: 1.8,
                maxWidth: "500px",
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              احصل على قالب Excel محترف ومُعد مسبقاً يحتوي على التنسيق الصحيح
              لإدخال بيانات المواد مع عينات توضيحية وقوائم منسدلة للاختيارات.
            </Typography>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={1} 
              justifyContent="center" 
              sx={{ mb: 4 }}
            >
              <Chip 
                icon={<DescriptionIcon />}
                label="تنسيق احترافي" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                icon={<CheckCircle />}
                label="قوائم منسدلة" 
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                label="حتى 100 مادة" 
                color="info" 
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Stack>

            <Button
              variant="contained"
              size="large"
              onClick={exportToExcel}
              disabled={isGenerating}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={20} color="inherit" />
                ) : downloadReady ? (
                  <CheckCircle />
                ) : (
                  <FileDownload />
                )
              }
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                minWidth: "200px",
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: theme.shadows[6],
                '&:hover': {
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: "translateY(-2px)",
                  boxShadow: theme.shadows[12],
                },
                '&:disabled': {
                  backgroundImage: "none",
                  transform: "none",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {isGenerating 
                ? "جاري الإنشاء..." 
                : downloadReady 
                ? "تم التحميل بنجاح" 
                : "تحميل قالب Excel"
              }
            </Button>

            {downloadReady && (
              <Fade in={downloadReady} timeout={500}>
                <Box 
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.success.dark,
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1
                    }}
                  >
                    <CheckCircle fontSize="small" />
                    تم تحميل القالب بنجاح! يمكنك الآن ملء البيانات ورفع الملف.
                  </Typography>
                </Box>
              </Fade>
            )}

            <Typography
              sx={{
                textAlign: "center",
                marginTop: 3,
                fontSize: "0.9rem",
                color: theme.palette.text.secondary,
                fontStyle: "italic",
              }}
            >
              إذا قمت بتنزيل القالب بالفعل، يرجى المتابعة إلى الخطوة التالية.
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
