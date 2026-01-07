import { BackendUrFile, BackendUrl } from "../redux/api/axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

import { useTheme } from "@mui/material/styles"; import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import wordImage from "../assets/image/word.png";
import pdfWord from "../assets/image/pdf_136522.png";
import { Download } from "@mui/icons-material";
import { getToken } from "./handelCookie";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import {
  DownloadButton,
  FileContainer,
  FileImage,
} from "../style/generalStyle";

const token = getToken();
// Styled components for file icons

/**
 * Handle file download
 * @param {string} fileName - Name of the file to download
 */
const handleDownload = (fileName) => {
  try {
    // Create a link element
    const link = document.createElement("a");
    link.href = `${BackendUrFile}/${fileName}`;
    link.setAttribute("download", fileName.split("/").pop());
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم بدء التحميل");
  } catch (error) {
    console.error("Error downloading file:", error);
    toast.error("حدث خطأ أثناء تحميل الملف");
  }
};

/**
 * Get file icon based on file extension
 * @param {string} fileName - Name of the file
 * @param {string} fileInfo - Additional file information
 * @param {string} label - Label for context (e.g., "edit")
 * @returns {JSX.Element} - Rendered file icon with download button
 */
export function getFileIcon(fileName, fileInfo, label) {
  let fileExtension;
  if (label === "edit") {
    fileExtension = fileName;
  } else {
    fileExtension = fileInfo;
  }

  const extension = fileExtension?.split(".")?.pop()?.toLowerCase();

  if (extension === "pdf") {
    return (
      <FileContainer>
        <Tooltip
          title="تحميل الملف"
          TransitionComponent={Fade}
          placement="top"
          arrow
        >
          <DownloadButton
            size="small"
            onClick={() => handleDownload(fileName)}
            aria-label="تحميل"
          >
            <Download fontSize="small" />
          </DownloadButton>
        </Tooltip>
        <FileImage src={pdfWord} alt="PDF Icon" type="pdf" />
        <Box sx={{ fontSize: "0.75rem", color: "#666", mt: 1 }}>ملف PDF</Box>
      </FileContainer>
    );
  } else if (extension === "docx") {
    return (
      <FileContainer>
        {token && (
          <Tooltip
            title="تحميل الملف"
            TransitionComponent={Fade}
            placement="top"
            arrow
          >
            <DownloadButton
              size="small"
              onClick={() => handleDownload(fileName)}
              aria-label="تحميل"
            >
              <Download fontSize="small" />
            </DownloadButton>
          </Tooltip>
        )}
        <FileImage src={wordImage} alt="DOCX Icon" type="docx" />
        <Box sx={{ fontSize: "0.75rem", color: "#666", mt: 1 }}>مستند Word</Box>
      </FileContainer>
    );
  } else if (
    extension === "png" ||
    extension === "jpg" ||
    extension === "jpeg"
  ) {
    return (
      <FileContainer>
        {token && (
          <Tooltip
            title="تحميل الملف"
            TransitionComponent={Fade}
            placement="top"
            arrow
          >
            <DownloadButton
              size="small"
              onClick={() => handleDownload(fileName)}
              aria-label="تحميل"
            >
              <Download fontSize="small" />
            </DownloadButton>
          </Tooltip>
        )}
        <FileImage
          src={
            label === "edit" ? `${BackendUrFile}/${fileName}` : `${fileInfo}`
          }
          alt="Image"
          type="image"
          sx={{
            objectFit: "cover",
            height: "150px",
          }}
        />
        <Box sx={{ fontSize: "0.75rem", color: "#666", mt: 1 }}>
          صورة {extension.toUpperCase()}
        </Box>
      </FileContainer>
    );
  } else {
    return null; // If the file type is not supported
  }
}

