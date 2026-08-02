import { useEffect, useMemo, useCallback, memo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useTheme} from "@mui/material/styles";import useMediaQuery from "@mui/material/useMediaQuery";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getUserInformation } from "../../utils/handelCookie";
import { logoutUser } from "../../redux/userSlice/authActions";
import {
  Drawer,
  DrawerHeader,
  renderLogo,
  renderMenuItem,
} from "../../utils/drawerFuction";
import {
  dividerSx,
  drawerHeaderSx,
  drawerPaperSx,
  footerBorderSx,
  homeButtonSx,
  logoutButtonSx,
  toggleButtonSx,
} from "../../style/DrawerStyle";
import useUserPermissions from "../../hooks/genaral/useUserPermissions";

const SideBar = ({
  open,
  handleDrawerClose,
  handleDrawerOpen,
  Route1 = [],
  Route2 = [],
  logo,
  title,
  Route3 = [],
  Route4 = [],
}) => {
  const { rtl } = useSelector((state) => state?.language);
  const dataUserById = getUserInformation();
  const { permissionData } = useUserPermissions();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();

  // Mobile detection
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Memoize drawer width calculation based on device
  const drawerWidth = useMemo(() => {
    if (isMobile) return open ? 260 : 0;
    if (isTablet) return open ? 240 : 72;
    return open ? 260 : 72;
  }, [open, isMobile, isTablet]);

  // Memoize isDark check
  const isDark = useMemo(
    () => theme.palette.mode === "dark",
    [theme.palette.mode]
  );

  // Auto-close drawer on mobile after navigation
  useEffect(() => {
    if (isMobile && open) {
      handleDrawerClose();
    }
  }, [location.pathname, isMobile]);

  const handleHomeNavigation = useCallback(() => {
    navigate("/");
    if (isMobile) handleDrawerClose();
  }, [navigate, isMobile, handleDrawerClose]);

  const handleLogout = useCallback(() => {
    const userId = dataUserById?.user_id;
    dispatch(logoutUser(userId));
    if (isMobile) handleDrawerClose();
  }, [dispatch, dataUserById?.user_id, isMobile, handleDrawerClose]);
  const DrawerContent = useMemo(
    () => (
      <>
        {/* Header Section */}
        <DrawerHeader sx={drawerHeaderSx(isDark)}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            {renderLogo(open, logo, theme, rtl, title)}
          </Box>
          <IconButton
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={toggleButtonSx(isDark, theme)}
          >
            {rtl?.dir === "rtl" ? (
              open ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />
            ) : (
              open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        </DrawerHeader>

        {/* Main Navigation */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
          <List dir={rtl?.dir}>
            {Route1?.map((item) =>
              renderMenuItem(
                item,
                permissionData,
                rtl,
                location,
                theme,
                navigate,
                open
              )
            )}
            {Route2.length > 0 && <Divider sx={dividerSx(isDark)} />}
            {Route2.length > 0 &&
              Route2?.map((item) =>
                renderMenuItem(
                  item,
                  permissionData,
                  rtl,
                  location,
                  theme,
                  navigate,
                  open
                )
              )}
            {Route3.length > 0 && <Divider sx={dividerSx(isDark)} />}
            {Route3.length > 0 &&
              Route3?.map((item) =>
                renderMenuItem(
                  item,
                  permissionData,
                  rtl,
                  location,
                  theme,
                  navigate,
                  open
                )
              )}
            {Route4.length > 0 && <Divider sx={dividerSx(isDark)} />}
            {Route4.length > 0 &&
              Route4?.map((item) =>
                renderMenuItem(
                  item,
                  permissionData,
                  rtl,
                  location,
                  theme,
                  navigate,
                  open
                )
              )}
          </List>
        </Box>

        {/* Footer Actions */}
        <Box sx={footerBorderSx(isDark)}>
          <Button
            variant="text"
            color="primary"
            fullWidth
            startIcon={<ExitToAppIcon fontSize="small" />}
            onClick={handleHomeNavigation}
            sx={homeButtonSx(isDark, open, theme, rtl)}
          >
            {open && t("الصفحة الرئيسية")}
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<ExitToAppIcon fontSize="small" />}
            onClick={handleLogout}
            sx={logoutButtonSx(open, theme, isDark, rtl)}
          >
            {open && t("تسجيل الخروج")}
          </Button>
        </Box>
      </>
    ),
    [
      isDark,
      open,
      logo,
      theme,
      rtl,
      title,
      handleDrawerClose,
      handleDrawerOpen,
      Route1,
      Route2,
      Route3,
      Route4,
      permissionData,
      location,
      navigate,
      handleHomeNavigation,
      handleLogout,
      t,
    ]
  );

  // Mobile: Use SwipeableDrawer (temporary)
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor={rtl?.anchor || "left"}
        open={open}
        onClose={handleDrawerClose}
        onOpen={() => {}} // Required for SwipeableDrawer
        swipeAreaWidth={20}
        disableBackdropTransition
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          "& .MuiDrawer-paper": {
            ...drawerPaperSx(isDark, 260),
            width: 260,
            boxSizing: "border-box",
          },
        }}
      >
        {DrawerContent}
      </SwipeableDrawer>
    );
  }

  // Desktop/Tablet: Use permanent Drawer
  return (
    <Drawer
      variant="permanent"
      open={open}
      anchor={rtl?.anchor}
      sx={{
        "& .MuiDrawer-paper": drawerPaperSx(isDark, drawerWidth),
      }}
    >
      {DrawerContent}
    </Drawer>
  );
};

export default memo(SideBar);