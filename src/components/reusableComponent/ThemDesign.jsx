import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

// ===========================================
// Base Input Container Component
// ===========================================
export const ContainerOfInput = styled(Box)(
  ({ theme, mainTheme, customeWidth }) => ({
    // Container Layout
    width: customeWidth || "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "30px auto",

    // Container Shadow
    boxShadow: "0px 12px 40px #00000014 !important",

    // TextField Root Styles
    "& .MuiTextField-root, & .MuiTextField-root .MuiFilledInput-root": {
      height: "60px !important",
      background: `${theme.palette.mode === "dark" ? "#121212" : "#FFFFFF"
        } 0% 0% no-repeat padding-box !important`,
      boxShadow: "0px 12px 40px #00000014 !important",
      opacity: "1 !important",
    },

    // Remove Default Borders
    "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
      border: "none !important",
      outline: "none !important",
    },

    // Focus State - Left Border
    "& .MuiFilledInput-root.Mui-focused:before": {
      top: 0,
      left: 0,
      bottom: 0,
      width: "5px !important",
      height: "100% !important",
      background: mainTheme?.secondaryColor,
      overflow: "hidden",
      transition: "all 0.9s ease",
    },

    // Label Styles
    "& .MuiTextField-root .MuiFormLabel-root": {
      textAlign: "left",
      font: "normal normal normal 15.5px/26px Cairo",
      letterSpacing: "0.7px",
      color: mainTheme?.primaryColor,
      opacity: "0.95",
    },

    // Input Text Styles
    "& .MuiTextField-root .MuiFilledInput-input": {
      textAlign: "left !important",
      font: "normal normal 13px/25px Cairo-Medium !important",
      letterSpacing: "0.9px !important",
      color: `${mainTheme?.primaryColor} !important`,
      opacity: "1",
      height: "30px !important",
      paddingRight: "55px !important",
    },
  })
);

// ===========================================
// Advanced Input Fields Container
// ===========================================
export const ContainerOfInputFields = styled(Box)(
  ({
    theme,
    customePaddingRight,
    paddingHorizontal,
    customePaddingVertical,
    mainTheme,
    customeWidth,
    customHeight,
    haswidth,
    isForm,
    hasMultiLine,
    direction,
    maxHeight,
    ...props
  }) => ({
    // Container Layout
    width: haswidth ? customeWidth : "85%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignContents: "center",
    margin: haswidth ? "0" : "0 auto",
    padding: paddingHorizontal || "2px 10px",
    justifyContent: "center",
    alignItems: "center",
    opacity: "1 !important",

    // Textarea Specific Styles
    "& textarea": {
      overflowY: "scroll !important",
      maxHeight: hasMultiLine
        ? maxHeight || "200px !important"
        : customHeight || "55px !important",
      position: "relative",
      top: "12px",
      textAlign: "justify",
    },

    // TextField Root Styles
    "& .MuiTextField-root, & .MuiTextField-root .MuiFilledInput-root": {
      minHeight:
        customHeight || (hasMultiLine ? "45px !important" : "55px !important"),
      width: "100%",
      background: `${theme.palette.mode === "dark"
          ? mainTheme.lightblack
          : mainTheme.paperColor
        } 0% 0% no-repeat padding-box !important`,
      boxShadow: isForm
        ? "0px 2px 10px -2px lightgrey !important"
        : "0px 6px 20px #00000014 !important",
      opacity: "1 !important",
      textAlign: "justify !important",
    },

    // MultiLine Padding
    "& .MuiTextField-root .MuiFilledInput-root": {
      padding: hasMultiLine ? "12px 10px !important" : "auto",
    },

    // Required Field Asterisk
    "& .MuiInputLabel-asterisk": {
      color: "#ff0000 !important",
      fontSize: "20px !important",
    },

    // Remove Default Borders
    "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
      border: "none !important",
      outline: "none !important",
    },

    // Focus State - Left Border
    "& .MuiFilledInput-root.Mui-focused:before": {
      top: 0,
      left: 0,
      bottom: 0,
      width: "5px !important",
      height: "100% !important",
      background: mainTheme?.iconColor,
      overflow: "hidden",
      transition: "all 0.9s ease",
    },

    // Label Styles
    "& .MuiTextField-root .MuiFormLabel-root": {
      textAlign: "left",
      font: "normal normal 15.5px/26px Cairo",
      letterSpacing: "0.7px",
      color: `${theme.palette.mode === "dark"
          ? mainTheme.colorWhite
          : mainTheme?.colorblack
        } !important`,
      opacity: "0.95",
    },

    // Input Text Styles
    "& .MuiTextField-root .MuiFilledInput-input": {
      textAlign: "left",
      font: "normal normal normal 16px/33px Cairo",
      letterSpacing: "0px",
      color: `${mainTheme?.primaryColor} !important`,
      opacity: "1",
      paddingRight: customePaddingRight || "50px",
    },

    // Close Icon Styles
    "& .closeIcon": {
      position: "absolute",
      top: "16px",
      right: "5px",
      color: mainTheme?.iconColor,
      cursor: "pointer",
      backgroundColor: "#ebebeba0",
      borderRadius: "50%",
      width: "27px",
      height: "27px",
      padding: "2.8px",
    },

    // Textarea Icons
    "& .textAreaIcons": {
      right: "22px",
    },

    // Phone Field Icon
    "& .phone": {
      top: "26px !important",
    },

    // Helper Text Styles
    "& .MuiFormHelperText-root": {
      fontSize: props?.CustomFontSize || "15px",
    },

    // Error State Styles
    "& .errors .MuiFilledInput-root:before": {
      backgroundColor: "red !important",
      top: 0,
      left: 0,
      bottom: 0,
      width: "5px !important",
      height: "100% !important",
      overflow: "hidden",
      transition: "all 0.9s ease",
    },
  })
);

