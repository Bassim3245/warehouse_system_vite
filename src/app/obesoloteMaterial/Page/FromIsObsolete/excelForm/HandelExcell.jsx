import CustomizedStepper from "./Stepper";
import Close from "@mui/icons-material/Close";
import CloudUpload from "@mui/icons-material/CloudUpload";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { alpha } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import {useTheme} from "@mui/material/styles";import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import React, { useState } from "react";
import Logo from "../../../../../components/Layout/logo";
import { ButtonTheme } from "../../../../../style/ButtomStyle";

/**
 * Transition component for dialog animation
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * HandelExcelFile - A modern component for handling Excel file uploads
 * 
 * @param {Object} props - Component props
 * @param {Array} props.dataMainClass - Main class data
 * @param {Array} props.dataSubClass - Sub class data
 * @param {Array} props.materialInfo - Material information
 * @param {Object} props.dataUserById - User data
 * @param {Array} props.dataUnitMeasuring - Unit measuring data
 * @param {Function} props.setRefreshButton - Function to refresh parent component
 */
function HandelExcelFile({
  dataMainClass,
  dataSubClass,
  materialInfo,
  dataUserById,
  dataUnitMeasuring,
  setRefreshButton
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
      <ButtonTheme
        variant="contained"
        startIcon={<CloudUpload sx={{ me: 1 }} />}
        onClick={handleClickOpen}
      >
        رفع المواد من خلال file excel
      </ButtonTheme>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.9) : theme.palette.background.paper,
          }
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: theme.spacing(1, 2),
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                edge="start"
                onClick={handleClose}
                sx={{
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {theme.direction === 'rtl' ? <ArrowBack /> : <Close />}
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                }}
              >
                استيراد بيانات Excel
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Logo />
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>

          <CustomizedStepper
            dataUserById={dataUserById}
            dataSubClass={dataSubClass}
            dataMainClass={dataMainClass}
            dataUnitMeasuring={dataUnitMeasuring}
            materialInfo={materialInfo}
          />
        </Container>
      </Dialog>
    </React.Fragment>
  );
}

export default HandelExcelFile;