export const DeleteItem = async (
  _id,
  setRefreshButton,
  setAnchorEl,
  token,
  url,
  checkPermissionUser,
  applicationPermission
) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success ms-3",
      cancelButton: "btn btn-danger",
      popup: "custom-swal-popup", // Add this line
    },
    buttonsStyling: false,
  });
  try {
    const result = await swalWithBootstrapButtons.fire({
      title: "هل انت متأكد من الحذف ؟",
      text: "! لن تتمكن من التراجع عن الحذف ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "موافق",
      cancelButtonText: "تراجع",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      // @ts-ignore
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/${url}?id=${_id}&checkPermissionUser=${checkPermissionUser}&applicationPermission=${applicationPermission}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response) {
        setRefreshButton((prv) => !prv);
        setAnchorEl(null);
        // window.location.reload();
      }
      swalWithBootstrapButtons.fire({
        title: "! تم الحذف ",
        text: "تم حذف القيد",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalWithBootstrapButtons.fire({
        title: "تم التراجع",
        text: "",
        icon: "error",
      });
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

export function CustomNoRowsOverlay() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <StyledGridOverlay theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "2rem",
          textAlign: "center",
          animation: "fadeIn 0.8s ease-in-out",
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
              theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(0,0,0,0) 70%)"
                : "radial-gradient(circle, rgba(25,118,210,0.05) 0%, rgba(255,255,255,0) 70%)",
            zIndex: 0,
            animation: "pulse 4s ease-in-out infinite",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "180px",
            height: "180px",
            mb: 3,
            animation: "float 3s ease-in-out infinite",
            zIndex: 1,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "120px",
              height: "20px",
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(0,0,0,0.1)",
              filter: "blur(8px)",
              animation: "shadowPulse 3s ease-in-out infinite",
              zIndex: -1,
            },
          }}
        >
          <svg
            width="180"
            height="180"
            viewBox="0 0 184 152"
            aria-hidden
            focusable="false"
            style={{
              filter:
                theme.palette.mode === "dark"
                  ? "drop-shadow(0 0 12px rgba(25,118,210,0.3))"
                  : "drop-shadow(0 6px 16px rgba(0,0,0,0.15))",
              transition: "filter 0.3s ease",
            }}
          >
            <g fill="none" fillRule="evenodd">
              <g transform="translate(24 31.67)">
                <ellipse
                  cx="67.797"
                  cy="106.89"
                  rx="67.797"
                  ry="12.668"
                  fill={
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.1)"
                  }
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                />
                <path
                  d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                  fill={theme.palette.mode === "dark" ? "#424242" : "#aeb8c2"}
                />
                <path
                  d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                  fill={theme.palette.mode === "dark" ? "#303030" : "#f5f5f7"}
                />
                <path
                  d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                  fill={theme.palette.mode === "dark" ? "#1976d2" : "#1976d2"}
                  style={{ opacity: theme.palette.mode === "dark" ? 0.7 : 0.8 }}
                />
              </g>
              <path
                d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                fill={theme.palette.mode === "dark" ? "#1976d2" : "#1976d2"}
                style={{ opacity: theme.palette.mode === "dark" ? 0.7 : 0.8 }}
              />
              <g transform="translate(149.65 15.383)">
                <ellipse
                  cx="20.654"
                  cy="3.167"
                  rx="2.849"
                  ry="2.815"
                  fill="#fff"
                />
                <path
                  d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"
                  fill="#fff"
                />
              </g>
            </g>
          </svg>
        </Box>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.primary.main,
              mb: 1,
              animation: "fadeIn 1s ease-in-out",
              animationDelay: "0.3s",
              animationFillMode: "both",
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 0 8px rgba(25,118,210,0.3)"
                  : "none",
              letterSpacing: "0.5px",
            }}
          >
            {t("NotFoundData")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(0,0,0,0.6)",
              maxWidth: "320px",
              animation: "fadeIn 1s ease-in-out",
              animationDelay: "0.5s",
              animationFillMode: "both",
              lineHeight: 1.6,
              mx: "auto",
              mt: 1,
            }}
          >
            {t("NoDataAvailable")}
          </Typography>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.5;
          }
        }

        @keyframes shadowPulse {
          0% {
            opacity: 0.5;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translateX(-50%) scale(1.1);
          }
          100% {
            opacity: 0.5;
            transform: translateX(-50%) scale(1);
          }
        }
      `}</style>
    </StyledGridOverlay>
  );
}

export function getTimeAgo(date) {
  const parsedDate = new Date(date);
  // Check if parsedDate is valid
  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }
  // Calculate the time ago with a suffix
  return formatDistanceToNow(date, { addSuffix: true });
}

// to check permission
export const hasPermission = (role, permissions) => {
  return Array.isArray(permissions) && permissions.includes(role);
};

// render menu
export const renderMenuItem = (key, onClick, IconComponent, text) => (
  <MenuItem key={key} onClick={onClick} disableRipple>
    <IconComponent size="large" style={{ color: "#1e6a99" }} />
    <span className="ms-2">{text}</span>
  </MenuItem>
);

// get only image
export const isImageFile = (images) => {
  if (!images || images.length === 0) return null;
  for (let i = 0; i < images.length; i++) {
    const fileName = images[i]?.file_name;
    const extension = fileName?.split(".").pop().toLowerCase(); // Get the file extension
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
        return `${BackendUrFile}/${fileName}`; // Return the first valid image URL
      case "pdf":
      case "doc":
      case "docx":
        // Skip PDF and Word files
        continue; // Skip this file and continue to the next iteration
      default:
        continue; // Skip other unknown file types
    }
  }
  return null; // Return null if no valid image file is found
};

export const renderListItem = (label, value, theme) => (
  <Grow in={true} timeout={600} style={{ transformOrigin: "center right" }}>
    <Grid
      container
      spacing={2}
      className="profile-item"
      sx={{
        py: 1.5,
        borderBottom: `1px solid ${theme?.palette?.mode === "dark"
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.1)"
          }`,
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor:
            theme?.palette?.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
        },
      }}
    >
      <Grid item xs={5}>
        <Typography variant="body1" fontWeight={600} textAlign="right">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Typography
          variant="body1"
          color={
            theme?.palette?.mode === "dark" ? "primary.light" : "primary.main"
          }
        >
          {value}
        </Typography>
      </Grid>
    </Grid>
  </Grow>
);

export const getHeaderStyle = (theme) => ({
  bgcolor: theme?.palette?.primary?.main,
  color: theme?.palette?.primary?.contrastText,
});
