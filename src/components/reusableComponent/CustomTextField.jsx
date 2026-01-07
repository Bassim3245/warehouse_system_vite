import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import { ContainerOfInputFields } from "./ThemDesign";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useState } from "react";

function CustomTextField({
  label,
  error,
  message,
  value,
  onChange,
  onClearClick,
  readOnly,
  type,
  haswidth,
  hasMultipleLine,
  customWidth,
  customePadding,
  focused,
  paddingHorizontal,
  inputPropStyle,
  errorMessage,
  disable,
  customHeight,
  hasePassswordEye,
  maxHeight,
  margin,
  ...props
}) {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const inputRef = React.useRef(null);
  const [showPassword, setShowPassword] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const theme = useTheme();

  console.log("theme", theme);
  return (
    <Fade in={true} timeout={500}>
      <ContainerOfInputFields
        mainTheme={maintheme}
        customeWidth={customWidth ? customWidth : "100%"}
        isForm={true}
        haswidth={haswidth ? true : false}
        hasMultiLine={hasMultipleLine ? true : false}
        paddingHorizontal={paddingHorizontal}
        customHeight={customHeight}
        maxHeight={maxHeight}
        margin={margin}
        CustomFontSize={props?.CustomFontSize}
      >
        <Box
          sx={{
            position: "relative",
            margin: margin ? margin : "none",
            width: "100%",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.8)" : "#fff",
            padding: customePadding ? customePadding : "auto",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            boxShadow: isFocused
              ? theme.palette.mode === "dark"
                ? "0 0 0 2px rgba(100, 181, 246, 0.5)"
                : "0 0 0 2px rgba(25, 118, 210, 0.5)"
              : "none",
          }}
          className="orderdata"
        >
          <TextField
            placeholder={props?.placeHolder ? props?.placeHolder : ""}
            variant="filled"
            label={label}
            value={value}
            onChange={(e) => onChange && onChange(e)}
            type={type ? (showPassword ? "text" : type) : "text"}
            focused={focused ? focused : true}
            ref={inputRef}
            error={!!error} // Ensure the error prop is a boolean
            helperText={errorMessage}
            autoComplete="new-password"
            multiline={hasMultipleLine ? true : false}
            onKeyDown={props?.onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            InputProps={{
              readOnly: readOnly,
              inputProps: {
                ...(props?.minNumber ? { min: props?.minNumber } : {}),
              },
              startAdornment: value && !readOnly && (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      mr: 1,
                      color: theme.palette.error.main,
                      opacity: 0.7,
                      "&:hover": {
                        opacity: 1,
                        transform: "scale(1.1)",
                      },
                    }}
                    onClick={() => onClearClick && onClearClick()}
                  >
                    <CloseIcon />
                  </Box>
                </InputAdornment>
              ),
              endAdornment: hasePassswordEye && value && (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      color: theme.palette.mode === "dark"
                        ? theme.palette.primary.light
                        : theme.palette.primary.main,
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {!showPassword ? (
                      <VisibilityIcon
                        onClick={() => setShowPassword(true)}
                      />
                    ) : (
                      <VisibilityOffIcon
                        onClick={() => setShowPassword(false)}
                      />
                    )}
                  </Box>
                </InputAdornment>
              ),
            }}
            required={props?.required ? props.required : false}
            disabled={disable}
            inputProps={{
              min: 0,
              style: {
                ...inputPropStyle,
              },
            }}
            sx={{
              width: "100%",
              "& .MuiFilledInput-root": {
                borderRadius: "8px",
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                },
                "&.Mui-focused": {
                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[700],
                "&.Mui-focused": {
                  color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.main,
                },
              },
              "& .MuiFilledInput-input": {
                padding: "12px 16px",
              },
            }}
            className={`${error ? "errors" : ""}`}
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
                      fontSize: props?.CustomFontSize
                        ? props?.CustomFontSize
                        : "14px",
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
      </ContainerOfInputFields>
    </Fade>
  );
}

export default CustomTextField;
