import React, { useRef, useState } from "react";
import { ButtonSave } from "../../../../style/ButtomStyle";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import Print from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import DisplayListItem from "./displayListItem";
import DisplaySignalItem from "./displaySignalItem";
import DisplayExpensesReport from "./components/componentsDisplayExpensesReport";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const DisplayInformationComponent = ({
  includes,
  activeFactory,
  ActiveLab,
  activeMaterial,
  activeWareHouse,
  dataItem,
  reportType,
  dataUserById,
  selectTypInfroamtion,
}) => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <ButtonSave variant="outlined" onClick={handleClickOpen}>
        عرض البيانات
      </ButtonSave>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#1e6a99" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              التقارير
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handlePrint}
              startIcon={<Print />}
            >
              طباعة
            </Button>
          </Toolbar>
        </AppBar>
        <div ref={componentRef}>
          {
            selectTypInfroamtion?.selectRadioMaterialInforamtionType === "expenses_report_entity" && (
              <DisplayExpensesReport dataItem={dataItem} />
            )
          }
          {
            reportType === "general" && (
              <DisplayListItem
                activeMaterial={activeMaterial}
                activeWareHouse={activeWareHouse}
                ActiveLab={ActiveLab}
                activeFactory={activeFactory}
                includes={includes}
              />
            )}
          {
            selectTypInfroamtion?.selectRadioMaterialInforamtionType === "general_info" && (
              <DisplaySignalItem dataItem={dataItem} dataUserById={dataUserById} />
            )
          }
        </div>
      </Dialog>
    </div>
  );
};

export default DisplayInformationComponent;