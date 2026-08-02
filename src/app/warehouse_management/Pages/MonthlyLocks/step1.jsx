
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
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
  <Box sx={{ p: 1.5 }} dir="rtl">

    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.5 }}>
      <DateRangeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
      <Typography variant="subtitle1" fontWeight={500}>
        اختر المخزن والفترة
      </Typography>
    </Stack>

    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
      <Grid container spacing={1.5}>

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
                label="المخزن"
                placeholder="اختر المخزن..."
                size="small"
                required
              />
            )}
            renderOption={(props, option) => (
              <Box
                key={option.id}
                component="li"
                {...props}
                sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.75, px: 1 }}
              >
                <Warehouse size={14} style={{ color: '#1976d2', flexShrink: 0 }} />
                <Typography variant="body2">{option.name}</Typography>
              </Box>
            )}
            noOptionsText="لا توجد مخازن"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DatePicker
            label="السنة"
            views={["year"]}
            value={dayjs().year(selectedYear)}
            onChange={(v) => v && setSelectedYear(v.year())}
            slotProps={{ textField: { fullWidth: true, size: "small" } }}
            format="YYYY"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="الشهر"
            value={selectedMonth}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= 12) setSelectedMonth(v);
            }}
            inputProps={{ min: 1, max: 12 }}
            size="small"
            helperText="1 – 12"
          />
        </Grid>

      </Grid>
    </LocalizationProvider>

    {/* Preview */}
    <Box sx={{
      mt: 1.5, px: 1.5, py: 1,
      border: '0.5px solid', borderColor: 'primary.200',
      borderRadius: 1, bgcolor: 'primary.50'
    }}>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Warehouse size={13} color="#1976d2" />
          <Typography variant="caption" color="primary.main" fontWeight={500}>
            {selectedWarehouse?.name || "لم يتم الاختيار"}
          </Typography>
        </Stack>
        <Typography variant="caption" color="primary.200">|</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <DateRangeIcon sx={{ fontSize: 13, color: 'primary.main' }} />
          <Typography variant="caption" color="primary.main" fontWeight={500}>
            {getPeriodText()}
          </Typography>
        </Stack>
      </Stack>
    </Box>

  </Box>
);

export default Step1Content;