import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import {useTheme} from "@mui/material/styles";import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";
import CloudUpload from "@mui/icons-material/CloudUpload";

import React, { useState } from "react";
import logo from "../../../../assets/image/1671635909.png";
import CustomizedStepper from "./Stepper";
import { ButtonTheme } from "../../../../style/ButtomStyle";

// Animated Background SVG Component
const AnimatedBackgroundSVG = ({ theme, isDark }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: -1,
      opacity: isDark ? 0.3 : 0.2,
      overflow: "hidden",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient definitions */}
        <linearGradient id="brickGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor={theme.palette.primary.main}
            stopOpacity="0.6"
          />
          <stop
            offset="100%"
            stopColor={theme.palette.secondary.main}
            stopOpacity="0.4"
          />
        </linearGradient>
        <linearGradient id="brickGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            stopColor={theme.palette.secondary.main}
            stopOpacity="0.5"
          />
          <stop
            offset="100%"
            stopColor={theme.palette.primary.light}
            stopOpacity="0.3"
          />
        </linearGradient>
        <radialGradient id="circleGradient1" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={theme.palette.success.main}
            stopOpacity="0.4"
          />
          <stop
            offset="100%"
            stopColor={theme.palette.success.main}
            stopOpacity="0.1"
          />
        </radialGradient>
        <radialGradient id="circleGradient2" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={theme.palette.warning.main}
            stopOpacity="0.4"
          />
          <stop
            offset="100%"
            stopColor={theme.palette.warning.main}
            stopOpacity="0.1"
          />
        </radialGradient>
      </defs>

      {/* Animated Brick Pattern */}
      <g>
        {/* Row 1 */}
        <rect
          x="0"
          y="50"
          width="120"
          height="40"
          fill="url(#brickGradient1)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="25s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="140"
          y="50"
          width="120"
          height="40"
          fill="url(#brickGradient2)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="30s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="280"
          y="50"
          width="120"
          height="40"
          fill="url(#brickGradient1)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="28s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Row 2 - Offset */}
        <rect
          x="-60"
          y="110"
          width="120"
          height="40"
          fill="url(#brickGradient2)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="32s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="80"
          y="110"
          width="120"
          height="40"
          fill="url(#brickGradient1)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="27s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="220"
          y="110"
          width="120"
          height="40"
          fill="url(#brickGradient2)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="29s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Row 3 */}
        <rect
          x="0"
          y="170"
          width="120"
          height="40"
          fill="url(#brickGradient1)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="26s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="140"
          y="170"
          width="120"
          height="40"
          fill="url(#brickGradient2)"
          rx="4"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="-150,0;1920,0;-150,0"
            dur="31s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      {/* Floating Circles */}
      <g>
        <circle cx="200" cy="300" r="25" fill="url(#circleGradient1)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;50,-30;0,0"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="25;35;25"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="800" cy="200" r="30" fill="url(#circleGradient2)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;-40,40;0,0"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="30;20;30"
            dur="7s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="1200" cy="400" r="20" fill="url(#circleGradient1)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;30,20;0,0"
            dur="12s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="20;40;20"
            dur="9s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="400" cy="600" r="35" fill="url(#circleGradient2)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;-20,-50;0,0"
            dur="14s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="35;25;35"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="1000" cy="700" r="28" fill="url(#circleGradient1)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;60,10;0,0"
            dur="11s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="28;38;28"
            dur="10s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Additional Decorative Elements */}
      <g>
        {/* Small floating squares */}
        <rect
          x="600"
          y="150"
          width="15"
          height="15"
          fill={alpha(theme.palette.info.main, 0.3)}
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 607.5 157.5;360 607.5 157.5"
            dur="20s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;20,30;0,0"
            dur="15s"
            repeatCount="indefinite"
            additive="sum"
          />
        </rect>

        <rect
          x="1300"
          y="300"
          width="12"
          height="12"
          fill={alpha(theme.palette.error.main, 0.3)}
          rx="2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 1306 306;-360 1306 306"
            dur="18s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;-30,20;0,0"
            dur="13s"
            repeatCount="indefinite"
            additive="sum"
          />
        </rect>

        <rect
          x="300"
          y="500"
          width="18"
          height="18"
          fill={alpha(theme.palette.secondary.main, 0.3)}
          rx="3"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 309 509;360 309 509"
            dur="22s"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;40,-20;0,0"
            dur="16s"
            repeatCount="indefinite"
            additive="sum"
          />
        </rect>
      </g>
    </svg>
  </Box>
);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function HandelExcelFile({
  dataMainClass,
  dataSubClass,
  materialInfo,
  dataUserById,
  dataUnitMeasuring,
  wareHouseData,
  dataUserLab,
  warehouseId,
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
      <Tooltip title="رفع فايل excel">
        <ButtonTheme onClick={handleClickOpen} startIcon={<CloudUpload />}>
          رفع فايل
        </ButtonTheme>
      </Tooltip>
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
          <AnimatedBackgroundSVG theme={theme} isDark={isDark} />
          <Box
            sx={{
              maxWidth: "1400px",
              mx: "auto",
              px: { xs: 2, sm: 3, md: 4 },
              py: 3,
            }}
          >
            <CustomizedStepper
              dataUserById={dataUserById}
              dataSubClass={dataSubClass}
              dataMainClass={dataMainClass}
              dataUnitMeasuring={dataUnitMeasuring}
              materialInfo={materialInfo}
              wareHouseData={wareHouseData}
              warehouseId={warehouseId}
              dataUserLab={dataUserLab}
            />
          </Box>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export default HandelExcelFile;
