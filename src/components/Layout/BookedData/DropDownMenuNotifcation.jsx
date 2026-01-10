import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken, getUserInformation } from "../../../utils/handelCookie";
import NotificationCard from "../../reusableComponent/CustomNotifictionCardComponent";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi";

export default function DropDownMenuNotifcation(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [notification, setNotification] = React.useState([]); // Initialize as empty array
  const [displayCount] = React.useState(7); // Number of notifications to display
  const navigate = useNavigate();
  const theme = useSelector((state) => state?.ThemeData?.maintheme);
  const dataUserById = getUserInformation();

  const { loading: apiLoading, fetchData } = useApi();

  const fetchDataByProjectId = React.useCallback(async () => {
    try {
      let params = {
        checkPermissionUser: props?.permission,
        category_id: props?.category_id,
      };
      console.log("params", dataUserById?.group_name !== "Admin");
      if (dataUserById?.group_name === "Admin") {
        params.entity_id = dataUserById?.entity_id;
      } else {
        params.user_id = dataUserById?.user_id;
      }
      await fetchData({
        endpoint: `/api/${props?.urlApi}`,
        method: "GET",
        params: params,
        onSuccess: (data) => {
          console.log("Notification data:", data);

          // Ensure we're setting an array, use empty array as fallback
          const notificationData = Array.isArray(data?.response)
            ? data.response
            : [];
          setNotification(notificationData);
        },

        onError: (err) => {
          console.error("Error fetching notification data:", err);
          setNotification([]); // Reset to empty array on error
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setNotification([]); // Reset to empty array on error
    }
  }, [
    fetchData,
    dataUserById?.entity_id,
    props?.urlApi,
    props?.permission,
    props?.category_id,
  ]);

  useEffect(() => {
    fetchDataByProjectId();
  }, [dataUserById?.entity_id, props?.votes, open, fetchDataByProjectId]);

  const handleClick = (event) => {
    props?.setVotes(0);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Ensure we have an array and valid data before any operations
  const safeNotification = Array.isArray(notification) ? notification : [];
  const displayedNotifications = safeNotification.slice(0, displayCount);
  const unreadCount = safeNotification.filter((item) => !item?.is_read).length;

  const handleSeeMore = () => {
    navigate("Notification");
    handleClose();
  };

  const handelNotification = async (item) => {
    try {
      const response = await axios.post(
        `${BackendUrl}/api/EditNotificationById`,
        { dataId: item?.id },
        { headers: { authorization: getToken() } }
      );
      if (response) {
        navigate(`${item?.url}`);
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="الإشعارات">
          <div className={props?.votes ? "pulse" : ""}>
            <IconButton
              size="large"
              aria-label="show notifications"
              onClick={handleClick}
              sx={{
                transition: "all 0.3s ease",
                // color: props?.votes > 0 ? theme?.secondaryColor || "#1976d2" : "inherit",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <Badge
                badgeContent={props?.votes}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: "18px",
                    minWidth: "18px",
                    padding: "0 4px",
                    boxShadow: "0 0 0 2px #fff",
                  },
                }}
              >
                {props?.votes > 0 ? (
                  <NotificationsActive
                    sx={{
                      animation: props?.votes ? "pulse 1.5s infinite" : "none",
                    }}
                  />
                ) : (
                  <NotificationsNone />
                )}
              </Badge>
            </IconButton>
          </div>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="notification-menu"
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              width: { xs: "90vw", sm: 400 },
              maxHeight: 500,
              overflowY: "auto",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
              mt: 1.5,
              borderRadius: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            الإشعارات
            {unreadCount > 0 && (
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  bgcolor: theme?.secondaryColor
                    ? `${theme.secondaryColor}15`
                    : "#e3f2fd",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {unreadCount} جديد
              </Typography>
            )}
          </Typography>
        </Box>

        {/* Loading state */}
        {apiLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {/* Empty state */}
        {!apiLoading && displayedNotifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <NotificationsNone
              sx={{ fontSize: 40, color: "text.disabled", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              لا توجد إشعارات جديدة
            </Typography>
          </Box>
        )}

        {/* Notifications list */}
        {!apiLoading && displayedNotifications.length > 0 && (
          <>
            {displayedNotifications.map((item, index) => (
              <MenuItem
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handelNotification(item);
                }}
                sx={{
                  p: 0,
                  "&:not(:last-child)": {
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                  },
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <NotificationCard
                  body={item?.message}
                  title={item?.title}
                  created_at={item?.created_at}
                  path={item?.url}
                  isRead={item?.is_read}
                  notificationId={item?.id}
                />
              </MenuItem>
            ))}
          </>
        )}

        {/* Footer */}
        {safeNotification.length > 0 && (
          <Box sx={{ p: 1.5, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
            <Button
              fullWidth
              variant="text"
              onClick={handleSeeMore}
              endIcon={<ExpandMore />}
              sx={{
                textTransform: "none",
                color: theme?.secondaryColor || "#1976d2",
              }}
            >
              عرض كل الإشعارات
            </Button>
          </Box>
        )}
      </Menu>
    </React.Fragment>
  );
}
