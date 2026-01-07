import { useCallback, useMemo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";


import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { GridMoreVertIcon } from "@mui/x-data-grid";

/* ===========================================================
   STATIC VALUES (no re-render)
=========================================================== */
const defaultOrigins = Object.freeze({
  anchor: { vertical: "bottom", horizontal: "right" },
  transform: { vertical: "top", horizontal: "right" },
});

/* ===========================================================
   STYLED MENU — optimized
=========================================================== */
export const StyledMenu = styled(Menu)(({ theme, GridTheme }) => {
  const paper = GridTheme?.paperColor || theme.palette.background.paper;
  const text =
    GridTheme?.gloablTextColor ||
    GridTheme?.paperTextColor ||
    theme.palette.text.primary;

  return {
    "& .MuiPaper-root": {
      borderRadius: 10,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: text,
      backgroundColor: paper,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: theme.shadows[4],
      overflow: "hidden",
      transition: "all 0.2s ease",

      "& .MuiMenuItem-root": {
        fontSize: "0.9rem",
        transition: "all 0.15s ease",
        display: "flex",
        alignItems: "center",

        "& .MuiSvgIcon-root": {
          fontSize: 18,
          marginRight: theme.spacing(1.5),
          color: theme.palette.primary.main,
          transition: "transform 0.2s ease",
        },

        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.08),

          "& .MuiSvgIcon-root": {
            transform: "scale(1.1)",
          },
        },
      },
    },
  };
});

/* ===========================================================
   ICON BUTTON — optimized
=========================================================== */
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease",
  color: theme.palette.text.secondary,

  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: "scale(1.05)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
export default function DropDownGrid({
  children,
  Icon = false,
  tooltipTitle,
  GridTheme,
  placement = "top",
  arrow = true,
  sx = {},
  onOpen,
  onClose,
  ...props
}) {
  // ================== STATE ==================
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // ================== EVENT HANDLERS ==================
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
      onOpen?.(event);
    },
    [onOpen]
  );

  const handleClose = useCallback(
    (event) => {
      event?.stopPropagation();
      setAnchorEl(null);
      onClose?.(event);
    },
    [onClose]
  );

  // ================== ICON BUTTON MEMO ==================
  const triggerButton = useMemo(
    () => (
      <StyledIconButton
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={sx}
        {...props}
      >
        {Icon ? <GridMoreVertIcon /> : <SettingsOutlinedIcon sx={{ fontSize: 22 }} />}
      </StyledIconButton>
    ),
    [open, Icon, handleClick, sx, props]
  );

  // ================== MENU JSX ==================
  const menuComponent = useMemo(
    () => (
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        GridTheme={GridTheme}
        anchorOrigin={defaultOrigins.anchor}
        transformOrigin={defaultOrigins.transform}
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
        }}
        PaperProps={{ elevation: 0 }}
      >
        {children}
      </StyledMenu>
    ),
    [anchorEl, open, handleClose, children, GridTheme]
  );

  // ================== RENDER ==================
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {tooltipTitle ? (
          <Tooltip
            title={tooltipTitle}
            arrow={arrow}
            placement={placement}
            enterDelay={400}
          >
            {triggerButton}
          </Tooltip>
        ) : (
          triggerButton
        )}
      </Box>

      {menuComponent}
    </>
  );
}

/* ===========================================================
   UTIL: CREATE MENU ITEM
=========================================================== */
export const createMenuItem = (text, icon, onClick) => (
  <MenuItem
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    sx={{ display: "flex", alignItems: "center", gap: 1 }}
  >
    {icon}
    {text}
  </MenuItem>
);
