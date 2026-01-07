import { useEffect, useState, useMemo, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import {useTheme} from "@mui/material/styles";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleAndUserId } from "../../redux/RoleSlice/rolAction";
import { GridMenuIcon } from "@mui/x-data-grid";
import Logo from "./logo";
import LisItem from "./LisItem";
import { getToken, getUserInformation } from "../../utils/handelCookie";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import DropDownMenu from "./DrobMenue";
import DrobMenueAuth from "./DrobMenueAuth";
import { setLanguage } from "../../redux/LanguageState";
import AccountMenu from "./BookedData/DropDownMenu";
import { StyledAppBar, StyledIconBtn, StyledUserName } from "../../style/AppbarStyle";

const Appbar = ({
  open,
  handleDrawerOpen,
  setMode,
  urlApi,
  permission,
  category_id,
}) => {
  const { rtl } = useSelector((state) => state.language);
  const { Permission } = useSelector((state) => state?.RolesData);
  const dataUserById = getUserInformation();
  const token = getToken();

  const [permissionData, setPermissionData] = useState([]);
  const [votes, setVotes] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();

  // Memoize computed values
  const isDark = useMemo(() => theme.palette.mode === "dark", [theme.palette.mode]);
  const isLight = useMemo(() => theme.palette.mode === "light", [theme.palette.mode]);

  const displayName = useMemo(() => {
    const entityName = dataUserById?.Entities_name || "";
    const userName = dataUserById?.user_name;
    return userName ? `${entityName} (${userName})` : entityName;
  }, [dataUserById?.Entities_name, dataUserById?.user_name]);

  const hasToken = useMemo(() => !!token, [token]);

  // Memoize style objects
  const appBarSx = useMemo(() => ({
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
    transition: "all 0.3s ease",
  }), [isDark]);

  const toolbarSx = useMemo(() => ({
    flexDirection: rtl?.flexDirection,
    padding: "0.5rem 1rem",
    minHeight: "64px",
  }), [rtl?.flexDirection]);

  const menuIconSx = useMemo(() => ({
    marginLeft: rtl?.flexDirection === "row-reverse" ? 2 : null,
    marginRight: rtl?.flexDirection === "row" ? 2 : null,
    ...(open && { display: "none" }),
  }), [rtl?.flexDirection, open]);

  const userNameSx = useMemo(() => ({
    ml: rtl?.flexDirection === "row" ? 2 : 0,
    mr: rtl?.flexDirection === "row-reverse" ? 2 : 0,
    fontWeight: "bold",
  }), [rtl?.flexDirection]);

  // Parse permission data
  useEffect(() => {
    if (Permission?.permission_id) {
      try {
        const parsedData = JSON.parse(Permission.permission_id);
        setPermissionData(parsedData);
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission?.permission_id]);

  // Dispatch actions on component mount
  useEffect(() => {
    dispatch(getRoleAndUserId(token));
    dispatch(setLanguage());
  }, [dispatch, token, location]);

  // Browser notification helper - memoized
  const showNotification = useCallback((title, body) => {
    if ("Notification" in window) {
      if (Notification?.permission === "granted") {
        new Notification(title, { body });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body });
          }
        });
      }
    } else {
      console.warn("This browser does not support notifications.");
    }
  }, []);

  // Subscribe to Pusher events
  useEffect(() => {
    if (!dataUserById?.user_id || !dataUserById?.entity_id) {
      console.warn("User information not yet available. Pusher subscription skipped.");
      return;
    }

    const pusher = new Pusher("981e65db6d4dc90983b4", {
      cluster: "us3",
      encrypted: true,
    });
    const channel = pusher.subscribe("poll");
    const voteHandler = (eventData) => {
      if (
        (eventData.category_id === 2 && eventData?.user_id === dataUserById?.user_id) ||
        eventData?.entity_id === dataUserById?.entity_id
      ) {
        setVotes((prevVotes) => prevVotes + 1);

        const notificationTitle = "تنبيه: إشعار جديد!";
        const notificationBody = eventData?.message || "You have received a new vote!";

        showNotification(notificationTitle, notificationBody);

        toast.success(eventData?.message || "Vote received", {
          position: "top-right",
          style: {
            backgroundColor: "black",
            color: "white",
          },
        });
      }
    };

    channel.bind("vote", voteHandler);

    return () => {
      channel.unbind("vote", voteHandler);
      pusher.unsubscribe("poll");
    };
  }, [dataUserById?.user_id, dataUserById?.entity_id, showNotification]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch((error) =>
        console.error("Notification permission request failed:", error)
      );
    }
  }, []);

  // Memoize theme toggle handler
  const handleThemeToggle = useCallback(() => {
    const newMode = theme.palette.mode === "dark" ? "light" : "dark";
    localStorage.setItem("currentMode", newMode);
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, [theme.palette.mode, setMode]);

 
  return (
    <StyledAppBar
      position="fixed"
      open={open}
      rtl={rtl}
      sx={appBarSx}
    >
      <Toolbar sx={toolbarSx}>
        {hasToken && (
          <StyledIconBtn
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={menuIconSx}
          >
            <GridMenuIcon />
          </StyledIconBtn>
        )}

        <StyledUserName component="h1" sx={userNameSx}>
          {displayName}
        </StyledUserName>

        <div className="displayNone">
          {!hasToken && <Logo />}
        </div>

        <Box flexGrow={1} />

        <div className="displayNone">
          {!hasToken && (
            <LisItem rtl={rtl} dispatch={dispatch} navigate={navigate} />
          )}
        </div>

        <Box flexGrow={1} />

        <Stack direction="row" spacing={1} alignItems="center">
          {hasToken && (
            <StyledIconBtn onClick={handleThemeToggle}>
              {isLight ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </StyledIconBtn>
          )}

          {hasToken && (
            <AccountMenu
              votes={votes}
              info={dataUserById}
              setVotes={setVotes}
              urlApi={urlApi}
              permission={permission}
              category_id={category_id}
            />
          )}

          {!hasToken && (
            <div className="showMenuList">
              <DropDownMenu navigate={navigate} />
            </div>
          )}

          {hasToken && <DrobMenueAuth navigate={navigate} dispatch={dispatch} />}
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
};

export default memo(Appbar);