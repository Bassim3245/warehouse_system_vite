import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import CloudUpload from "@mui/icons-material/CloudUpload";
import TableChart from "@mui/icons-material/TableChart";
import Visibility from "@mui/icons-material/Visibility";
import Save from "@mui/icons-material/Save";


/* -------------------------------------------------
   SVG Memoized Component (Prevents Heavy Re-render)
--------------------------------------------------*/
const WarehouseSVG = React.memo(({ theme, isDark }) => {
  const cloudColor = alpha(theme.palette.grey[400], 0.6);

  return (
    <svg width="300" height="250" viewBox="0 0 300 250">
      <rect width="300" height="250" fill={isDark ? "#1a1a1a" : "#f8f9fa"} rx="12" />

      {/* Building */}
      <rect x="50" y="120" width="200" height="100" fill={theme.palette.primary.main} rx="4" />
      <rect x="60" y="130" width="180" height="80" fill={isDark ? "#2d2d2d" : "#ffffff"} rx="2" />

      {/* Roof */}
      <polygon points="40,120 150,60 260,120" fill={theme.palette.secondary.main} />

      {/* Windows */}
      {[80, 130, 180].map((x) => (
        <rect key={x} x={x} y="150" width="30" height="25" fill={theme.palette.primary.light} rx="2" />
      ))}

      {/* Door */}
      <rect x="140" y="180" width="20" height="40" fill={theme.palette.primary.dark} rx="2" />

      {/* Boxes */}
      <rect x="70" y="190" width="15" height="15" fill={theme.palette.warning.main} />
      <rect x="90" y="190" width="15" height="15" fill={theme.palette.success.main} />
      <rect x="110" y="190" width="15" height="15" fill={theme.palette.error.main} />

      <rect x="190" y="190" width="15" height="15" fill={theme.palette.info.main} />
      <rect x="210" y="190" width="15" height="15" fill={theme.palette.warning.main} />

      {/* Clouds */}
      {[80, 90, 100].map((cx, i) => (
        <circle key={cx} cx={cx} cy={40 - i * 5} r={12 - i * 2} fill={cloudColor} />
      ))}
      {[220, 230, 240].map((cx, i) => (
        <circle key={cx} cx={cx} cy={30 - i * 5} r={8 + i * 2} fill={cloudColor} />
      ))}

      {/* Excel Icon */}
      <rect x="20" y="20" width="40" height="30" fill={theme.palette.success.main} rx="3" />
      <rect x="25" y="25" width="30" height="20" fill="#fff" rx="1" />
    </svg>
  );
});

/* -------------------------------------------------
   Main Component
--------------------------------------------------*/
const Instructions = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  /* -------------------------------------------------
      Memoized Steps List (prevents re-render)
  --------------------------------------------------*/
  const steps = useMemo(
    () => [
      {
        num: 1,
        title: "تحميل قالب Excel",
        desc: "قم بتحميل القالب المخصص وملء البيانات المطلوبة",
        icon: <TableChart sx={{ color: theme.palette.success.main }} />,
        color: theme.palette.primary.main,
      },
      {
        num: 2,
        title: "رفع الملف",
        desc: "اختر الملف المملوء وقم برفعه إلى النظام",
        icon: <CloudUpload sx={{ color: theme.palette.info.main }} />,
        color: theme.palette.secondary.main,
      },
      {
        num: 3,
        title: "مراجعة البيانات",
        desc: "تأكد من صحة البيانات وقم بإجراء التعديلات اللازمة",
        icon: <Visibility sx={{ color: theme.palette.warning.main }} />,
        color: theme.palette.warning.main,
      },
      {
        num: 4,
        title: "حفظ البيانات",
        desc: "احفظ جميع البيانات في قاعدة البيانات",
        icon: <Save sx={{ color: theme.palette.success.main }} />,
        color: theme.palette.success.main,
      },
    ],
    [theme]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Fade in={true} timeout={800}>
        <Grid container spacing={4} dir="rtl">
          {/* LEFT — Steps */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CheckCircleOutline />
                  خطوات رفع ملف Excel
                </Typography>
              </Box>

              <CardContent>
                <List>
                  {steps.map((step) => (
                    <ListItem
                      key={step.num}
                      sx={{
                        py: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: step.color,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                          }}
                        >
                          {step.num}
                        </Box>
                      </ListItemIcon>

                      <ListItemText
                        primary={step.title}
                        secondary={step.desc}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />

                      {step.icon}
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ErrorOutline sx={{ color: theme.palette.warning.main }} />
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    ملاحظة: الحد الأقصى هو 100 مادة في الملف الواحد
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT — Illustration */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.4 : 0.7),
              }}
            >
              <Box sx={{ mb: 2 }}>
                <WarehouseSVG theme={theme} isDark={isDark} />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                نظام إدارة المخازن المتطور
              </Typography>

              <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                حلول ذكية لإدارة المخازن والمواد بكفاءة وسهولة
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
};

export default Instructions;
