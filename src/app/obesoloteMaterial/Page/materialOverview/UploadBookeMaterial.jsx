import { useState, useCallback, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import { Close, Upload } from "@mui/icons-material";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { BottomRoot } from "../../../../style/ButtomStyle";
import { getFileIcon } from "../../../../utils/Function";
import pdfIcon from "../../../../assets/image/pdf_136522.png";
import WordIcon from "../../../../assets/image/word.png";
import { ButtonTheme } from "../../../../style/ButtomStyle";

export default function UploadBook({
  BookId,
  setRefreshButton,
  bookingDataM,
  maintheme,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(bookingDataM?.file_name || null);
  const [preview, setPreview] = useState(null);
  const token = getToken();
  useEffect(() => {
    if (file) {
      const fileType = file.type;
      if (fileType === "application/pdf") setPreview(pdfIcon);
      else if (
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        setPreview(WordIcon);
      else {
        setPreview(null);
        toast.error(t("Unsupported file type"));
      }
    }
  }, [file, t]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile || null);
  };

  const handleSubmit = useCallback(
    async (event, isEdit = false) => {
      event.preventDefault();
      setLoading(true);

      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("BookId", BookId);

      try {
        const response = await axios.post(
          `${BackendUrl}/api/UploadBookForEntityBuy`,
          formData,
          {
            headers: {
              authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response) {
          toast.success(response.data.message);
          setRefreshButton((prev) => !prev);
          setOpen(false);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
    [BookId, token, file, setRefreshButton, t]
  );

  const removeFile = () => setFileName("");

  const renderFormContent = () => (
    <Box
      component="form"
      sx={{
        margin: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <label htmlFor="file" className="custum-file-upload">
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
            <g id="SVGRepo_iconCarrier">
              <path
                fill=""
                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                clipRule="evenodd"
                fillRule="evenodd"
              />
            </g>
          </svg>
        </div>
        <div className="text">
          <span>{t("أضغط لرفع كتاب ")}</span>
        </div>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          accept=".pdf"
        />
      </label>
      {fileName ? (
        <div>
          <IconButton
            color="primary"
            onClick={removeFile}
            style={{
              color: maintheme?.iconColor,
              cursor: "pointer",
              backgroundColor: "#ebebeba0",
              borderRadius: "50%",
            }}
          >
            <Close />
          </IconButton>
          {getFileIcon(fileName, "", "edit")}
        </div>
      ) : (
        preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100px", height: "100px", marginTop: "10px" }}
          />
        )
      )}
    </Box>
  );
  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      <ButtonTheme
        type="submit"
        onClick={(e) => handleSubmit(e, Boolean(bookingDataM?.file_name))}
        disabled={loading}
      >
        {loading
          ? t("loading")
          : t(bookingDataM?.file_name ? "saveChange" : "رفع")}
      </ButtonTheme>
    </>
  );
  return (
    <div>
      <ButtonTheme
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-lg btn-block"
      >
        {t("رفع الكتاب الرسمي")} <Upload />
      </ButtonTheme>
      <PopupForm
        title={t("رفع كتاب المناقلة")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
