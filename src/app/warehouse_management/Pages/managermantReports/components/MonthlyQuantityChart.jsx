import { useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import TrendingUp from "@mui/icons-material/TrendingUp";
import TrendingDown from "@mui/icons-material/TrendingDown";
import Inventory from "@mui/icons-material/Inventory";

import { softColors } from "../../../../../constants/reportConstants";

const MonthlyQuantityChart = ({
  chartDataMaterialExport,
  chartDataMaterialImport,
}) => {
  // Transform the import and export data into chart format
  const { importData, exportData, totals } = useMemo(() => {
    const parseQuantity = (quantity) => {
      if (quantity === null || quantity === undefined) return 0;
      const parsed = parseFloat(quantity);
      return isNaN(parsed) ? 0 : parsed;
    };

    const monthMap = {};

    // Process import data
    if (chartDataMaterialImport?.data && Array.isArray(chartDataMaterialImport.data)) {
      chartDataMaterialImport.data.forEach((item) => {
        if (item?.year && item?.month && item?.month_name) {
          const monthKey = `${item.month}-${item.month_name}`;

          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              month: item.month_name || `Month ${item.month}`,
              monthNumber: parseInt(item.month),
              inCount: 0,
              outCount: 0,
            };
          }

          monthMap[monthKey].inCount += parseQuantity(item.totalQuantity);
        }
      });
    }

    // Process export data
    if (chartDataMaterialExport?.data && Array.isArray(chartDataMaterialExport.data)) {
      chartDataMaterialExport.data.forEach((item) => {
        if (item?.year && item?.month && item?.month_name) {
          const monthKey = `${item.month}-${item.month_name}`;

          if (!monthMap[monthKey]) {
            monthMap[monthKey] = {
              month: item.month_name || `Month ${item.month}`,
              monthNumber: parseInt(item.month),
              inCount: 0,
              outCount: 0,
            };
          }

          monthMap[monthKey].outCount += parseQuantity(item.totalQuantity);
        }
      });
    }

    const sortedData = Object.values(monthMap).sort((a, b) => a.monthNumber - b.monthNumber);

    const importChartData = sortedData.map(item => ({
      month: item.month,
      value: item.inCount
    }));

    const exportChartData = sortedData.map(item => ({
      month: item.month,
      value: item.outCount
    }));

    const totalImport = sortedData.reduce((sum, item) => sum + item.inCount, 0);
    const totalExport = sortedData.reduce((sum, item) => sum + item.outCount, 0);
    const netBalance = totalImport - totalExport;

    return {
      importData: importChartData,
      exportData: exportChartData,
      totals: { totalImport, totalExport, netBalance }
    };
  }, [chartDataMaterialImport, chartDataMaterialExport]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: softColors.cardBg,
            border: `1px solid ${softColors.neutral}20`,
            borderRadius: 2,
            p: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: type === 'import' ? softColors.success : softColors.danger }}
          >
            {type === 'import' ? 'الوارد' : 'الصادر'}: {payload[0].value.toLocaleString()} قطعة
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              backgroundColor: `${softColors.success}10`,
              border: `2px solid ${softColors.success}30`,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: softColors.success,
                }}
              >
                <TrendingUp sx={{ fontSize: 28, color: "#fff" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" color={softColors.success}>
                  {totals.totalImport.toLocaleString()}
                </Typography>
                <Typography variant="body2" color={softColors.neutral}>
                  إجمالي الوارد
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              backgroundColor: `${softColors.danger}10`,
              border: `2px solid ${softColors.danger}30`,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: softColors.danger,
                }}
              >
                <TrendingDown sx={{ fontSize: 28, color: "#fff" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" color={softColors.danger}>
                  {totals.totalExport.toLocaleString()}
                </Typography>
                <Typography variant="body2" color={softColors.neutral}>
                  إجمالي الصادر
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              backgroundColor: `${softColors.info}10`,
              border: `2px solid ${softColors.info}30`,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: softColors.info,
                }}
              >
                <Inventory sx={{ fontSize: 28, color: "#fff" }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="700" color={softColors.info}>
                  {totals.netBalance.toLocaleString()}
                </Typography>
                <Typography variant="body2" color={softColors.neutral}>
                  الصرف الداخلي 
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Separated Charts */}
      <Grid container spacing={3}>
        {/* Import Chart */}
        <Grid size={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              backgroundColor: softColors.cardBg,
              border: `2px solid ${softColors.success}30`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: `${softColors.success}15`,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 24, color: softColors.success }} />
                </Box>
                <Typography variant="h6" fontWeight="600" color={softColors.neutral}>
                  الكميات الواردة شهرياً
                </Typography>
              </Box>

              {importData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={importData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={`${softColors.neutral}20`} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: softColors.neutral, fontSize: 12 }}
                      axisLine={{ stroke: `${softColors.neutral}30` }}
                    />
                    <YAxis
                      tick={{ fill: softColors.neutral, fontSize: 12 }}
                      axisLine={{ stroke: `${softColors.neutral}30` }}
                    />
                    <Tooltip content={<CustomTooltip type="import" />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {importData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={softColors.success} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${softColors.neutral}05`,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color={softColors.neutral}>
                    لا توجد بيانات وارد
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Export Chart */}
        <Grid size={12} md={6}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              backgroundColor: softColors.cardBg,
              border: `2px solid ${softColors.danger}30`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: `${softColors.danger}15`,
                  }}
                >
                  <TrendingDown sx={{ fontSize: 24, color: softColors.danger }} />
                </Box>
                <Typography variant="h6" fontWeight="600" color={softColors.neutral}>
                  الكميات الصادرة شهرياً
                </Typography>
              </Box>

              {exportData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={`${softColors.neutral}20`} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: softColors.neutral, fontSize: 12 }}
                      axisLine={{ stroke: `${softColors.neutral}30` }}
                    />
                    <YAxis
                      tick={{ fill: softColors.neutral, fontSize: 12 }}
                      axisLine={{ stroke: `${softColors.neutral}30` }}
                    />
                    <Tooltip content={<CustomTooltip type="export" />} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {exportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={softColors.danger} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${softColors.neutral}05`,
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color={softColors.neutral}>
                    لا توجد بيانات صادر
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonthlyQuantityChart;