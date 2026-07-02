import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import {useTheme} from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { alpha } from "@mui/material/styles";

import imageWelcome from "../../../../../assets/image/picture.png";
import { useSelector } from "react-redux";


/**
 * Instructions - A modern component for displaying Excel upload instructions
 */
const Instructions = () => {
  const { maintheme } = useSelector((state) => state.ThemeData);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: theme.shape.borderRadius * 1.5,
          backgroundColor: isDark
            ? alpha(theme.palette.primary.main, 0.05)
            : alpha(theme.palette.primary.light, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          textAlign: "center",
        }}
        dir="rtl"
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: theme.palette.primary.main,
            mb: 1,
          }}
        >
          أهلاً وسهلاً بك في منصة المواد الراكدة وبطيئة الحركة
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: "800px",
            mx: "auto",
          }}
        >
          نظام متكامل لإفارة ومتابعة المواد الراكدة وبطيئة الحركة بشكل فعال
        </Typography>
      </Paper>

      {/* Content Section */}
      <Grid container spacing={4} dir="rtl">
        {/* Instructions Column */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[3],
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: maintheme.light_purple || theme.palette.primary.main,
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CheckCircleOutline color="primary" />
                يرجى اتباع الخطوات التالية لإتمام العملية بنجاح:
              </Typography>

              <List sx={{ mt: 1 }}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ArrowForward sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="الخطوة الأولى: تحميل قالب Excel المخصص."
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ArrowForward sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="الخطوة الثانية: بعد تحميل الملف وملء المعلومات المطلوبة، يمكنك الانتقال إلى الخطوة التالية."
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.1
                    )}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ArrowForward sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="الخطوة الثالثة: مراجعة المواد وإجراء التعديلات إن لزم الأمر."
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>

                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ArrowForward sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="الخطوة الرابعة: حفظ البيانات في قاعدة البيانات."
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              </List>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: theme.shape.borderRadius,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ErrorOutline color="error" />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: theme.palette.error.main,
                    fontWeight: 500,
                  }}
                >
                  ملاحظة: يُسمح بإضافة ما يصل إلى 100 مادة فقط إلى ملف Excel.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Image Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 3,
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: isDark
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.background.paper, 0.7),
            }}
          >
            <Box
              component="img"
              src={imageWelcome}
              alt="Welcome Illustration"
              sx={{
                maxWidth: "100%",
                height: "auto",
                maxHeight: 300,
                objectFit: "contain",
                filter: isDark
                  ? "drop-shadow(0 0 8px rgba(255,255,255,0.2))"
                  : "drop-shadow(0 0 8px rgba(0,0,0,0.1))",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                mt: 3,
                textAlign: "center",
                fontWeight: 500,
                color: theme.palette.primary.main,
              }}
            >
              نظام إفارة المواد الراكدة
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Instructions;
