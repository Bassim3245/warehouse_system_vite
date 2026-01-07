import React, { useState } from "react";
import Close from "@mui/icons-material/Close";
import Email from "@mui/icons-material/Email";
import Person from "@mui/icons-material/Person";
import Search from "@mui/icons-material/Search";
import FilterList from "@mui/icons-material/FilterList";
import RestartAlt from "@mui/icons-material/RestartAlt";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";

import { toast } from "react-toastify";
import { BackendUrl } from "../../redux/api/axios";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { getToken } from "../../utils/handelCookie";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FilterDataUser({
  page,
  limit,
  setFilterDataUser,
  setRefreshButton,
  setTotalItems,
  setTotalPages,
}) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const { rtl } = useSelector((state) => state?.language);
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);

  const isDark = theme.palette.mode === "dark";

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleReset = () => {
    setEmail("");
    setName("");
  };

  const handelSearch = async (e) => {
    if (e) e.preventDefault();
    if (!email && !name) {
      toast.warning(t("Please enter at least one search criteria"));
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/getDataUserSearch?email=${email || ""
        }&name=${name}&limit=${limit}&page=${page}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      if (response && response.data) {
        setFilterDataUser(response.data.response);
        if (setTotalPages)
          setTotalPages(response?.data?.pagination?.totalPages);
        if (setTotalItems)
          setTotalItems(response?.data?.pagination?.totalItems);
        setRefreshButton((prev) => !prev);
        toast.success(t("Search completed successfully"));
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("An error occurred during search"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" startIcon={<Search />}> بحث</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        dir={rtl?.dir}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: isDark
              ? `linear-gradient(135deg, ${alpha(
                maintheme?.lightblack || "#1a2035",
                0.98
              )} 0%, ${alpha(maintheme?.lightblack || "#0f172a", 0.95)} 100%)`
              : `linear-gradient(135deg, ${alpha(
                maintheme?.paperColor || "#ffffff",
                1
              )} 0%, ${alpha("#f8f9fa", 0.98)} 100%)`,
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 24px 48px rgba(0, 0, 0, 0.6)"
              : "0 24px 48px rgba(0, 0, 0, 0.15)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
              }`,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              backgroundSize: "200% 100%",
              animation: "gradient 3s ease infinite",
            },
            "@keyframes gradient": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          },
        }}
      >
        {/* Dialog Title */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
            pt: 3,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 14px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              }}
            >
              <FilterList sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                  mb: 0.3,
                }}
              >
                {t("User Search")}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.8rem",
                  display: "block",
                }}
              >
                {t("Filter users by email or name")}
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              width: 38,
              height: 38,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
                transform: "rotate(90deg) scale(1.1)",
              },
              color: theme.palette.error.main,
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ mx: 3, opacity: 0.6 }} />

        {/* Dialog Content */}
        <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
          <Box component="form" onSubmit={handelSearch} id="search-form">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <TextField
                fullWidth
                value={email}
                label={t("Email")}
                placeholder={t("Enter email address")}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.12
                        ),
                      }}
                    >
                      <Email
                        sx={{ fontSize: 20, color: theme.palette.primary.main }}
                      />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: isDark
                      ? alpha("#fff", 0.04)
                      : alpha("#000", 0.02),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& fieldset": {
                      borderColor: isDark
                        ? alpha("#fff", 0.12)
                        : alpha("#000", 0.12),
                      borderWidth: "1.5px",
                    },
                    "&:hover": {
                      backgroundColor: isDark
                        ? alpha("#fff", 0.06)
                        : alpha("#000", 0.03),
                      "& fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: isDark
                        ? alpha("#fff", 0.08)
                        : alpha("#000", 0.04),
                      boxShadow: `0 0 0 4px ${alpha(
                        theme.palette.primary.main,
                        0.12
                      )}`,
                      "& fieldset": {
                        borderColor: theme.palette.primary.main,
                        borderWidth: "2px",
                      },
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                fullWidth
                label={t("Username")}
                placeholder={t("Enter username")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Box
                      sx={{
                        mr: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        backgroundColor: alpha(
                          theme.palette.secondary.main,
                          0.12
                        ),
                      }}
                    >
                      <Person
                        sx={{
                          fontSize: 20,
                          color: theme.palette.secondary.main,
                        }}
                      />
                    </Box>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: isDark
                      ? alpha("#fff", 0.04)
                      : alpha("#000", 0.02),
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& fieldset": {
                      borderColor: isDark
                        ? alpha("#fff", 0.12)
                        : alpha("#000", 0.12),
                      borderWidth: "1.5px",
                    },
                    "&:hover": {
                      backgroundColor: isDark
                        ? alpha("#fff", 0.06)
                        : alpha("#000", 0.03),
                      "& fieldset": {
                        borderColor: theme.palette.secondary.main,
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: isDark
                        ? alpha("#fff", 0.08)
                        : alpha("#000", 0.04),
                      boxShadow: `0 0 0 4px ${alpha(
                        theme.palette.secondary.main,
                        0.12
                      )}`,
                      "& fieldset": {
                        borderColor: theme.palette.secondary.main,
                        borderWidth: "2px",
                      },
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <Divider sx={{ mx: 3, opacity: 0.6 }} />

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            gap: 1.5,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RestartAlt />}
            disabled={isLoading}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "10px",
              borderWidth: "1.5px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.95rem",
              transition: "all 0.3s ease",
              "&:hover": {
                borderWidth: "1.5px",
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("Reset")}
          </Button>

          <Button
            variant="contained"
            type="submit"
            form="search-form"
            disabled={isLoading}
            startIcon={<Search />}
            sx={{
              py: 1.2,
              px: 3.5,
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.95rem",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              boxShadow: `0 6px 20px ${alpha(
                theme.palette.primary.main,
                0.35
              )}`,
              transition: "all 0.3s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.primary.main,
                  0.45
                )}`,
              },
              "&:active": {
                transform: "translateY(0px)",
              },
              "&.Mui-disabled": {
                background: alpha(theme.palette.primary.main, 0.3),
                color: alpha("#fff", 0.5),
              },
            }}
          >
            {isLoading ? t("Searching...") : t("Search")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
