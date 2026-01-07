import { iconsInventory } from "../../app/warehouse_management/Pages/managemnatStoreData/excelTemplet";
import { ColorlibStepIconRoot } from "./styleUtils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function ColorlibStepIcon({
  active,
  completed,
  className,
  icon = 1,
}) {

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? <CheckCircleIcon /> : iconsInventory[String(icon)]}
    </ColorlibStepIconRoot>
  );
}
export const handleNext = (activeStep, setActiveStep, dataSteps) => {
  if (activeStep < dataSteps.length - 1) {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
};
export const handleBack = (setActiveStep) => {
  setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
};
export const handleFinish = () => {
  alert("All steps completed successfully!");
  handleReset();
};
export const handleReset = (setActiveStep) => {
  setActiveStep(0);
};
