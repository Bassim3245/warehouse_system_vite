import Box from "@mui/material/Box";
import {useTheme} from "@mui/material/styles";import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../../components/reusableComponent/Loader";
import { ButtonTheme } from "../../style/ButtomStyle";
import { getDataUserById } from "../../redux/userSlice/authActions";
import Edit from "./Edit";
import axios from "axios";
import { BackendUrl } from "../../redux/api/axios";
import { toast } from "react-toastify";
import "../style/userInformation.css";
import { getToken } from "../../utils/handelCookie";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import { renderListItem } from "../../utils/Function";

const PersonalProfile = () => {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const { dataUserById } = useSelector((state) => {
    return state?.user;
  });
  const dispatch = useDispatch();
  const token = getToken();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [editDataUser, setEditDataUser] = useState(false);
  const [refresh, setRefreshButton] = useState(false);
  const [ministry, setMinistry] = useState(""),
    [entities, setEntities] = useState(""),
    [username, setUsername] = useState(""),
    [email, setEmail] = useState(""),
    [phone, setPhone] = useState(""),
    [Address_id, setAddress_id] = useState(""),
    [oldPassword, setOldPassword] = useState(""),
    [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    const getDataById = async () => {
      try {
        setLoading(true);
        dispatch(getDataUserById(token));
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    getDataById();
  }, [dispatch, dataUserById?.user_id, token, refresh]);
  useEffect(() => {
    if (dataUserById) {
      setMinistry(dataUserById?.ministries);
      setEntities(dataUserById?.Entities_name);
      setUsername(dataUserById?.user_name || "N/A");
      setEmail(dataUserById?.email || "N/A");
      setPhone(dataUserById?.phone_number || "N/A");
      setAddress_id(dataUserById?.address_id || "N/A");
    }
  }, [dataUserById]);

  const handelEditData = () => {
    setEditDataUser(true);
  };

  const handelClose = () => {
    setEditDataUser(false);
  };


  const handleEdit = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", username);
      formData.append("phone", phone);
      formData.append("Address_id", Address_id);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("dataId", dataUserById?.user_id);
      const response = await axios.post(
        `${BackendUrl}/api/userEdit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );
      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        setEditDataUser(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box className="profile-container" sx={{ py: 4 }}>
      {loading && <Loader />}
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              background:
                theme.palette.mode === "dark"
                  ? maintheme.lightblack
                  : maintheme.paperColor,
              boxShadow: theme.palette.mode === "dark"
                ? '0 4px 20px rgba(0, 0, 0, 0.5)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <Box
              sx={{
                p: 3,
                background: theme.palette.mode === "dark"
                  ? 'linear-gradient(45deg, rgba(66, 66, 66, 0.8), rgba(33, 33, 33, 0.8))'
                  : 'linear-gradient(45deg, rgba(63, 81, 181, 0.8), rgba(0, 150, 136, 0.8))',
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  mb: 1,
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {dataUserById?.user_name || "المستخدم"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {dataUserById?.email || "البريد الإلكتروني غير متوفر"}
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="right"
                sx={{
                  mb: 2,
                  color: theme.palette.mode === "dark" ? "primary.light" : "primary.main",
                  borderRight: `4px solid ${theme.palette.primary.main}`,
                  pr: 2,
                }}
              >
                المعلومات الشخصية
              </Typography>

              <Box dir="rtl">
                {!editDataUser ? (
                  <Box>
                    {renderListItem(
                      "أسم الوزارة",
                      dataUserById?.ministries || "غير متوفر", theme
                    )}
                    {renderListItem(
                      "أسم الجهة",
                      dataUserById?.Entities_name || "غير متوفر", theme
                    )}
                    {renderListItem(
                      "أسم المستخدم",
                      dataUserById?.user_name || "غير متوفر"
                    )}
                    {renderListItem("البريد الإلكتروني", dataUserById?.email || "غير متوفر", theme)}
                    {renderListItem(
                      "رقم الهاتف",
                      dataUserById?.phone_number || "غير متوفر"
                    )}
                    {renderListItem("العنوان", dataUserById?.governorate_name || "غير متوفر", theme)}
                  </Box>
                ) : (
                  <Fade in={true} timeout={500}>
                    <Box>
                      <Edit
                        dataUserById={dataUserById}
                        oldPassword={oldPassword}
                        setOldPassword={setOldPassword}
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        username={username}
                        setUsername={setUsername}
                        email={email}
                        address={Address_id}
                        setAddress={setAddress_id}
                        phone={phone}
                        setPhone={setPhone}
                        entities={entities}
                        ministry={ministry}
                        setEntities={setEntities}
                        setMinistry={setMinistry}
                        theme={theme}
                        token={token}
                      />
                    </Box>
                  </Fade>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: editDataUser ? "space-between" : "flex-start",
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.mode === "dark" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                }}
                dir="rtl"
              >
                {editDataUser ? (
                  <>
                    <ButtonTheme
                      variant="contained"
                      color="error"
                      onClick={handelClose}
                      startIcon={<CloseIcon />}
                      sx={{
                        borderRadius: 8,
                        px: 3,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      إلغاء
                    </ButtonTheme>
                    <ButtonTheme
                      variant="contained"
                      color="primary"
                      onClick={handleEdit}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      sx={{
                        borderRadius: 8,
                        px: 3,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      حفظ التغييرات
                    </ButtonTheme>
                  </>
                ) : (
                  <ButtonTheme
                    onClick={handelEditData}
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{
                      borderRadius: 8,
                      px: 3,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    تعديل البيانات
                  </ButtonTheme>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PersonalProfile;
