import React, { useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import Inventory from "@mui/icons-material/Inventory";
import Print from "@mui/icons-material/Print";
import Visibility from "@mui/icons-material/Visibility";

import { useReactToPrint } from "react-to-print";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CardInfoImportMaterialArchive from "./cardInfoImportMaterialArchive";
import CardInfoExportMaterialArchive from "./cardInfoExportMaterialArchive";
import { MenuItem } from "@mui/material";
import useLanguageRtl from "../../../../hooks/genaral/useLanguageRtl";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
const DisplayInformationArchiveMaterial = ({ dataItem, isExport, isInternalTransfer }) => {
  const [open, setOpen] = useState(false);
  const {rtl} = useLanguageRtl();
  const componentRef = useRef();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve, reject) => {
        document.body.classList.add("printing");
        setTimeout(resolve, 100);
      });
    },
    onAfterPrint: () => document.body.classList.remove("printing"),
    pageStyle: `
    @page {
    size: landscape !important;
    margin: 4mm 4mm 4mm 4mm !important; /* top right bottom left */
    }
    @media print {
    body {
    direction: rtl !important;
    margin-top: 10mm !important; /* extra top margin for new pages */
    }
    }
    `,
  });
  return (
    <>
      <MenuItem onClick={handleClickOpen}>
        <Visibility />
        <Typography variant="body2" sx={{ ml: 1 }}>
          التفاصيل
        </Typography>
      </MenuItem>
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
        <Box sx={{ p: 3 }} dir={rtl.dir} ref={componentRef}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              border: "2px solid #000",
              bgcolor: "white",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  mb: 1,
                  textDecoration: "underline",
                }}
              >
                <Inventory sx={{ mr: 1, fontSize: 35, color: "#000" }} />
                تقرير المخزون التفصيلي
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                الشركة العامة للأنظمة الالكترونية
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2,
                borderTop: "1px solid #000",
                pt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#000", fontWeight: "bold" }}
              >
                تاريخ الطباعة: {new Date().toLocaleDateString("ar-EG")}
              </Typography>
            </Box>
          </Paper>
          {!isExport && (
            <CardInfoImportMaterialArchive dataItem={dataItem} />
          )}
          {isExport && (
            <CardInfoExportMaterialArchive dataItem={dataItem} />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default DisplayInformationArchiveMaterial;
