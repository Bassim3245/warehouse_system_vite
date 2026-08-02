import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

/* Floating, frosted-glass app bar — light and airy instead of a flat block */
export const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "rtl",
})(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create(["background-color", "border-color"], {
    duration: theme.transitions.duration.drawer,
    easing: theme.transitions.easing.smooth,
  }),
}));

export const StyledIconBtn = styled(IconButton)(({ theme }) => ({
  borderRadius: 10,
  padding: 8,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(["background-color", "color", "transform"], {
    duration: 200,
    easing: theme.transitions.easing.smooth,
  }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
  },
  "&:active": {
    transform: "scale(0.94)",
  },
}));

export const StyledUserName = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.95rem",
  letterSpacing: 0,
  transition: theme.transitions.create("color", { duration: 200 }),
}));