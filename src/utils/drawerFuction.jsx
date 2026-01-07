
import MuiDrawer from "@mui/material/Drawer";
import { hasPermission } from "./Function";
import { Dashboard } from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 260;
export const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});
export const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
export const renderLogo = (open, logo, theme, rtl, title) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: "30%",
      justifyContent: "center",
      margin: "auto",
    }}
  >
    <div className="logo-container" style={{ position: "relative" }}>
      {!logo ? (
        <div
          className="logo-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "8px",
            transition: "transform 0.3s ease",
          }}
        >
          {["yellow", "light-purple", "purple", "light-yellow"].map((color) => (
            <div
              key={color}
              className={`circleLogo ${color}`}
              style={{
                width: open ? "36px" : "20px",
                height: open ? "36px" : "20px",
                transition: "all 0.3s ease",
                transform: `scale(${open ? 1 : 0.8})`,
                opacity: open ? 1 : 0.7,
              }}
            />
          ))}
        </div>
      ) : (
        <div>
          <img
            loading="lazy"
            src={logo}
            alt="Logo"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
    {open && (
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          color: theme.palette.text.primary,
          fontWeight: 500,
          fontSize: "0.8rem",
          lineHeight: 1.4,
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
          mt: 1,
        }}
      >
        {rtl?.dir === "ltr" ? <>{title}</> : <>{title}</>}
      </Typography>
    )}
  </Box>
);
export const renderMenuItem = (
  item,
  permissionData,
  rtl,
  location,
  theme,
  navigate,
  open
) => {
  const hasAccess = hasPermission(item?.checkPermission, permissionData);
  if (!hasAccess) return null;
  
  // Extract the last segment of the pathname for nested route matching
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1];
  
  // Check if current page matches the item path (for nested routes)
  const isActive = location.pathname === `/${item.path}` || 
                   location.pathname === item.path || 
                   currentPage === item.path;
  

  return (
    <ListItem key={item.path} disablePadding sx={{ display: "block", mb: 0.5 }}>
      <Tooltip
        title={open ? null : item?.text}
        placement={rtl?.dir === "rtl" ? "left" : "right"}
        arrow
      >
        <ListItemButton
          onClick={() => navigate(item?.path)}
          selected={isActive}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            borderRadius: "12px",
            px: 2,
            position: "relative",
            overflow: "hidden",
            backgroundColor: isActive
              ? `${theme.palette.primary.main}15` // 15% opacity of primary color
              : "transparent",
            border: isActive
              ? `1px solid ${theme.palette.primary.main}40` // 40% opacity border
              : "1px solid transparent",
            "&:hover": {
              backgroundColor: isActive
                ? `${theme.palette.primary.main}25` // Slightly more opacity on hover for active items
                : theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
            },
            "&::before": isActive
              ? {
                  content: '""',
                  position: "absolute",
                  left: rtl?.dir === "rtl" ? "auto" : 0,
                  right: rtl?.dir === "rtl" ? 0 : "auto",
                  top: 0,
                  bottom: 0,
                }
              : {},
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? (rtl?.dir === "rtl" ? 0 : 2) : "auto",
              ml: open && rtl?.dir === "rtl" ? 2 : 0,
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {item?.icon || <Dashboard fontSize="small" />}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              opacity: open ? 1 : 0,
              transition: "opacity 0.3s ease",
              "& .MuiTypography-root": {
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              },
              textAlign: rtl?.dir === "rtl" ? "right" : "left",
            }}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};
