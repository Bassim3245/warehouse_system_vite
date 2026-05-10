import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
const WelcomeSection = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 100%)`,
  color: "white",
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
    pointerEvents: "none",
  },
}));

const FloatingCircle = styled("div")(
  ({ size = 60, delay = 0, duration = 20 }) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.08)",
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    "@keyframes float": {
      "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
      "50%": { transform: "translateY(-20px) rotate(180deg)" },
    },
  })
);
const VisionMissionBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -30,
    left: -30,
    right: -30,
    bottom: -30,
    background:
      "conic-gradient(from 0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
    borderRadius: "50%",
    animation: "rotate 10s linear infinite",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    animation: "pulse 3s ease-in-out infinite",
  },
  "@keyframes rotate": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
  "@keyframes pulse": {
    "0%, 100%": { transform: "scale(1)", opacity: 0.5 },
    "50%": { transform: "scale(1.05)", opacity: 0.8 },
  },
}));
const BackgroundCircles = () => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      zIndex: 1,
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.05)" />
      <circle cx="1100" cy="700" r="120" fill="rgba(255,255,255,0.03)" />
      <circle cx="200" cy="600" r="60" fill="rgba(255,255,255,0.08)" />
      <circle cx="1000" cy="150" r="90" fill="rgba(255,255,255,0.04)" />
      <circle cx="50" cy="400" r="40" fill="rgba(255,255,255,0.06)" />
      <circle cx="1150" cy="400" r="70" fill="rgba(255,255,255,0.05)" />
      <circle cx="300" cy="200" r="30" fill="rgba(255,255,255,0.07)" />
      <circle cx="900" cy="500" r="45" fill="rgba(255,255,255,0.04)" />
      <circle cx="150" cy="750" r="35" fill="rgba(255,255,255,0.06)" />
      <circle cx="1050" cy="50" r="25" fill="rgba(255,255,255,0.08)" />
      <circle cx="400" cy="50" r="15" fill="rgba(255,255,255,0.1)" />
      <circle cx="800" cy="100" r="20" fill="rgba(255,255,255,0.08)" />
      <circle cx="600" cy="750" r="18" fill="rgba(255,255,255,0.09)" />
      <circle cx="50" cy="700" r="12" fill="rgba(255,255,255,0.1)" />
      <circle cx="1100" cy="300" r="22" fill="rgba(255,255,255,0.07)" />
    </svg>
  </Box>
);
export default function ObsoleteMaterialSystem() {
  return (
    <div style={{ height: "100vh" }} dir="rtl">
      <WelcomeSection>
        <BackgroundCircles />
        <FloatingCircle
          style={{ top: "10%", left: "5%" }}
          size={80}
          delay={0}
          duration={15}
        />
        <FloatingCircle
          style={{ top: "20%", right: "10%" }}
          size={60}
          delay={2}
          duration={18}
        />
        <FloatingCircle
          style={{ bottom: "15%", left: "8%" }}
          size={70}
          delay={4}
          duration={20}
        />
        <FloatingCircle
          style={{ bottom: "25%", right: "5%" }}
          size={50}
          delay={1}
          duration={16}
        />

        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                fontWeight="bold"
                sx={{
                  textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                  fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" },
                  mb: 3,
                  background: "linear-gradient(45deg, #ffffff, #e3f2fd)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                نظام إدارة المواد الراكدة وبطيئة الحركة
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                الحل الأمثل لتمكين المؤسسات الحكومية من إدارة مواردها بكفاءة
                عالية
              </Typography>

              {/* Vision, Mission, Goal */}
              <VisionMissionBox>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: "#FFD700", fontWeight: "bold" }}
                >
                  الرؤية
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  أن تصبح المنصة الحل الأمثل على المستوى الوطني لإدارة المنتجات
                  والمواد الراكدة
                </Typography>
              </VisionMissionBox>

              <VisionMissionBox>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: "#FFD700", fontWeight: "bold" }}
                >
                  الرسالة
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  تمكين المؤسسات الحكومية من إدارة مواردها بشكل أكثر كفاءة مع
                  ضمان تقديم الخدمات بشكل يساهم في تقليل الفاقد وتعزيز الاستدامة
                </Typography>
              </VisionMissionBox>

              <VisionMissionBox>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: "#FFD700", fontWeight: "bold" }}
                >
                  الهدف
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  توفير منصة رقمية فعالة وشاملة لإدارة المنتجات والمواد الراكدة
                  وبطيئة الحركة في المؤسسات الحكومية
                </Typography>
              </VisionMissionBox>
            </Box>
            <Box
              sx={{
                flex: 0.8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                position: "relative",
              }}
            >
              <LogoContainer>
                <Box
                  sx={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #1976D2, #0D47A1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    zIndex: 3,
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background:
                        "linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                      borderRadius: "22px",
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: "white",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "5rem",
                        mb: 1,
                        background: "linear-gradient(45deg, #FFD700, #FFA000)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      📦
                    </Box>
                    {/* <LogoNew color={"#ffff"} /> */}
                  </Box>
                </Box>
              </LogoContainer>
            </Box>
          </Box>
        </Container>
      </WelcomeSection>
    </div>
  );
}
