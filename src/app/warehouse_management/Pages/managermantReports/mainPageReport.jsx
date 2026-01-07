import { useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";

import Assessment from "@mui/icons-material/Assessment";
import Settings from "@mui/icons-material/Settings";
import Analytics from "@mui/icons-material/Analytics";
import { useTranslation } from "react-i18next";
import InfoSelectionDialog from "./InfoSelectionDialog";
import { useReportLogic } from "../../../../hooks/useReportLogicWarhouse";
import {
  handleOpenInfoDialog,
  handleCloseInfoDialog,
  handleInfoCheckboxChange,
  handleToggleSection,
  handleApplySelections,
} from "../../../../utils/reportUtils/reportHandlers";
import {
  softColors,
  statisticDataBox,
  warehouseReports,
} from "../../../../constants/reportConstants";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import useDashboard from "../../../../hooks/useDashboard";
import {
  ImportExportBarChart,
  ImportExportPieChart,
  MonthlyQuantityChart,
} from "./components";
import { QuickStat, StatCard } from "../../../../style/reportStyle";


export default function MainPageReport() {
  const { t } = useTranslation();

  const {
    showInfoDialog,
    setShowInfoDialog,
    labData,
    factoryData,
    wareHouseData,
    selectedInfo,
    setSelectedInfo,
    expandedSections,
    setExpandedSections,
    dataUserById,
    applicationPermission,
    selectedReportType,
    setSelectedReportType,
  } = useReportLogic();

  const {
    statisticData,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectMonth,
    chartDocumentData,
    chartDataMaterialImport,
    chartDataMaterialExport,
  } = useDashboard();

  // Memoize callback handlers to prevent recreation on every render
  const onOpenInfoDialog = useCallback(
    () => handleOpenInfoDialog(setShowInfoDialog),
    [setShowInfoDialog]
  );
  const onCloseInfoDialog = useCallback(
    () => handleCloseInfoDialog(setShowInfoDialog),
    [setShowInfoDialog]
  );
  const onInfoCheckboxChange = useCallback(
    (category, itemId, itemlabel = null) =>
      handleInfoCheckboxChange(category, itemId, setSelectedInfo, itemlabel),
    [setSelectedInfo]
  );
  const onToggleSection = useCallback(
    (section) => handleToggleSection(section, setExpandedSections),
    [setExpandedSections]
  );
  const onApplySelections = useCallback(
    () => handleApplySelections(selectedInfo, setShowInfoDialog, dataUserById),
    [selectedInfo, setShowInfoDialog, dataUserById]
  );

  // Memoize chart data transformation to avoid recalculation on every render
  const transformedChartData = useMemo(() => {
    if (
      !chartDocumentData ||
      !chartDocumentData.data ||
      !Array.isArray(chartDocumentData.data)
    ) {
      return [];
    }
    const monthlyData = {};
    chartDocumentData.data.forEach((item) => {
      const monthKey = `${item.month}-${item.month_name}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: item.month_name || `Month ${item.month}`,
          monthNumber: item.month,
          inValue: 0,
          outValue: 0,
          inCount: 0,
          outCount: 0,
        };
      }

      const amount = parseFloat(item.total_amount) || 0;
      const count = parseInt(item.count) || 0;

      if (item.document_type === "in") {
        monthlyData[monthKey].inValue += amount;
        monthlyData[monthKey].inCount += count;
      } else if (item.document_type === "out") {
        monthlyData[monthKey].outValue += amount;
        monthlyData[monthKey].outCount += count;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.monthNumber - b.monthNumber)
      .map((item) => ({
        ...item,
        inValue: Math.round(item.inValue / 1000),
        outValue: Math.round(item.outValue / 1000),
        totalValue: Math.round((item.inValue + item.outValue) / 1000),
      }));
  }, [chartDocumentData]);

  // Memoize pie chart data preparation
  const pieChartData = useMemo(() => {
    if (
      !chartDocumentData ||
      !chartDocumentData.data ||
      !Array.isArray(chartDocumentData.data)
    ) {
      return [];
    }

    let totalIn = 0;
    let totalOut = 0;

    chartDocumentData.data.forEach((item) => {
      const amount = parseFloat(item.total_amount) || 0;
      if (item.document_type === "in") {
        totalIn += amount;
      } else if (item.document_type === "out") {
        totalOut += amount;
      }
    });

    return [
      {
        name: "الوارد",
        value: Math.round(totalIn / 1000),
        color: softColors.success,
        percentage:
          totalIn + totalOut > 0
            ? ((totalIn / (totalIn + totalOut)) * 100).toFixed(1)
            : 0,
      },
      {
        name: "الصادر",
        value: Math.round(totalOut / 1000),
        color: softColors.danger,
        percentage:
          totalIn + totalOut > 0
            ? ((totalOut / (totalIn + totalOut)) * 100).toFixed(1)
            : 0,
      },
    ];
  }, [chartDocumentData]);

  // Memoize statistic data box to avoid recreation
  const statsData = useMemo(
    () => statisticDataBox(statisticData),
    [statisticData]
  );

  // Memoize quick stats data
  const quickStats = useMemo(
    () => [
      {
        value: warehouseReports.length,
        label: "إجمالي التقارير المتاحة",
        color: softColors.primary,
      },
      {
        value: warehouseReports.filter((r) => r.category === "inventory")
          .length,
        label: "تقارير الجرد",
        color: softColors.secondary,
      },
      {
        value: warehouseReports.filter((r) => r.category === "operations")
          .length,
        label: "تقارير العمليات",
        color: softColors.info,
      },
      {
        value: warehouseReports.filter((r) => r.category === "alerts").length,
        label: "تقارير التنبيهات",
        color: softColors.danger,
      },
    ],
    []
  );

  // Memoize date handlers
  const handleYearChange = useCallback(
    (newValue) => setSelectedYear(newValue.year()),
    [setSelectedYear]
  );

  const handleMonthChange = useCallback(
    (newValue) => setSelectMonth(newValue.month()),
    [setSelectMonth]
  );

  return (
    <Box
      sx={{
        backgroundColor: softColors.background,
        minHeight: "100vh",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* العنوان الرئيسي والفلاتر في صف واحد */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: 3,
          backgroundColor: softColors.cardBg,
          borderRadius: 4,
          border: `1px solid ${softColors.primary}20`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${softColors.primary}, ${softColors.secondary})`,
          }}
        />

        <Grid container spacing={3} alignItems="center">
          {/* العنوان */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  backgroundColor: `${softColors.primary}10`,
                  color: softColors.primary,
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Assessment sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={softColors.neutral}
                >
                  {t("لوحة تحكم التقارير")}
                </Typography>
                <Typography
                  variant="body2"
                  color={softColors.neutral}
                  opacity={0.7}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  {t("إدارة شاملة لجميع تقارير المخزن")}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* الفلاتر */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <FormControl sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="السنة"
                    views={["year"]}
                    value={dayjs().year(selectedYear)}
                    onChange={handleYearChange}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: softColors.cardBg,
                          },
                        },
                      },
                    }}
                    openTo="year"
                  />
                </LocalizationProvider>
              </FormControl>

              <FormControl sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="الشهر"
                    views={["month"]}
                    value={dayjs().month(selectedMonth)}
                    onChange={handleMonthChange}
                    slotProps={{
                      textField: {
                        variant: "outlined",
                        size: "small",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: softColors.cardBg,
                          },
                        },
                      },
                    }}
                    openTo="month"
                  />
                </LocalizationProvider>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={onOpenInfoDialog}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "500",
                  px: 2.5,
                  borderColor: softColors.primary,
                  color: softColors.primary,
                  minWidth: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: `${softColors.primary}10`,
                    borderColor: softColors.primary,
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {t("اختيار المعلومات")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* بطاقات الإحصائيات */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statsData.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </Grid>

      {/* الرسوم البيانية الرئيسية */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12}>
          <ImportExportBarChart data={transformedChartData} />
        </Grid>
      </Grid>

      {/* مخططات الاستيراد والتصدير */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ImportExportPieChart data={pieChartData} />
        </Grid>

        {/* إحصائيات سريعة */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              p: 2.5,
              borderRadius: 3,
              backgroundColor: softColors.cardBg,
              border: `1px solid ${softColors.neutral}20`,
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: `${softColors.info}15`,
                }}
              >
                <Analytics sx={{ fontSize: 20, color: softColors.info }} />
              </Box>
              <Typography
                variant="h6"
                color={softColors.neutral}
                fontWeight="600"
              >
                {t("إحصائيات سريعة")}
              </Typography>
            </Box>

            <Divider sx={{ mb: 2.5, borderColor: `${softColors.neutral}20` }} />

            <Grid container spacing={3}>
              {quickStats.map((stat, index) => (
                <QuickStat key={index} stat={stat} />
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* مخطط الكميات الشهرية */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12}>
          <MonthlyQuantityChart
            data={transformedChartData}
            chartDataMaterialExport={chartDataMaterialExport}
            chartDataMaterialImport={chartDataMaterialImport}
          />
        </Grid>
      </Grid>

      <InfoSelectionDialog
        open={showInfoDialog}
        onClose={onCloseInfoDialog}
        selectedInfo={selectedInfo}
        onInfoCheckboxChange={onInfoCheckboxChange}
        expandedSections={expandedSections}
        onToggleSection={onToggleSection}
        onApplySelections={onApplySelections}
        wareHouseData={wareHouseData}
        labData={labData}
        factoryData={factoryData}
        warehouseReports={warehouseReports}
        applicationPermission={applicationPermission}
        selectedReportType={selectedReportType}
        setSelectedReportType={setSelectedReportType}
      />
    </Box>
  );
}
