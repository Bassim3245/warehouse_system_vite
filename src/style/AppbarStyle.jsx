import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

export const drawerWidth = 260;


export const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "rtl",
})(({ theme, open, rtl }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow:
    theme.palette.mode === "light"
      ? "0 2px 10px rgba(90, 8, 8, 0.05)"
      : "0 2px 10px rgba(0,0,0,0.5)",
  ...(open && {
    marginLeft: rtl?.flexDirection === "row" ? drawerWidth : undefined,
    marginRight: rtl?.flexDirection === "row-reverse" ? drawerWidth : undefined,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Styled components for AppBar elements
export const StyledIconBtn = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.04)",
  borderRadius: "10px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.08)",
    transform: "scale(1.05)",
  },
}));

export const StyledUserName = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 500,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: theme.palette.text.primary,
  transition: "all 0.3s ease",
  "@media (max-width: 600px)": {
    fontSize: "0.8rem",
  },
}));
