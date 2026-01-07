import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import Done from "@mui/icons-material/Done";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { BottomRoot, ButtonTheme } from "../../../../style/ButtomStyle";
import pdfIcon from "../../../../assets/image/pdf_136522.png"; // Adjust the path to your PDF icon
import WordIcon from "../../../../assets/image/word.png"; // Adjust the path to your Word icon
import "./obsolete.css";
import { getFileIcon } from "../../../../utils/Function";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function BookedForm({
  BookId,
  entity_Buy_id,
  obsoleteMaterial,
  setRefreshButton,
  dataUserById,
  file_name,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const handleFileChange = (e, setFile, setPreview) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      // Validate file type for PDF and Word documents only
      if (
        fileType === "application/pdf" ||
        fileType === "application/msword" ||
        fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        // Set preview based on file type
        if (fileType === "application/pdf") {
          setPreview(pdfIcon);
        } else if (fileType.includes("word")) {
          setPreview(WordIcon);
        }
      } else {
        setPreview(null);
        toast.error(
          "Unsupported file type. Only PDF and Word documents are allowed."
        );
      }
    }
  };
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", dataUserById?.user_id);
      formData.append("material_id", obsoleteMaterial);
      formData.append("entity_id_buy", entity_Buy_id);
      formData.append("entity_id", dataUserById?.entity_id);
      formData.append("file1", file1);
      formData.append("BookId", BookId)
      if (file2) {
        formData.append("file2", file2);
      }
      try {
        const response = await axios.post(
          `${BackendUrl}/api/stagnantMaterialsEditBooked`,
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
        toast.error(error?.response?.data?.message || t("errorOccured"));
      } finally {
        setLoading(false);
      }
    },
    [
      dataUserById,
      BookId,
      token,
      obsoleteMaterial,
      entity_Buy_id,
      file1,
      file2,
      t,
      setRefreshButton
    ]
  );
  const fileLabels = [
    {
      key: "file1",
      label: `تحميل كتاب الجهة ${dataUserById.Entities_name}`,
      setFile: setFile1,
      setPreview: setPreview1,
    },
    // {
    //   key: "file2",
    //   label: `تحميل كتاب الجهة المستفيدة ${entity_Buy_name}`,
    //   setFile: setFile2,
    //   setPreview: setPreview2,
    // },
  ];
  const renderFormContent = () => (
    <Box
      component="form"
      sx={{
        margin: "10px",
        display: "flex",
        gap: "20px",
        justifyContent: "space-around",
        flexWrap: "wrap"
      }}
    >
      {fileLabels?.map((item, index) => (
        <div key={index}>
          <div className="d-flex gap-4 flex-wrap">
            <label className="custum-file-upload" htmlFor={item.key}>
              <div className="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill=""
                  viewBox="0 0 24 24"
                >
                  <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    id="SVGRepo_tracerCarrier"
                  />
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
                <span>{t(item.label)}</span>
              </div>
              <input
                type="file"
                id={item.key}
                onChange={(e) =>
                  handleFileChange(e, item.setFile, item.setPreview)
                }
                accept=".pdf, .doc, .docx"
              />
            </label>
            {item.key === "file1" && preview1 && (
              <img src={preview1} alt="Preview" width="200px" />
            )}
          </div>
        </div>
      ))}
      <div> {getFileIcon(file_name, "", "edit")}</div>
      <div className="text-center">
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          اذا وصلت كمية المادة المعروضة الى الصفر سوف يتم حذف المادة
        </Typography>
      </div>
    </Box>
  );
  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      <ButtonTheme type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? t("loading") : t("أكمال الطلب")}
      </ButtonTheme>
    </>
  );
  return (
    <div>
      <MenuItem onClick={() => setOpen(true)} disableRipple>
        <Done style={{ color: "#1e6a99" }} />
        <span className="ms-2">{t("أكمال الطلب")}</span>
      </MenuItem>
      <PopupForm
        title={t("رفع كتاب المناقلة")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="70%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
