import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Warehouse from "@mui/icons-material/Warehouse";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BiSolidCategory } from "react-icons/bi";
import AppsIcon from "@mui/icons-material/Apps";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

function OtherApplication({ navigate }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const menuItems = [
    {
      label: t("نظام أدارة الخزين في المخازن"),
      path: "warehouse-management",
      icon: <Warehouse sx={{ fontSize: 28 }} />,
    },
    // {
    //   label: t("نظام المواد الراكدة وبطيئة الحركة"),
    //   path: "stagnant-materials",
    //   icon: <BiSolidCategory style={{ fontSize: "28px" }} />,
    // },
    {
      label: t("اعدادات"),
      path: "customer-platform-management",
      icon: <SettingsOutlinedIcon sx={{ fontSize: 28 }} />,
    },
  ];

  return (
    <>
      <IconButton
        id="apps-button"
        aria-controls={open ? "apps-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          borderRadius: "12px",
          padding: "8px",
          transition: "all 0.2s",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <AppsIcon />
      </IconButton>

      <Menu
        id="apps-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "apps-button",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            padding: 2.5,
            borderRadius: 2,
            width: "360px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2, px: 1 }}
        >
          {t("التطبيقات")}
        </Typography>

        <Grid container spacing={1.5}>
          {menuItems.map((item, index) => (
            <Grid size={{ xs: 6 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "110px",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    borderColor: "primary.main",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={() => handleNavigate(item.path)}
              >
                <Box
                  sx={{
                    mb: 1.5,
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: "text.primary",
                  }}
                >
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Menu>
    </>
  );
}

export default OtherApplication;
