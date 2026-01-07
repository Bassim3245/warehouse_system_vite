import { useState, useEffect, useCallback } from "react";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import Delete from "@mui/icons-material/Delete";
import Notifications from "@mui/icons-material/Notifications";
import Schedule from "@mui/icons-material/Schedule";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";

import { getToken } from "../../utils/handelCookie";
import { BackendUrl } from "../../redux/api/axios";
import axios from "axios";
import {
  CustomNoRowsOverlay,
  DeleteItem,
  getTimeAgo,
} from "../../utils/Function";
import ApproveComponent from "./ApproveComponent";
import MoreOption from "./MoreObtion";
import { useSelector } from "react-redux";
import Loader from "../../components/reusableComponent/Loader";
import { useApi } from "../../hooks/useApi";

export default function ApproveBooked() {
  const { roles, applicationPermission } = useSelector(
    (state) => state.RolesData
  );

  const token = getToken();
  const theme = useTheme();
  const [refresh, setRefresh] = useState(false);
  const [openChat, setOpenChat] = useState(null); // Store the opened chat ID
  const [message, setMessage] = useState([]);
  const [dataBooked, setBooked] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const { loading: apiLoading, fetchData } = useApi();
  const fetchDataByProjectId = useCallback(async () => {
    if (!dataUserById?.entity_id) return;
    try {
      await fetchData({
        endpoint: "/api/getDataBookedFalse",
        method: "GET",
        params: {
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.Booking_requests?._id,
          applicationPermission: applicationPermission.materialObsolete._id,
        },
        onSuccess: (data) => {
          setBooked(data?.response || []);
        },
        onError: (err) => {
          console.error("Error fetching booked data:", err);
          setBooked([]);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setBooked([]);
    }
  }, [
    fetchData,
    dataUserById?.entity_id,
    roles?.Booking_requests?._id,
    applicationPermission.materialObsolete._id,
  ]);

  useEffect(() => {
    fetchDataByProjectId();
  }, [
    fetchDataByProjectId,
    dataUserById?.entity_id,
    roles?.Booking_requests?._id,
    applicationPermission.materialObsolete._id,
  ]);

  const fetchMessages = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/getDataMessageById/${id}`,
        { headers: { authorization: token } }
      );
      setMessage(response?.data?.response || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
    setIsLoading(false);
  };

  const handleOpenChat = async (id) => {
    if (openChat === id) {
      setOpenChat(null); // Close chat if it's already open
    } else {
      setOpenChat(id); // Open the clicked chat
      await fetchMessages(id); // Fetch messages for the selected item
    }
  };

  const handleDeleteItem = async (id) => {
    await DeleteItem(
      id,
      () => setRefresh((prev) => !prev),
      null,
      token,
      "cancelRequest"
    );
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        padding: { xs: 2, sm: 3 },
        transition: "all 0.3s ease",
      }}
    >
      {apiLoading && <Loader />}

      <Box sx={{ mb: 4 }} dir="rtl">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: theme.palette.primary.main,
            position: "relative",
            display: "inline-block",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -5,
              left: 0,
              width: "40%",
              height: 3,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 2,
            },
          }}
        >
          <Notifications sx={{ mr: 1, verticalAlign: "middle" }} />
          طلبات الحجز
        </Typography>
        <Typography variant="body2" color="text.secondary">
          مراجعة وإدارة طلبات حجز المواد
        </Typography>
      </Box>

      <Box>
        {dataBooked?.length > 0 ? (
          dataBooked?.map((item, index) => (
            <Grow
              in={true}
              key={item?.book_id}
              timeout={(index + 1) * 200}
              style={{ transformOrigin: "0 0 0" }}
            >
              <Box sx={{ mb: 3 }}>
                <Paper
                  elevation={3}
                  sx={{
                    padding: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 8px 20px -12px ${alpha(
                        theme.palette.primary.main,
                        0.3
                      )}`,
                    },
                    position: "relative",
                    overflow: "hidden",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 5,
                      height: "100%",
                      backgroundColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Chip
                      icon={<Schedule fontSize="small" />}
                      label={getTimeAgo(item?.created_book_at)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: alpha(theme.palette.info.light, 0.1),
                        borderColor: alpha(theme.palette.info.main, 0.3),
                        color: theme.palette.info.dark,
                        fontWeight: 500,
                        "& .MuiChip-icon": { color: theme.palette.info.main },
                      }}
                    />
                    <Chip
                      label={`الكمية: ${item?.quantity}`}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        backgroundColor: alpha(
                          theme.palette.success.light,
                          0.1
                        ),
                        color: theme.palette.success.dark,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography
                    dir="rtl"
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      fontSize: { xs: "0.95rem", sm: "1.1rem" },
                    }}
                  >
                    {`${item?.user_name} من ${item?.Entities_name} طلب حجز ${item?.quantity} عناصر من مادة ${item?.name_material}`}
                  </Typography>

                  <Divider sx={{ mb: 2, opacity: 0.6 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => handleDeleteItem(item?.book_id)}
                        color="error"
                        size="small"
                        sx={{
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.1
                            ),
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenChat(item?.book_id)}
                        color="primary"
                        size="small"
                        sx={{
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <ChatOutlined />
                      </IconButton>
                    </Box>
                    <ApproveComponent
                      book_id={item?.book_id}
                      material_id={item?.material_id}
                      entity_Buy_id={item?.entity_Buy_id}
                      path={"ApproveBooked"}
                      setRefresh={setRefresh}
                      edit={false}
                    />
                  </Box>
                </Paper>

                {openChat === item?.book_id && (
                  <Fade in={true} timeout={500}>
                    <Box
                      sx={{
                        pr: 2,
                        pl: 2,
                        pt: 2,
                        mt: 1,
                        borderRadius: 2,
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.7
                        ),
                        backdropFilter: "blur(8px)",
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 2,
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ChatOutlined fontSize="small" sx={{ mr: 1 }} />
                        المحادثة
                      </Typography>

                      {isLoading ? (
                        <Box sx={{ p: 2, textAlign: "center" }}>
                          <Loader size={30} />
                        </Box>
                      ) : message.length > 0 ? (
                        message.map((msg, msgIndex) => (
                          <Grow
                            in={true}
                            key={msg?.message_id}
                            timeout={(msgIndex + 1) * 150}
                          >
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                mb: 1.5,
                                backgroundColor: alpha(
                                  theme.palette.background.default,
                                  0.7
                                ),
                                borderRadius: 2,
                                borderColor: alpha(theme.palette.divider, 0.5),
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.background.default,
                                    0.9
                                  ),
                                  borderColor: alpha(
                                    theme.palette.primary.main,
                                    0.3
                                  ),
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography sx={{ fontWeight: 500 }}>
                                  {msg?.message}
                                </Typography>
                                <MoreOption
                                  msgId={msg?.id}
                                  messageDe={msg?.message}
                                  setRefresh={setRefresh}
                                  setOpenChat={setOpenChat}
                                />
                              </Box>
                            </Paper>
                          </Grow>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            p: 2,
                            textAlign: "center",
                            fontStyle: "italic",
                          }}
                        >
                          لا توجد رسائل
                        </Typography>
                      )}
                    </Box>
                  </Fade>
                )}
              </Box>
            </Grow>
          ))
        ) : (
          <Fade in={true} timeout={500}>
            <Box sx={{ mt: 4 }}>
              <CustomNoRowsOverlay />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
