import { useState, useEffect, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ResponsiveAppBar from "./AppBar";
import { Outlet } from "react-router-dom";
import { ThemeProvider, styled } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./SlidBar";
import { getDesignTokens } from "./Theme";
import { getToken } from "../../utils/handelCookie";
import Box from "@mui/material/Box";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Root({
  Route1 = [],
  Route2 = [],
  Route3 = [],
  Route4 = [],
  logo,
  urlApi,
  permission,
  category_id,
  title,
}) {
  const token = getToken();
  const { rtl } = useSelector((state) => state.language);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(
    localStorage.getItem("currentMode") || "light"
  );

  // Persist mode changes
  useEffect(() => {
    localStorage.setItem("currentMode", mode);
  }, [mode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: rtl?.flexDirection || "row" }}>
        <CssBaseline />
        <ResponsiveAppBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          setMode={setMode}
          urlApi={urlApi}
          permission={permission}
          category_id={category_id}
        />
        {token && (
          <SideBar
            open={open}
            handleDrawerClose={handleDrawerClose}
            Route1={Route1}
            Route2={Route2}
            logo={logo}
            title={title}
            Route3={Route3}
            Route4={Route4}
          />
        )}
        <Box
          component="main"
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflowX: rtl?.dir === "rtl" ? "auto" : "hidden",
          }}
        >
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
