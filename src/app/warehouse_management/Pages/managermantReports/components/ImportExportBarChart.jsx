import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Analytics } from '@mui/icons-material';
import { softColors } from '../../../../../constants/reportConstants';

const ImportExportBarChart = ({ data, title = "القيمة الشهرية للوارد والصادر (بالآلاف IQD)" }) => {
  console.log("data", data)

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    console.log("payload", payload)
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
            {`الشهر: ${label}`}
          </Typography>
          {payload?.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ color: entry?.color, mb: 0.5 }}
            >
              {`${entry?.name}: ${entry?.value.toLocaleString()} ألف IQD`}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Analytics sx={{ color: softColors.primary, mr: 2 }} />
          <Typography
            variant="h6"
            fontWeight="600"
            color={softColors.neutral}
          >
            {title}
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: softColors.neutral }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12, fill: softColors.neutral }}
              label={{
                value: 'القيمة (بالآلاف IQD)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: softColors.neutral }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => {
                if (value === 'inValue') return 'الوارد';
                if (value === 'outValue') return 'الصادر';
                if (value === 'internalValue') return 'الصرف الداخلي';
                return value;
              }}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar
              dataKey="inValue"
              fill={softColors.success}
              name="الوارد"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="outValue"
              fill={softColors.danger}
              name="الصادر"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="internalValue"
              fill={softColors.warning}
              name="الصرف الداخلي"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ImportExportBarChart;