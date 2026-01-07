import  { useState } from "react";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Fade from "@mui/material/Fade";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  ColorlibConnector,
} from "./styleUtils";
import {
  ColorlibStepIcon,
  handleBack,
  handleNext,
  handleReset,
} from "./utils";


/**
 * CustomizedStepper - A modern stepper component for guiding users through the Excel upload process
 */
export default function CustomizedStepper({
  dataUserById,
  dataSubClass,
  dataMainClass,
  dataUnitMeasuring,
  materialInfo,
  wareHouseData,
  labId,
  warehouseId,
  dataUserLab,
  onComplete,
  onFileUpload,
  onDataSave,
  buttonText = "رفع مواد المخزون من Excel",
  dialogTitle = "نظام إدارة المخزون - رفع ملف Excel",
  steps = [],
  dataSteps = [],
  icons = {},
  ...props
}) {
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";


  return (
    <>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        sx={{ mb: 5 }}
      >
        {steps?.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
            >
              <Typography
                sx={{
                  fontWeight: activeStep === index ? 600 : 400,
                  color:
                    activeStep === index
                      ? theme.palette.primary.main
                      : activeStep > index
                        ? theme.palette.success.main
                        : theme.palette.text.secondary,
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  mt: 1.5,
                  transition: "all 0.3s ease",
                }}
              >
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box
        sx={{
          mt: 5,
          minHeight: "400px",
          position: "relative",
        }}
      >
        <Fade in={true} timeout={600} key={activeStep}>
          <Box
            sx={{
              p: { xs: 1, sm: 2 },
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.3),
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            {dataSteps[activeStep]}
          </Box>
        </Fade>
      </Box>

      {/* Navigation Buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        sx={{
          mt: 5,
          pt: 3,
          borderTop: `2px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={() => handleBack(setActiveStep)}
          startIcon={<NavigateBeforeIcon />}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: { xs: "100%", sm: "140px" },
            border: `2px solid ${theme.palette.primary.main}`,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[4],
            },
            "&:disabled": {
              border: `2px solid ${alpha(theme.palette.grey[400], 0.5)}`,
            },
            transition: "all 0.3s ease",
          }}
        >
          السابق
        </Button>
        <Box sx={{ flex: 1, display: { xs: "none", sm: "block" } }} />
        {activeStep === dataSteps.length - 1 ? (
          <Button
            onClick={() => handleReset(setActiveStep)}
            startIcon={<RestartAltIcon />}
            variant="outlined"
            color="secondary"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              minWidth: { xs: "100%", sm: "140px" },
              border: `2px solid ${theme.palette.secondary.main}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              },
              transition: "all 0.3s ease",
            }}
          >
            إعادة تعيين
          </Button>
        ) : (
          <Button
            onClick={() => handleNext(activeStep, setActiveStep, dataSteps)}
            endIcon={<NavigateNextIcon />}
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              minWidth: { xs: "100%", sm: "140px" },
              backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              boxShadow: theme.shadows[3],
              "&:hover": {
                boxShadow: theme.shadows[6],
                transform: "translateY(-2px)",
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
              transition: "all 0.3s ease",
            }}
          >
            {activeStep === dataSteps.length - 2 ? "حفظ البيانات" : "التالي"}
          </Button>
        )}
      </Stack>
    </>
  );
}
