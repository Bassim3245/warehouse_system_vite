
import React, { useState } from "react";
import { ButtonSave } from "../../style/ButtomStyle";
import CustomizedStepper from "./Stepper";
// Animated Background SVG Component
import Close from "@mui/icons-material/Close";
import CloudUpload from "@mui/icons-material/CloudUpload";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function FileExcelComponent({
  title = "رفع المواد من خلال ملف Excel",
  logo = "https://example.com/logo.png",
  dataMainClass = [],
  dataSubClass = [],
  dataUnitMeasuring = [],
  // materialInfo = [],
  dataUserById = {},
  wareHouseData = [],
  dataUserLab = [],
  warehouseId = null,
  steps = [],
  dataSteps = [],
  icons = {},
  ...props
}) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <ButtonSave
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<CloudUpload />}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: theme.shadows[2],
          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-1px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        رفع المواد من خلال ملف Excel
      </ButtonSave>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: isDark
              ? theme.palette.background.default
              : alpha(theme.palette.background.default, 0.98),
          },
        }}
      >
        <AppBar
          elevation={0}
          sx={{
            position: "relative",
            backgroundColor: isDark
              ? alpha(theme.palette.background.paper, 0.9)
              : "#ffffff",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <IconButton
              edge="start"
              onClick={handleClose}
              sx={{
                color: isDark
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.1),
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Close />
            </IconButton>

            <Typography
              variant="h5"
              component="div"
              sx={{
                color: isDark
                  ? theme.palette.text.primary
                  : theme.palette.text.primary,
                fontWeight: 600,
                textAlign: "center",
                flex: 1,
              }}
            >
              {title}
              نظام إدارة المخازن - رفع ملف Excel
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={logo}
                alt="شعار النظام"
                style={{
                  width: "60px",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: theme.shadows[1],
                }}
              />
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            backgroundColor: isDark
              ? theme.palette.background.default
              : alpha(theme.palette.grey[50], 0.5),
            minHeight: "100vh",
            pt: 2,
            position: "relative",
          }}
        >
          {/* Animated Background */}
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: 2, sm: 3, md: 4 },
              py: 3,
            }}
          >
            <CustomizedStepper
              title={title}
              logo={logo}
              dataUserById={dataUserById}
              dataSubClass={dataSubClass}
              dataMainClass={dataMainClass}
              dataUnitMeasuring={dataUnitMeasuring}
              // materialInfo={materialInfo}
              wareHouseData={wareHouseData}
              warehouseId={warehouseId}
              dataUserLab={dataUserLab}
              steps={steps}
              dataSteps={dataSteps}
              icons={icons}
              {...props}
            />
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export default FileExcelComponent;
