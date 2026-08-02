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
import {useTheme} from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import InfoIcon from "@mui/icons-material/Info";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PreviewIcon from "@mui/icons-material/Preview";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ExcelTemplate from "./excelTempletData";
import Instructions from "./Instructions";
import ExcelUpload from "./ExcelUpload";
import ReviewDataSet from "./ReviewDataSet";

// Styled Components
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
    backgroundColor: theme.palette.mode === "dark" ? alpha(theme.palette.grey[800], 0.9) : theme.palette.grey[300],
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? theme.palette.success.main : 
                  theme.palette.mode === "dark" ? alpha(theme.palette.grey[700], 0.7) : theme.palette.grey[300],
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
    boxShadow: theme.shadows[4],
    transform: "scale(1.1)",
  }),
}));

/**
 * Custom step icon component for the stepper
 */
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
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
 * CustomizedStepper - A modern stepper component for guiding users through the Excel upload process
 */
export default function CustomizedStepper(props) {
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const theme = useTheme();
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
      wareHouseData={props?.wareHouseData}
      labId={props?.labId}
    />,
    <ExcelUpload
      setDataFileExcel={setDataFileExcel}
      setActiveStep={setActiveStep}
      setRefresh={setRefresh}
      refresh={refresh}
      labId={props?.labId}
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
      warehouseId={props?.warehouseId}
      dataUserLab={props?.dataUserLab}
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

  const handleReset = () => {
    setActiveStep(0);
  };
  
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
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <Typography 
                sx={{ 
                  fontWeight: activeStep === index ? 600 : 400,
                    color: activeStep === index 
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
            onClick={handleBack}
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
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              },
              '&:disabled': {
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
              onClick={handleReset}
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
                '&:hover': {
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
              onClick={handleNext}
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
                '&:hover': {
                  boxShadow: theme.shadows[6],
                  transform: "translateY(-2px)",
                  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
                transition: "all 0.3s ease",
              }}
            >
              {activeStep === dataSteps.length ? "حفظ البيانات" : "التالي"}
            </Button>
          )}
        </Stack>
      </>
  );
}
