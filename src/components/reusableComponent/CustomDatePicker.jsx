import { ContainerOfInputFields } from "./ThemDesign";
import { Box, TextField, useTheme } from "@mui/material";
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
  is_years,
  is_Time,
  minDate,
  maxDate,
  customWidth,
  paddingHorizontal,
  borderPosition = "left",
  borderColor,
  ...props
}) {
  const theme = useTheme();
  const borderStyle =
    borderPosition === "left"
      ? `5px solid ${borderColor || theme.palette.primary.main} !important`
      : borderPosition === "right"
        ? `5px solid ${borderColor || theme.palette.primary.main} !important`
        : "none";

  const isDark = theme?.palette?.mode === "dark";

  // Common TextField props
  const textFieldProps = {
    variant: "filled",
    focused: true,
    error: error,
    helperText: textError,
    required: props?.required || false,
    placeholder: placeholder || "not specified yet",
    sx: {
      width: "100%",
      "& .MuiFilledInput-root": {
        borderLeft: borderPosition === "left" ? borderStyle : "none",
        borderRight: borderPosition === "right" ? borderStyle : "none",
        borderRadius: 0,
      },
    },
  };

  return (
    <ContainerOfInputFields
      mainTheme={theme.palette.primary.main}
      customeWidth={customWidth ? customWidth : "100%"}
      hasError={error}
      haswidth={true}
      isForm={true}
      paddingHorizontal={paddingHorizontal}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          backgroundColor: isDark
            ? theme.palette.backgroundColorTheme?.backgroundColorDark
            : theme.palette.backgroundColorTheme?.backgroundColorLight,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {is_dateTime && !is_Time ? (
            <DateTimePicker
              label={label}
              format={format || "YYYY/MM/DD HH:mm:ss"}
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onChange={(date) => setValue(date)}
              slotProps={{
                textField: textFieldProps,
              }}
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
                slotProps={{
                  textField: textFieldProps,
                }}
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
                slotProps={{
                  textField: textFieldProps,
                }}
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
              slotProps={{
                textField: textFieldProps,
              }}
            />
          )}
          {value && !props?.readOnly ? (
            <CloseIcon
              className="closeIcon"
              onClick={() => setValue(null)}
              sx={{
                right: "37px !important",
                top: "14px !important",
                cursor: "pointer",
                position: "absolute",
                zIndex: 1,
              }}
            />
          ) : null}
        </LocalizationProvider>
      </Box>
    </ContainerOfInputFields>
  );
}
