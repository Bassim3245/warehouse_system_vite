import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Assessment from "@mui/icons-material/Assessment";
import { softColors } from "../../../../../constants/reportConstants";

const ImportExportPieChart = ({ data, title = "نسبة الوارد والصادر" }) => {
  const COLORS = [softColors.success, softColors.danger ,softColors.warning];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
            {data.payload.name}
          </Typography>
          <Typography variant="body2" sx={{ color: data.payload.fill }}>
            {`القيمة: ${data.payload.value.toLocaleString()} ألف IQD`}
          </Typography>
          <Typography variant="body2" sx={{ color: data.payload.fill }}>
            {`النسبة: ${data.payload.percentage}%`}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom label function
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Assessment sx={{ color: softColors.primary, mr: 2 }} />
          <Typography variant="h6" fontWeight="600" color={softColors.neutral}>
            {title}
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry) => (
                <span style={{ color: entry?.color, fontWeight: "600" }}>
                  {entry?.payload?.name}
                </span>
              )}
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ImportExportPieChart;
