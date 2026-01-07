import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";

import { useSelector } from "react-redux";
import { 
  CheckCircleOutline, 
  ErrorOutline, 
  CloudUpload,
  TableChart,
  Visibility,
  Save,
} from "@mui/icons-material";
// SVG Component for Warehouse Illustration
const WarehouseSVG = ({ theme, isDark }) => (
  <svg
    width="300"
    height="250"
    viewBox="0 0 300 250"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background */}
    <rect width="300" height="250" fill={isDark ? "#1a1a1a" : "#f8f9fa"} rx="12" />
    
    {/* Warehouse Building */}
    <rect x="50" y="120" width="200" height="100" fill={theme.palette.primary.main} rx="4" />
    <rect x="60" y="130" width="180" height="80" fill={isDark ? "#2d2d2d" : "#ffffff"} rx="2" />
    
    {/* Roof */}
    <polygon points="40,120 150,60 260,120" fill={theme.palette.secondary.main} />
    
    {/* Windows */}
    <rect x="80" y="150" width="30" height="25" fill={theme.palette.primary.light} rx="2" />
    <rect x="130" y="150" width="30" height="25" fill={theme.palette.primary.light} rx="2" />
    <rect x="180" y="150" width="30" height="25" fill={theme.palette.primary.light} rx="2" />
    
    {/* Door */}
    <rect x="140" y="180" width="20" height="40" fill={theme.palette.primary.dark} rx="2" />
    
    {/* Boxes/Inventory */}
    <rect x="70" y="190" width="15" height="15" fill={theme.palette.warning.main} rx="1" />
    <rect x="90" y="190" width="15" height="15" fill={theme.palette.success.main} rx="1" />
    <rect x="110" y="190" width="15" height="15" fill={theme.palette.error.main} rx="1" />
    
    <rect x="190" y="190" width="15" height="15" fill={theme.palette.info.main} rx="1" />
    <rect x="210" y="190" width="15" height="15" fill={theme.palette.warning.main} rx="1" />
    
    {/* Clouds */}
    <circle cx="80" cy="40" r="12" fill={alpha(theme.palette.grey[400], 0.6)} />
    <circle cx="90" cy="35" r="15" fill={alpha(theme.palette.grey[400], 0.6)} />
    <circle cx="100" cy="40" r="10" fill={alpha(theme.palette.grey[400], 0.6)} />
    
    <circle cx="220" cy="30" r="8" fill={alpha(theme.palette.grey[400], 0.6)} />
    <circle cx="230" cy="25" r="12" fill={alpha(theme.palette.grey[400], 0.6)} />
    <circle cx="240" cy="30" r="9" fill={alpha(theme.palette.grey[400], 0.6)} />
    
    {/* Excel Icon */}
    <rect x="20" y="20" width="40" height="30" fill={theme.palette.success.main} rx="3" />
    <rect x="25" y="25" width="30" height="20" fill="white" rx="1" />
    <line x1="30" y1="30" x2="50" y2="30" stroke={theme.palette.success.main} strokeWidth="1" />
    <line x1="30" y1="35" x2="50" y2="35" stroke={theme.palette.success.main} strokeWidth="1" />
    <line x1="30" y1="40" x2="50" y2="40" stroke={theme.palette.success.main} strokeWidth="1" />
  </svg>
);

/**
 * Instructions - A modern welcome and introduction component for warehouse management system
 */
const Instructions = () => {
  const { maintheme } = useSelector((state) => state.ThemeData);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
;
  
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ width: "100%" }}>
          {/* Welcome Header */}
          {/* Main Content Section */}
          <Grid container spacing={4} dir="rtl">
            {/* Instructions Column */}
            <Grid item xs={12} md={7}>
              <Card 
                elevation={0}
                sx={{ 
                  height: "100%",
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                  >
                    <CheckCircleOutline />
                    خطوات رفع ملف Excel
                  </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <List sx={{ p: 0 }}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 0,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          1
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="تحميل قالب Excel"
                        secondary="قم بتحميل القالب المخصص وملء البيانات المطلوبة"
                        primaryTypographyProps={{ fontWeight: 600, color: theme.palette.text.primary }}
                        secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                      />
                      <TableChart sx={{ color: theme.palette.success.main, ml: 1 }} />
                    </ListItem>
                    
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 0,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.secondary.main,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          2
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="رفع الملف"
                        secondary="اختر الملف المملوء وقم برفعه إلى النظام"
                        primaryTypographyProps={{ fontWeight: 600, color: theme.palette.text.primary }}
                        secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                      />
                      <CloudUpload sx={{ color: theme.palette.info.main, ml: 1 }} />
                    </ListItem>
                    
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 0,
                        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.warning.main,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          3
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="مراجعة البيانات"
                        secondary="تأكد من صحة البيانات وقم بإجراء التعديلات اللازمة"
                        primaryTypographyProps={{ fontWeight: 600, color: theme.palette.text.primary }}
                        secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                      />
                      <Visibility sx={{ color: theme.palette.warning.main, ml: 1 }} />
                    </ListItem>
                    
                    <ListItem 
                      sx={{ 
                        py: 2,
                        px: 0,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.success.main,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          4
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary="حفظ البيانات"
                        secondary="احفظ جميع البيانات في قاعدة البيانات"
                        primaryTypographyProps={{ fontWeight: 600, color: theme.palette.text.primary }}
                        secondaryTypographyProps={{ color: theme.palette.text.secondary }}
                      />
                      <Save sx={{ color: theme.palette.success.main, ml: 1 }} />
                    </ListItem>
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
                      gap: 1
                    }}
                  >
                    <ErrorOutline sx={{ color: theme.palette.warning.main }} />
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: theme.palette.warning.main,
                        fontWeight: 500,
                      }}
                    >
                      ملاحظة مهمة: الحد الأقصى المسموح به هو 100 مادة في الملف الواحد
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* SVG Illustration Column */}
            <Grid item xs={12} md={5}>
              <Card 
                elevation={0}
                sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor: isDark 
                    ? alpha(theme.palette.background.paper, 0.4) 
                    : alpha(theme.palette.background.paper, 0.7),
                  transition: "all 0.3s ease",
                  '&:hover': {
                    transform: "scale(1.02)",
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <Box 
                  sx={{ 
                    transition: "transform 0.3s ease",
                    '&:hover': {
                      transform: "scale(1.05)"
                    }
                  }}
                >
                  <WarehouseSVG theme={theme} isDark={isDark} />
                </Box>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mt: 3,
                    textAlign: "center",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  نظام إدارة المخازن المتطور
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 1,
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    maxWidth: "250px"
                  }}
                >
                  حلول ذكية لإدارة المخازن والمواد بكفاءة وسهولة
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default Instructions;
