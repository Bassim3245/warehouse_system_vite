import { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PreviewIcon from "@mui/icons-material/Preview";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExcelTemplate from "./excelTempletData";
import Instructions from "./Instructions";
import ExcelUpload from "./ExcelUpload";
import ReviewDataSet from "./ReviewDataSet";

/**
 * Styled connector for the stepper
 */
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? alpha(theme.palette.grey[800], 0.8) : theme.palette.grey[300],
    borderRadius: 5,
  },
}));

/**
 * Styled icon for the stepper
 */
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed
    ? theme.palette.primary.main
    : theme.palette.mode === "dark"
      ? alpha(theme.palette.grey[700], 0.7)
      : theme.palette.grey[300],
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: theme.shadows[1],
  transition: "all 0.3s ease",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(136deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    transform: "scale(1.1)",
  }),
}));

/**
 * Step icon component for the stepper
 */
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  const theme = useTheme();

  const icons = {
    1: <InfoIcon />,
    2: <FileDownloadIcon />,
    3: <UploadFileIcon />,
    4: <PreviewIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? <CheckCircleIcon /> : icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

/**
 * CustomizedStepper - A modern stepper component for the Excel upload process
 */
export default function CustomizedStepper(props) {
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isRTL = theme.direction === "rtl";

  // Define 4 consistent steps
  const steps = [
    "المواد الراكدة",
    "الحصول على قالب file excel",
    "رفع file excel",
    "مراجعة البيانات قبل الحفظ بقاعدة البيانات",
  ];

  const dataSteps = [
    <Instructions />,
    <ExcelTemplate
      dataUserById={props?.dataUserById}
      dataSubClass={props?.dataSubClass}
      dataMainClass={props?.dataMainClass}
      dataUnitMeasuring={props?.dataUnitMeasuring}
      materialInfo={props?.materialInfo}
    />,
    <ExcelUpload
      setDataFileExcel={setDataFileExcel}
      setActiveStep={setActiveStep}
      setRefresh={setRefresh}
      refresh={refresh}
    />,
    <ReviewDataSet
      dataFileExcel={dataFileExcel}
      dataUserById={props?.dataUserById}
      dataSubClass={props?.dataSubClass}
      dataMainClass={props?.dataMainClass}
      dataUnitMeasuring={props?.dataUnitMeasuring}
      materialInfo={props?.materialInfo}
      setDataFileExcel={setDataFileExcel}
      setRefresh={setRefresh}
      setSaveData={setSaveData}
    />,
  ];

  const handleNext = () => {
    if (activeStep < dataSteps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  const handleFinish = () => {
    alert("All steps completed successfully!");
    handleReset();
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Stack sx={{ width: "100%" }} spacing={4}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: theme.shape.borderRadius * 1.5,
          backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps?.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                sx={{
                  '& .MuiStepLabel-label': {
                    mt: 1,
                    fontWeight: activeStep === index ? 600 : 400,
                    color: activeStep === index ? theme.palette.primary.main : theme.palette.text.secondary,
                    transition: 'all 0.2s ease',
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Fade in={true} timeout={500}>
        <Box>
          {activeStep === dataSteps.length ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: theme.shape.borderRadius * 1.5,
                backgroundColor: isDark ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.2),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: 60,
                  mb: 2,
                  opacity: 0.8
                }}
              />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: theme.palette.success.main }}>
                تمت العملية بنجاح!
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                تم الانتهاء من جميع الخطوات بنجاح
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleReset}
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  px: 3,
                  py: 1,
                  fontWeight: 500,
                  boxShadow: theme.shadows[1],
                  '&:hover': {
                    boxShadow: theme.shadows[2],
                  }
                }}
              >
                إعادة تعيين
              </Button>
            </Paper>
          ) : (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: theme.shape.borderRadius * 1.5,
                  backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.4) : theme.palette.background.paper,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: theme.shadows[1],
                }}
              >
                {dataSteps[activeStep]}
              </Paper>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ px: 1 }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={isRTL ? <ArrowForwardIcon /> : <ArrowBackIcon />}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    px: 3,
                    borderWidth: 1,
                    '&:not(:disabled)': {
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      }
                    }
                  }}
                >
                  رجوع
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    activeStep === steps.length - 1
                      ? saveData && handleFinish
                      : handleNext
                  }
                  endIcon={isRTL ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                  disabled={activeStep === steps.length - 1 && !saveData}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    px: 3,
                    boxShadow: theme.shadows[2],
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {activeStep === steps.length - 1 ? "إنهاء" : "التالي"}
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      </Fade>
    </Stack>
  );
}
