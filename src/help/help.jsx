import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { BackendUrl } from "../redux/api/axios";
import { getToken } from "../utils/handelCookie";
import { getFileIcon } from "../utils/Function";
import { useSelector } from "react-redux";
import AppbarHeader from "../main/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Divider from "@mui/material/Divider";

import Card from "@mui/material/Card";

import { useSpring, animated, config } from "react-spring";

function HelpAboutProject() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [direction, setDirection] = useState("");
  const [userGuid, setUserGuid] = useState([]);
  const token = getToken();

  const { rtl } = useSelector((state) => {
    // @ts-ignore
    return state.language;
  });

  // Spring animations
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
    delay: 100
  });

  const tableAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
    delay: 300
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  }, []);

  useEffect(() => {
    setDirection(localStorage.getItem("language"));
  }, [t]);

  const fetchUserGuid = async () => {
    try {
      const url = token ? "getDataUserGuid" : "getDataUserGuidIsShowGuid";
      const response = await axios.get(`${BackendUrl}/api/${url}`, {
        headers: {
          authorization: getToken(),
          "Content-Type": "application/octet-stream",
        },
      });
      setUserGuid(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };

  React.useEffect(() => {
    fetchUserGuid();
  });

  return (
    <>
      {!getToken() && <AppbarHeader />}

      <Box
        sx={{
          py: 6,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.95), rgba(30, 30, 30, 0.95))'
            : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          position: 'relative',
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(33, 150, 243, 0.05) 0%, transparent 70%)',
            zIndex: 0
          }
        }}
        dir={direction === "ar" ? "rtl" : ""}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <animated.div style={fadeIn}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}
              >
                {t("layout.User Manual")}
              </Typography>
              <Divider sx={{
                width: '80px',
                mx: 'auto',
                height: '4px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '2px'
              }} />
            </Box>

            <animated.div style={tableAnimation}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  background: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '16px', backgroundColor: 'transparent' }}>
                  <Table sx={{
                    minWidth: 650,
                    '& .MuiTableCell-root': {
                      borderColor: alpha(theme.palette.divider, 0.5),
                      py: 2.5
                    }
                  }} dir={rtl?.dir}>
                    <TableHead>
                      <TableRow sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiTableCell-head': {
                          fontWeight: 'bold',
                          color: theme.palette.primary.main,
                          fontSize: '1rem'
                        }
                      }}>
                        <TableCell width="10%">#</TableCell>
                        <TableCell width="70%">{t("وصف")}</TableCell>
                        <TableCell width="20%" align="center">{t("الملف")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userGuid?.length > 0 ? (
                        userGuid.map((item, index) => (
                          <TableRow
                            key={item?.id}
                            sx={{
                              '&:nth-of-type(odd)': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.03),
                              },
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.07),
                              },
                              transition: 'background-color 0.3s ease'
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  backgroundColor: theme.palette.primary.main,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontWeight: 'bold'
                                }}
                              >
                                {index + 1}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{item?.description}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {getFileIcon(item?.file_name, "", "edit")}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                            <Typography variant="body1" color="text.secondary">
                              {t("No user guides available")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </animated.div>
          </animated.div>
        </Container>
      </Box>
    </>
  );
}

export default HelpAboutProject;
