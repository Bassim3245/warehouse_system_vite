import Row1 from "./Row1";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Stack from "@mui/material/Stack";

import { useSelector } from "react-redux";
import ReportModel from "./Report/ReportModel";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { motion } from "framer-motion";
import layoutStyle from "../../../../style/layoutStyle";
const DashboardInformation = ({ headerText, reportEntity, entity_id }) => {
  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state?.language;
  });
  const theme = useTheme();
  // Custom colors
  const headerGradient = `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 60%, ${theme.palette.secondary.dark} 100%)`;
  return (
    <Box sx={{ ...layoutStyle }}>
      <Paper
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          sx={{
            p: 2.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: headerGradient,
            color: "white",
            borderRadius: "8px 8px 0 0",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
              pointerEvents: "none",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgaWQ9InBhdHRlcm4tYmFja2dyb3VuZCIgd2lkdGg9IjQwMCUiIGhlaWdodD0iNDAwJSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwKSI+PC9yZWN0PiA8Y2lyY2xlIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGN4PSIyMCIgY3k9IjIwIiByPSIxIj48L2NpcmNsZT4gPGNpcmNsZSBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBjeD0iMCIgY3k9IjAiIHI9IjEiPjwvY2lyY2xlPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==')",
              opacity: 0.2,
              pointerEvents: "none",
            },
          }}
          dir={rtl?.dir}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            component={motion.div}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DashboardIcon
              fontSize="medium"
              sx={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                color: "white",
              }}
            />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: 0.5,
                color: "white",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -4,
                  left: rtl?.dir === "rtl" ? "auto" : 0,
                  right: rtl?.dir === "rtl" ? 0 : "auto",
                  width: "40%",
                  height: "2px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "2px",
                },
              }}
            >
              {headerText}
            </Typography>
          </Stack>

          <Fade in={true} timeout={800}>
            <Box
              sx={{ textAlign: "right" }}
              component={motion.div}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* <Tooltip title={t("التقرير")} arrow placement="top">
                      <BottomSend
                        onClick={() => navigate(`generate-report/?entity_id=${entity_id}&reportEntity=${reportEntity}`)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          fontWeight: 'bold',
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                          }
                        }}
                      >
                        <Description fontSize="small" />
                        {t("التقرير")}
                      </BottomSend>
                    </Tooltip> */}

              <ReportModel reportEntity={reportEntity} entity_id={entity_id} />
            </Box>
          </Fade>
        </Stack>

        <Box
          sx={{
            p: 3,
            backgroundColor:
              theme.palette.mode === "light"
                ? "white"
                : alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(10px)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.primary.main,
                0.2
              )}, ${alpha(theme.palette.primary.main, 0.05)})`,
              zIndex: 1,
            },
          }}
        >
          <Zoom in={true} style={{ transitionDelay: "300ms" }}>
            <Box>
              <Row1 reportEntity={reportEntity} entity_id={entity_id} />
            </Box>
          </Zoom>
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardInformation;