// ===========================================
// Select Field Container Component
// ===========================================
export const ContainerOfSelectField = styled(Box)(
  ({
    theme,
    customeWidth,
    customHeight,
    haswidth,
    hasError,
    isForm,
    customPadding,
  }) => ({
    // Container Layout
    width: haswidth ? customeWidth : "85%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignContents: "center",
    margin: haswidth ? "0" : "0 auto",
    padding: customPadding || "0px 10px",
    justifyContent: "center",
    alignItems: "center",
    opacity: "1 !important",

    // Autocomplete Root
    "& .MuiAutocomplete-root": {
      position: "relative",
    },

    // TextField Styles
    "& .MuiTextField-root, & .MuiTextField-root .MuiFilledInput-root": {
      minHeight: customHeight || "55px !important",
      width: "100%",
      background: `${theme.palette.mode === "dark"
          ? theme.palette.primary.lightblack
          : theme.palette.primary.colorWhite
        } 0% 0% no-repeat padding-box !important`,
      boxShadow: isForm
        ? "0px 2px 10px -2px lightgrey !important"
        : "0px 6px 20px #00000014 !important",
      opacity: "1 !important",
    },

    // Remove Default Borders
    "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
      border: "none !important",
      outline: "none !important",
    },

    // End Adornment Position
    "& .MuiAutocomplete-endAdornment": {
      top: "15px",
    },

    // Focus State with Clear Icon
    "& .MuiAutocomplete-root.MuiAutocomplete-hasClearIcon ::before": {
      top: "0 !important",
      left: "0 !important",
      bottom: "0 !important",
      width: "5px !important",
      height: "100% !important",
      background: hasError
        ? "red !important"
        : `${theme?.palette.primary.main} !important`,
      overflow: "hidden !important",
      transition: "all 0.9s ease",
      zIndex: "1000 !important",
      position: "absolute !important",
    },

    // Focus State
    "& .MuiAutocomplete-root.Mui-focused ::before": {
      top: "0 !important",
      left: "0 !important",
      bottom: "0 !important",
      width: "5px !important",
      height: "100% !important",
      background: hasError
        ? "red !important"
        : `${theme?.palette.primary.main} !important`,
      overflow: "hidden !important",
      transition: "all 0.9s ease",
      zIndex: "1000 !important",
      position: "absolute !important",
    },

    // Label Styles
    "& .MuiAutocomplete-root .MuiFormControl-root .MuiFormLabel-root": {
      textAlign: "left",
      font: "normal normal 15.5px/26px Cairo",
      letterSpacing: "0.7px",
      color: `${theme.palette.mode === "dark"
          ? theme.palette.primary.colorWhite
          : theme?.palette.primary.colorblack
        } !important`,
      opacity: "0.95",
    },

    // Input Text Styles
    "& .MuiAutocomplete-root .MuiFormControl-root .MuiFilledInput-input": {
      textAlign: "left",
      font: "normal normal normal 16px/33px Cairo",
      letterSpacing: "0px",
      color: `${theme?.palette.primary.main} !important`,
      opacity: "1",
    },

    // Close Icon
    "& .closeIcon": {
      position: "absolute",
      top: "20px",
      right: "15px",
      color: theme?.palette.primary.main,
      cursor: "pointer",
    },

    // Chip Styles (for multi-select)
    "& .MuiChip-root": {
      height: "25px !important",
    },

    "& .MuiChip-label": {
      fontFamily: "Cairo-Light",
    },

    "& .MuiChip-deleteIcon": {
      fontSize: "14px",
    },
  })
);

// ===========================================
// Usage Examples and Documentation
// ===========================================

/*
Usage Examples:

1. Basic Input:
<ContainerOfInput mainTheme={theme} customeWidth="300px">
  <TextField variant="filled" label="Basic Input" />
</ContainerOfInput>

2. Advanced Input with Multiline:
<ContainerOfInputFields 
  mainTheme={theme} 
  hasMultiLine={true}
  maxHeight="150px"
  customHeight="80px"
>
  <TextField 
    variant="filled" 
    label="Multiline Input" 
    multiline 
    rows={4}
  />
</ContainerOfInputFields>

3. Select Field:
<ContainerOfSelectField 
  mainTheme={theme}
  hasError={false}
  isForm={true}
>
  <Autocomplete
    options={options}
    renderInput={(params) => (
      <TextField {...params} variant="filled" label="Select Option" />
    )}
  />
</ContainerOfSelectField>

Props Documentation:
- mainTheme: Theme object containing colors and styling
- customeWidth: Custom width for the container
- customHeight: Custom height for input fields
- hasMultiLine: Boolean for multiline textarea support
- hasError: Boolean for error state styling
- isForm: Boolean for form-specific styling
- customPadding: Custom padding for containers
*/
