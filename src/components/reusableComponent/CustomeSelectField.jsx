import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";

import { ContainerOfSelectField } from "./ThemDesign";
import CloseIcon from "@mui/icons-material/Close";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

function CustomeSelectField({
  label,
  error,
  message,
  value,
  onChange,
  onClearClick,
  readOnly,
  list,
  haswidth,
  customGetOptionLabel,
  multiple,
  margin,
  focused,
  renderOption,
  onSearch,
  limits,
  customHeight,
  customPadding,
  freeSolo,
  ...props
}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Fade in={true} timeout={500}>
      <ContainerOfSelectField
        theme={theme}
        customeWidth={props?.customWidth ? props?.customWidth : "100%"}
        isForm={true}
        haswidth={haswidth ? true : false}
        hasError={error}
        customHeight={customHeight}
        customPadding={customPadding}
      >
        <Box
          sx={{
            position: "relative",
            color: "dark",
            margin: margin ? margin : "none",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.8)" : "#fff",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            boxShadow:
              isFocused || isOpen
                ? theme.palette.mode === "dark"
                  ? "0 0 0 2px rgba(100, 181, 246, 0.5)"
                  : "0 0 0 2px rgba(25, 118, 210, 0.5)"
                : "none",
          }}
          className="orderdata"
        >
          <Autocomplete
            key={props?.key}
            id="combo-box-demo"
            options={list ? list : []}
            value={value}
            onChange={(e, newValue) => {
              onChange && onChange(e, newValue);
            }}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            onInputChange={(e, newInputValue, reason) => {
              
              // Handle typed input for freeSolo mode
              if (freeSolo && reason === 'input') {
                onChange && onChange(e, newInputValue);
              }
              // Call the original onSearch if provided
              onSearch && onSearch(e, newInputValue, reason);
            }}
            freeSolo={freeSolo}
            getOptionLabel={
              customGetOptionLabel
                ? (option) => {
                  // Handle both objects and primitive values
                  if (option === null || option === undefined) return "";
                  // Handle string values when freeSolo is enabled
                  if (typeof option === 'string') return option;
                  return customGetOptionLabel(option) || "";
                }
                : (option) => {
                  if (option === null || option === undefined) return "";
                  // Handle string values when freeSolo is enabled
                  if (typeof option === 'string') return option;
                  return option?.name || "";
                }
            }
            popupIcon={
              readOnly ? null : isOpen ? (
                <KeyboardArrowUp />
              ) : (
                <KeyboardArrowDown />
              )
            }
            aria-required={props?.required ? props.required : false}
            limitTags={limits && limits > 0 ? limits : -1}
            disabled={props?.disabled ? props.disabled : false}
            readOnly={readOnly}
            isOptionEqualToValue={(option, value) => {
              // Handle null or undefined values
              if (!option || !value) return option === value;

              // Handle string comparison for freeSolo
              if (typeof option === 'string' || typeof value === 'string') {
                return option === value;
              }

              // If they have IDs, compare by ID
              if (option.id && value.id) return option.id === value.id;
              if (option._id && value._id) return option._id === value._id;
              if (option.entities_id && value.entities_id)
                return option.entities_id === value.entities_id;

              // If they're objects, compare by reference
              return JSON.stringify(option) === JSON.stringify(value);
            }}
            InputProps={{
              readOnly: readOnly,
              required: props?.required ? props.required : false,
            }}
            multiple={multiple}
            renderOption={
              renderOption ||
              ((props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.primary
                        : theme.palette.text.primary,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  {typeof option === 'string'
                    ? option
                    : customGetOptionLabel
                      ? customGetOptionLabel(option)
                      : option.name || ""}
                </Box>
              ))
            }
            clearIcon={
              <Box
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  color: theme.palette.error.main,
                  opacity: 0.7,
                  "&:hover": {
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <CloseIcon
                  sx={{ fontSize: "20px" }}
                  onClick={() => onClearClick && onClearClick()}
                />
              </Box>
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <span>
                    {label}{" "}
                    {props?.required ? (
                      <span style={{ color: theme.palette.error.main }}>*</span>
                    ) : (
                      ""
                    )}
                  </span>
                }
                placeholder={props?.placeHolder ? props.placeHolder : ""}
                variant="filled"
                disabled={props?.disabled ? props.disabled : false}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                sx={{
                  width: "100%",
                  "& .MuiFilledInput-root": {
                    borderRadius: "8px",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.04)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.06)",
                    },
                    "&.Mui-focused": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[400]
                        : theme.palette.grey[700],
                    "&.Mui-focused": {
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                    },
                  },
                  "& .MuiFilledInput-input": {
                    padding: "12px 16px",
                  },
                  "& .MuiAutocomplete-endAdornment": {
                    right: "8px",
                  },
                }}
              />
            )}
            className={`${error ? "Mui-focused errors" : ""} ${focused ? "Mui-focused" : ""
              }`}
            sx={{
              "& .MuiAutocomplete-tag": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(100, 181, 246, 0.2)"
                    : "rgba(25, 118, 210, 0.1)",
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
                borderRadius: "16px",
                margin: "2px",
                padding: "0 8px",
                height: "24px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(100, 181, 246, 0.3)"
                      : "rgba(25, 118, 210, 0.2)",
                },
              },
            }}
          />
        </Box>
        {error && message?.length ? (
          <Fade in={true} timeout={300}>
            <Box
              sx={{
                height: "fit-content",
                padding: "5px",
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                width: "95%",
                mt: 1,
              }}
            >
              {message && message?.length > 0
                ? message?.map((messg, index) => (
                  <span
                    key={index}
                    style={{
                      fontFamily: "Cairo-Bold",
                      fontSize: "14px",
                      color: theme.palette.error.main,
                      height: "auto",
                      marginBottom: "2px",
                    }}
                  >
                    {messg}
                  </span>
                ))
                : null}
            </Box>
          </Fade>
        ) : null}
      </ContainerOfSelectField>
    </Fade>
  );
}

export default CustomeSelectField;
