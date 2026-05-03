import { Box, Stack, Autocomplete, TextField, Grid, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import DateRangeIcon from '@mui/icons-material/DateRange';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Warehouse } from "lucide-react";

const Step1Content = ({ 
  selectedYear, 
  setSelectedYear, 
  selectedMonth, 
  setSelectedMonth, 
  getPeriodText,
  selectedWarehouse,
  handleWarehouseChange,
  memoWarehouseOptions
}) => (
  <Box sx={{ p: 2 }} dir="rtl">
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
      <DateRangeIcon color="primary" />
      <Typography variant="h6" color="text.primary">
        اختر المخزن والفترة الزمنية
      </Typography>
    </Stack>

    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
      <Grid container spacing={3}>
        {/* Warehouse Selection */}
        <Grid size={{ xs: 12 }}>
          <Autocomplete
            fullWidth
            options={memoWarehouseOptions}
            getOptionLabel={(option) => option?.name || ""}
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="اختر المخزن"
                placeholder="اختر المخزن المستهدف..."
                size="small"
                required
              />
            )}
            renderOption={(props, option) => (
                <Box
                    key={option.id}
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                >
                    <Warehouse size={18} style={{ color: '#1976d2' }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {option.name}
                        </Typography>
                    </Box>
                </Box>
            )}
            noOptionsText="لا توجد مخازن"
          />
        </Grid>

        {/* Period Selection */}
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
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Stack direction="row" spacing={1} alignItems="center">
            <Warehouse size={20} color="#1976d2" />
            <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                المخزن: {selectedWarehouse?.name || "لم يتم الاختيار"}
            </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
            <DateRangeIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                الفترة: {getPeriodText()}
            </Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        اضغط "عرض السجلات" للمتابعة
      </Typography>
    </Paper>
  </Box>
);

export default Step1Content;

