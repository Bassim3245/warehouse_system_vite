import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setscreenwidth } from "../../redux/windoScreen/settingDataSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupForm(props) {
  const screenwidth = useSelector((state) => state.settingData.screenWidth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const handleResize = () => {
      dispatch(setscreenwidth(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  const handleClose = () => {
    props.setOpen(false);
  };

  const getMaxWidth = () => {
    if (props?.width) return props.width + " !important";
    if (props?.customeWidth) return props.customeWidth;
    return {
      xs: "95% !important",
      sm: "85% !important",
      md: "80% !important",
      lg: "60% !important",
    };
  };

  return (
    <Dialog
      open={props?.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        width: "100%",
        height: screenwidth <= 700 ? "100%" : props?.customeHeight || "auto",
        "& .MuiPaper-root": {
          width: "100%",
          height: screenwidth <= 700 ? "100%" : props?.customeHeight || "auto",
          minHeight: props?.fullheight ? "100% !important" : "400px !important",
          maxWidth: screenwidth <= 700 ? "100%" : getMaxWidth(),
          backgroundColor: isDark ? "#1a1a2e" : props?.backgroundColor || "#fff",
          margin: props?.is_margin ? "0px !important" : null,
          borderRadius: screenwidth <= 700 ? 0 : "12px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.6)"
            : "0 8px 32px rgba(0,0,0,0.15)",
        },
      }}
      BackdropProps={{
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(3px)",
        },
      }}
      dir={props?.dir || "rtl"}
      fullScreen={screenwidth <= 700 || props?.isFullScreen}
    >
      {/* ===== Header ===== */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row-reverse",
          px: 3,
          py: 1.5,
          background: isDark
            ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
            : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          color: "#fff",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "Cairo-Bold, Cairo, sans-serif",
            fontSize: "18px",
            fontWeight: "bold",
            letterSpacing: "0.3px",
          }}
        >
          {props.icon && props.icon}
          {props?.title}
        </span>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.85)",
            "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* ===== Content ===== */}
      <DialogContent
        sx={{
          px: screenwidth <= 700 ? 2 : 3,
          py: 2,
          overflowY: "auto",
        }}
      >
        {props?.content}
      </DialogContent>

      {/* ===== Footer ===== */}
      {props?.footer && (
        <>
          <Divider />
          <DialogActions
            sx={{
              px: 3,
              py: 1.5,
              gap: 1,
              justifyContent: "flex-start",
              backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#fafafa",
            }}
          >
            {props?.footer}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
