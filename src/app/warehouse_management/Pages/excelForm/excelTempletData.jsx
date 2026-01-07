import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import FileDownload from "@mui/icons-material/FileDownload";
import CheckCircle from "@mui/icons-material/CheckCircle";
import TableChart from "@mui/icons-material/TableChart";
import DescriptionIcon from "@mui/icons-material/Description";

import { toast } from "react-toastify";
import { arrayDataInventory } from "../../../../constants/arrayFuction";

export default function ExcelTemplate({ dataUnitMeasuring }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /** ---------------------------------------
   *  MEMOIZED LABELS & OPTIONS
   ----------------------------------------*/
  const labels = useMemo(() => arrayDataInventory, []);

  const dataUnitMeasuringOptions = useMemo(
    () =>
      dataUnitMeasuring?.map((item) =>
        item?.measuring_unit?.replace(/,/g, "")
      ) || ["No Data Available"],
    [dataUnitMeasuring]
  );

  /** ---------------------------------------
   *  VALIDATION HELPERS (MEMOIZED)
   ----------------------------------------*/
  const applyDataValidation = useCallback((cell, options, required = true) => {
    cell.dataValidation = {
      type: "list",
      allowBlank: !required,
      formulae: [`"${options.join(",")}"`],
      showErrorMessage: true,
      errorTitle: "Invalid Selection",
      error: "Please select a value from the dropdown.",
      editable: false,
    };
  }, []);

  const applyDecimalValidation = useCallback((cell) => {
    cell.dataValidation = {
      type: "decimal",
      operator: "greaterThanOrEqual",
      formulae: [0],
      showErrorMessage: true,
      errorTitle: "خطأ في الإدخال",
      error: "يرجى إدخال رقم صحيح أكبر من أو يساوي 0",
      allowBlank: true,
    };
  }, []);

  /** ---------------------------------------
   *  EXPORT FUNCTION (FULLY OPTIMIZED)
   ----------------------------------------*/
  const exportToExcel = useCallback(async () => {
    setIsGenerating(true);
    setDownloadReady(false);

    const fileName = `templateExcel_${new Date().toISOString().split("T")[0]
      }.xlsx`;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Template");

      /** --------------------
       * HEADER ROW
       ---------------------*/
      worksheet.addRow(labels).eachCell((cell, colNumber) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 12,
          name: "Segoe UI",
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
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
        worksheet.getColumn(colNumber).width = Math.max(
          labels[colNumber - 1]?.length + 8,
          18
        );
      });

      /** --------------------
       * BODY VALIDATION (FAST LOOP)
       ---------------------*/
      const dropdownRange = 1000;
      for (let i = 2; i <= dropdownRange; i++) {
        applyDataValidation(
          worksheet.getCell(`D${i}`),
          dataUnitMeasuringOptions
        );
        applyDecimalValidation(worksheet.getCell(`I${i}`));
        applyDecimalValidation(worksheet.getCell(`G${i}`));

      }

      /** --------------------
       * EXPORT FILE
       ---------------------*/
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        fileName
      );

      setDownloadReady(true);
      toast.success("تم إنشاء وتحميل القالب بنجاح!");
    } catch (error) {
      console.error("Excel Error:", error);
      toast.error("حدث خطأ أثناء إنشاء القالب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  }, [
    labels,
    dataUnitMeasuringOptions,
    applyDataValidation,
    applyDecimalValidation,
    isDark,
  ]);

  /** ---------------------------------------
   *  UI COMPONENT
   ----------------------------------------*/
  return (
    <Box sx={{ width: "100%", maxWidth: 700, mx: "auto", p: 2 }}>
      <Fade in timeout={800}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: isDark
              ? `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.9
              )} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
              : `linear-gradient(135deg, ${alpha(
                theme.palette.primary.light,
                0.05
              )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            {/* ICON + TITLE */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  mb: 3,
                  boxShadow: theme.shadows[8],
                  position: "relative",
                }}
              >
                <TableChart sx={{ fontSize: 50, color: "white", zIndex: 1 }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
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
                maxWidth: 500,
                mx: "auto",
                fontSize: "1.1rem",
              }}
            >
              احصل على قالب Excel محترف ومُعد مسبقاً يحتوي على التنسيق الصحيح
              لإدخال بيانات المواد مع قوائم منسدلة وتحقق تلقائي للأرقام.
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
              />
              <Chip
                icon={<CheckCircle />}
                label="قوائم منسدلة"
                color="success"
                variant="outlined"
              />
              <Chip label="حتى 100 مادة" color="info" variant="outlined" />
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
                minWidth: 200,
                textTransform: "none",
              }}
            >
              {isGenerating
                ? "جاري الإنشاء..."
                : downloadReady
                  ? "تم التحميل بنجاح"
                  : "تحميل قالب Excel"}
            </Button>

            {downloadReady && (
              <Fade in timeout={500}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 2,
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
                      gap: 1,
                    }}
                  >
                    <CheckCircle fontSize="small" />
                    تم تحميل القالب بنجاح! يمكنك الآن ملء البيانات ورفع الملف.
                  </Typography>
                </Box>
              </Fade>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
