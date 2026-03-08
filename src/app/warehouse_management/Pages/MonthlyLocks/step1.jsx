import { Box, Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { TextField } from "@mui/material";
import { Paper } from "@mui/material";
import dayjs from "dayjs";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Step1Content = ({ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth, getPeriodText }) => (
  <Box sx={{ p: 2 }} dir="rtl">
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <DateRangeIcon color="primary" />
      <Typography variant="h6" color="text.primary">
        اختر الفترة الزمنية للأرشفة
      </Typography>
    </Stack>

    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label="اختر السنة"
            views={["year"]}
            value={dayjs().year(selectedYear)}
            onChange={(newValue) => {
              if (newValue) {
                setSelectedYear(newValue.year());
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: "small",
              },
            }}
            format="YYYY"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="اختر الشهر (1-12)"
            value={selectedMonth}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= 1 && value <= 12) {
                setSelectedMonth(value);
              }
            }}
            inputProps={{ min: 1, max: 12 }}
            size="small"
            helperText="أدخل رقم الشهر من 1 إلى 12"
          />
        </Grid>
      </Grid>
    </LocalizationProvider>

    {/* Selected Period Preview */}
    <Paper
      variant="outlined"
      sx={{
        mt: 3,
        p: 2,
        bgcolor: "primary.50",
        borderColor: "primary.200",
        textAlign: "center",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <DateRangeIcon color="primary" />
        <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
          الفترة المحددة: {getPeriodText()}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        اضغط "التالي" لعرض السجلات لهذه الفترة
      </Typography>
    </Paper>
  </Box>
);

export default Step1Content;
