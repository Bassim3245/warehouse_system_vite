import * as React from "react";
import Delete from "@mui/icons-material/Delete";
import Done from "@mui/icons-material/Done";
import ExpandMore from "@mui/icons-material/ExpandMore";
import NotificationsActive from "@mui/icons-material/NotificationsActive";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import CircularProgress from "@mui/material/CircularProgress";

import {useTheme} from "@mui/material/styles";
import axios from "axios";
import { BackendUrl } from "../../redux/api/axios";
import { getToken, getUserInformation } from "../../utils/handelCookie";
import { useEffect } from "react";
import { getTimeAgo } from "../../utils/Function";
import { useNavigate } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Loader from "../../components/reusableComponent/Loader";
import { useApi } from "../../hooks/useApi";

export default function Notification({ urlApi, permission, category_id }) {
  const [refresh, setRefresh] = React.useState(false);
  const [notification, setNotification] = React.useState([]); // Initialize as empty array
  const [displayCount, setDisplayCount] = React.useState(8); // Number of notifications to display
  const [loading, setLoading] = React.useState(false);
  const token = getToken();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dataUserById = getUserInformation();
  const theme = useTheme();
  const handlePath = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BackendUrl}/api/EditNotificationById`,
        { dataId: data?.id },
        { headers: { authorization: token } }
      );
      if (response) {
        navigate(data?.url);
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    } finally {
      setLoading(false);
    }
  };
  const { loading: apiLoading, error, fetchData } = useApi();

  const fetchDataByProjectId = React.useCallback(async () => {
    if (!dataUserById?.entity_id) return;

    try {
      await fetchData({
        endpoint: `/api/${urlApi}`,
        method: "GET",
        params: {
          entity_id: dataUserById?.entity_id,
          checkPermissionUser: permission,
          category_id: category_id,
        },
        onSuccess: (data) => {
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
  }, [fetchData, dataUserById?.entity_id, urlApi, permission, category_id]);

  useEffect(() => {
    if (dataUserById?.entity_id) {
      fetchDataByProjectId();
    }
  }, [fetchDataByProjectId, dataUserById?.entity_id, refresh]);

  const handleSeeMore = () => {
    setDisplayCount((prevCount) => prevCount + 6);
  };

  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/deleteNotificationById?id=${id}`,
        { headers: { authorization: token } }
      );
      if (response) {
        toast.success(response?.data?.message);
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handelDeleteAll = async (isRead) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ms-3",
        cancelButton: "btn btn-danger",
        popup: "custom-swal-popup",
      },
      buttonsStyling: false,
    });
    try {
      const result = await swalWithBootstrapButtons.fire({
        title: isRead
          ? t("Notification.confirmDeleteRead")
          : t("Notification.confirmDeleteUnread"),
        text: t("Notification.cannotUndo"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("Notification.confirm"),
        cancelButtonText: t("Notification.cancel"),
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const response = await axios({
          method: "get",
          url: `${BackendUrl}/api/deleteNotificationById?isRead=${isRead}&&id=${dataUserById?.entity_id}`,
          headers: {
            authorization: token,
          },
        });
        if (response) {
          setRefresh((prv) => !prv);
        }
        swalWithBootstrapButtons.fire({
          title: t("deleted"),
          text: t("Notification.itemDeleted"),
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: t("Notification.cancelled"),
          text: "",
          icon: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Ensure we have an array before slicing
  const displayedNotifications = Array.isArray(notification)
    ? notification.slice(0, displayCount)
    : [];

  // Count unread notifications
  const unreadCount = notification.filter((item) => !item?.is_read).length;
  const isDark = theme.palette.mode === "dark";
  return (
    <React.Fragment>
      {apiLoading || (loading && <Loader />)}
      <Box
        sx={{
          backgroundColor:
            isDark && theme?.palette?.backgroundColorTheme?.backgroundColor,
          minHeight: "100vh",
          padding: { xs: "16px", md: "24px" },
        }}
      >
        <Card
          elevation={0}
          sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            borderRadius: 2,
            overflow: "visible",
            backgroundColor: "transparent",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header with title and notification count */}
            <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main || "#1976d2",
                  width: 40,
                  height: 40,
                  mr: 2,
                }}
              >
                <NotificationsActive />
              </Avatar>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  flex: 1,
                  color: theme.palette.primary.main || "#1976d2",
                }}
              >
                {t("Notification.platform Notification")}
                {unreadCount > 0 && (
                  <Chip
                    size="small"
                    label={`${unreadCount} ${t("Notification.new")}`}
                    sx={{
                      ml: 1,
                      bgcolor: theme.palette.primary.main
                        ? `${theme.palette.primary.main}15`
                        : "#e3f2fd",
                      color: theme.palette.primary.main || "#1976d2",
                      fontWeight: 500,
                    }}
                  />
                )}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={() => handelDeleteAll(true)}
                  sx={{
                    backgroundColor: theme.palette.primary.main || "#1976d2",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    py: 1.2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main
                        ? `${theme.palette.primary.main}dd`
                        : "#1565c0",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {t("Notification.Delete all read notifications")}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Delete />}
                  onClick={() => handelDeleteAll(false)}
                  sx={{
                    backgroundColor: theme.palette.error.main || "#f44336",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    py: 1.2,
                    boxShadow: "0 4px 12px rgba(244,67,54,0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.error.main
                        ? `${theme.palette.error.main}dd`
                        : "#d32f2f",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(244,67,54,0.25)",
                    },
                  }}
                >
                  {t("Notification.Delete all unread notifications")}
                </Button>
              </Grid>
            </Grid>

            {/* Loading state */}
            {apiLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
                <CircularProgress size={40} color="primary" />
              </Box>
            )}

            {/* Empty state */}
            {!apiLoading && displayedNotifications.length === 0 && (
              <Box sx={{ p: 5, textAlign: "center" }}>
                <NotificationsNone
                  sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t("Notification.noNotifications")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("Notification.checkBackLater")}
                </Typography>
              </Box>
            )}

            {/* Notifications list */}
            {!apiLoading && displayedNotifications.length > 0 && (
              <Grid container spacing={2}>
                {displayedNotifications.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      elevation={item?.is_read ? 0 : 1}
                      sx={{
                        borderRadius: 2,
                        backgroundColor: item?.is_read ? "#f8f9fa" : "#ffffff",
                        borderLeft: "4px solid",
                        borderColor: item?.is_read
                          ? "#e0e0e0"
                          : theme.palette.primary.main || "#1976d2",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: item?.is_read ? 1 : 2,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <Avatar
                            sx={{
                              bgcolor: item?.is_read
                                ? "#e0e0e0"
                                : theme.palette.primary.main
                                ? `${theme.palette.primary.main}20`
                                : "#e3f2fd",
                              color: item?.is_read
                                ? "#9e9e9e"
                                : theme.palette.primary.main || "#1976d2",
                              width: 40,
                              height: 40,
                              mr: 2,
                            }}
                          >
                            {item?.is_read ? <Done /> : <NotificationsActive />}
                          </Avatar>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: item?.is_read ? 400 : 600,
                                  color: item?.is_read
                                    ? "text.secondary"
                                    : "text.primary",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item?.title || ""}
                              </Typography>

                              <Chip
                                size="small"
                                label={
                                  item?.created_at
                                    ? getTimeAgo(item?.created_at)
                                    : ""
                                }
                                sx={{
                                  ml: 1,
                                  height: 24,
                                  fontSize: "0.75rem",
                                  bgcolor: item?.is_read
                                    ? "#f0f0f0"
                                    : "#e3f2fd",
                                  color: item?.is_read
                                    ? "text.secondary"
                                    : theme.palette.primary.main || "#1976d2",
                                }}
                              />
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                mb: 1.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                lineHeight: 1.4,
                              }}
                            >
                              {item?.message ||
                                t("Notification.noNotifications")}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                              }}
                            >
                              <Button
                                size="small"
                                variant="text"
                                startIcon={
                                  item?.is_read ? <Done /> : <ReplyIcon />
                                }
                                onClick={() => handlePath(item)}
                                sx={{
                                  color:
                                    theme.palette.primary.main || "#1976d2",
                                  textTransform: "none",
                                }}
                              >
                                {item?.is_read
                                  ? t("Notification.view")
                                  : t("Notification.open")}
                              </Button>

                              {item?.is_read && (
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<Delete />}
                                  onClick={() => handleDeleteItem(item.id)}
                                  sx={{
                                    color:
                                      theme.palette.error.main || "#f44336",
                                    textTransform: "none",
                                  }}
                                >
                                  {t("delete")}
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Load more button */}
            {displayCount < notification?.length && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button
                  variant="outlined"
                  endIcon={<ExpandMore />}
                  onClick={handleSeeMore}
                  sx={{
                    borderColor: theme.palette.primary.main || "#1976d2",
                    color: theme.palette.primary.main || "#1976d2",
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main || "#1976d2",
                      backgroundColor: theme.palette.primary.main
                        ? `${theme.palette.primary.main}10`
                        : "rgba(25, 118, 210, 0.08)",
                    },
                  }}
                >
                  {t("Notification.See More")}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
}
