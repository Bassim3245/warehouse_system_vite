import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice/authActions";
import { getUserInformation } from "../utils/handelCookie";
const AccountActivationMessage = () => {
  const { t } = useTranslation();
  const { rtl } = useSelector((state) => state?.language);
  const dispatch = useDispatch();
  const dataUserById = getUserInformation();

  const handleLogout = () => {
    const userId = dataUserById?.user_id;
    dispatch(logoutUser(userId));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        direction: rtl?.dir === "rtl" ? "rtl" : "ltr",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              fontSize: "1.1rem",
              direction: rtl?.dir === "rtl" ? "rtl" : "ltr",
              textAlign: rtl?.dir === "rtl" ? "right" : "left",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              لم يتم تفعيل الحساب من قبل الادمن
            </Typography>
          </Alert>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 3,
              direction: rtl?.dir === "rtl" ? "rtl" : "ltr",
              textAlign: rtl?.dir === "rtl" ? "right" : "left",
              lineHeight: 1.6,
            }}
          >
            عذراً، لا يمكنك الوصول إلى النظام في الوقت الحالي. يرجى التواصل مع
            المدير لتفعيل حسابك.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 4,
              direction: rtl?.dir === "rtl" ? "rtl" : "ltr",
              textAlign: rtl?.dir === "rtl" ? "right" : "left",
            }}
          >
            بمجرد تفعيل حسابك من قبل المدير، ستتمكن من الوصول إلى جميع ميزات
            النظام.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {t("تسجيل الخروج")}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AccountActivationMessage;