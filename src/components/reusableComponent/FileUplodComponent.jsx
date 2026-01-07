import { useEffect, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";

import { useTheme } from "@mui/material/styles";

import "../../style/fileUpload.css";
import wordImage from "../../assets/image/word.png";
import pdfFile from "../../assets/image/pdf_136522.png";
import { Close, CloudUpload } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

/* ============================================================
   helper: generate preview URL safely
============================================================ */
const generateUrl = (file) => URL.createObjectURL(file);

export default function FileUploadComponent({
  setFileName,
  fileName,
  label,
  setRemoveFile,
}) {
  const mainTheme = useSelector((state) => state?.ThemeData?.maintheme);
  const theme = useTheme();

  const [dragActive, setDragActive] = useState(false);
  const [fileHover, setFileHover] = useState(null);

  /* ============================================================
     cleanup URLs to prevent memory leak
  ============================================================ */
  useEffect(() => {
    return () => {
      fileName?.forEach((file) => {
        if (file instanceof File) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [fileName]);

  /* ============================================================
     Add new files
  ============================================================ */
  const handleFileChange = useCallback(
    (event) => {
      const newFiles = Array.from(event.target.files);
      if (!newFiles.length) return;

      if (newFiles.length > 4) {
        toast.error("Maximum number of files is 4.");
        return;
      }

      const validFiles = newFiles.filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/msword",
        ];

        const isValidType = validTypes.includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024;

        if (!isValidType) {
          toast.error("File type not supported.");
        }
        if (!isValidSize) {
          toast.error("File exceeds 5MB.");
        }

        if (isValidType && isValidSize) {
          file.previewUrl = generateUrl(file); // create preview URL once
          return true;
        }
        return false;
      });

      if (validFiles.length > 0) {
        setFileName((prev) => [...prev.slice(0, 4), ...validFiles]);
      }
    },
    [setFileName]
  );

  /* ============================================================
     Remove File
  ============================================================ */
  const handleRemoveFile = useCallback(
    (index) => {
      setFileName((prev) => {
        const file = prev[index];

        if (file instanceof File && file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }

        const newList = prev.filter((_, i) => i !== index);

        setRemoveFile((removed) => [...removed, file]);
        return newList;
      });
    },
    [setFileName, setRemoveFile]
  );

  /* ============================================================
     Drag & Drop optimized
  ============================================================ */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (["dragenter", "dragover"].includes(e.type)) setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files?.length) {
        handleFileChange({ target: { files: e.dataTransfer.files } });
      }
    },
    [handleFileChange]
  );

  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }, []);

  /* ============================================================
     PREVIEW MEMO
  ============================================================ */
  const filePreviewList = useMemo(
    () =>
      fileName?.map((file, index) => {
        const isImg = file.type?.startsWith("image/");
        const isPdf = file.type === "application/pdf";
        const isWord =
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword";

        return (
          <Zoom in={true} key={index} style={{ transitionDelay: `${index * 80}ms` }}>
            <Paper
              elevation={3}
              sx={{
                width: 170,
                height: 170,
                p: 1,
                position: "relative",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(66, 66, 66, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                transition: "all .3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 5 },
              }}
              onMouseEnter={() => setFileHover(index)}
              onMouseLeave={() => setFileHover(null)}
            >
              {/* Remove Button */}
              <Tooltip title="إزالة">
                <IconButton
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "white",
                    "&:hover": { transform: "rotate(90deg)" },
                  }}
                  size="small"
                >
                  <Close fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Preview */}
              {isImg && (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  style={{
                    width: "150px",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: 8,
                    transform: fileHover === index ? "scale(1.05)" : "scale(1)",
                    transition: "transform .3s",
                  }}
                />
              )}

              {isPdf && <img src={pdfFile} alt="pdf" width={90} />}

              {isWord && <img src={wordImage} alt="word" width={70} />}

              <Typography variant="caption" noWrap sx={{ maxWidth: "90%" }}>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {formatFileSize(file.size)}
              </Typography>
            </Paper>
          </Zoom>
        );
      }),
    [fileName, fileHover, handleRemoveFile, formatFileSize, theme.palette.mode]
  );

  /* ============================================================
     MAIN RETURN
  ============================================================ */
  return (
    <Fade in={true}>
      <div
        className="file-upload-container p-20 rad-10"
        style={{
          border: `3px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider
            }`,
          borderRadius: 16,
          background:
            theme.palette.mode === "dark"
              ? mainTheme.lightblack
              : mainTheme.paperColor,
          transition: "all .3s",
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Box p={1}>
          {/* Allowed Files */}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            الملفات المسموح بها
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            PNG, JPG, JPEG, PDF, DOC, DOCX (5 MB)
          </Typography>

          {/* File previews */}
          <div className="d-flex flex-wrap gap-3 mt-3">{filePreviewList}</div>

          {/* Upload box */}
          <Fade in={true}>
            <Box
              sx={{
                mt: 3,
                height: 260,
                borderRadius: 3,
                position: "relative",
                border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider
                  }`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: theme.palette.mode === "dark"
                  ? "rgba(30,30,30,.7)"
                  : "rgba(255,255,255,.7)",
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />

              <div style={{ textAlign: "center" }}>
                <CloudUpload sx={{ fontSize: 55, color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  اسحب الملف هنا أو اضغط للرفع
                </Typography>
              </div>
            </Box>
          </Fade>
        </Box>
      </div>
    </Fade>
  );
}
