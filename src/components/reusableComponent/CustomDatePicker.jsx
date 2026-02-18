import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";

export default function CustomDatePicker({
  value,
  setValue,
  label,
  is_dateTime,
  format,
  placeholder,
  textError,
  error,
  is_Time,
  minDate,
  maxDate,
  customWidth,
  ...props
}) {
  const theme = useTheme();

  // Common TextField props — outlined to match MUI TextField default
  const textFieldProps = {
    variant: "outlined",
    error: error,
    helperText: textError,
    required: props?.required || false,
    placeholder: placeholder,
    fullWidth: true,
    sx: {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        borderRadius: 1,
      },
    },
  };

  return (
    <Box sx={{ position: "relative", width: customWidth || "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {is_dateTime && !is_Time ? (
          <DateTimePicker
            label={label}
            format={format || "YYYY/MM/DD HH:mm:ss"}
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(date) => setValue(date)}
            slotProps={{ textField: textFieldProps }}
          />
        ) : !is_Time ? (
          props?.is_year ? (
            <DatePicker
              views={["year"]}
              openTo="year"
              label={label}
              format={format || "YYYY"}
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => setValue(date)}
              readOnly={props?.readOnly}
              slotProps={{ textField: textFieldProps }}
            />
          ) : (
            <DatePicker
              label={label}
              format={format || "YYYY/MM/DD"}
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => setValue(date)}
              readOnly={props?.readOnly}
              slotProps={{ textField: textFieldProps }}
            />
          )
        ) : (
          <TimePicker
            label={label}
            format={format || "HH:mm:ss"}
            value={value}
            minTime={minDate}
            maxTime={maxDate}
            onChange={(date) => setValue(date)}
            slotProps={{ textField: textFieldProps }}
          />
        )}

        {/* زر مسح التاريخ */}
        {value && !props?.readOnly && (
          <CloseIcon
            onClick={() => setValue(null)}
            sx={{
              position: "absolute",
              right: "42px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              zIndex: 1,
              fontSize: "18px",
              color: "text.secondary",
              "&:hover": { color: "error.main" },
            }}
          />
        )}
      </LocalizationProvider>
    </Box>
  );
}
