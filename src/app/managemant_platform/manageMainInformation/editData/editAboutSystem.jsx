import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { setLanguage } from "../../../../redux/LanguageState";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import { toast } from "react-toastify";
import { getToken } from "../../../../utils/handelCookie";
import { TextField } from "@mui/material";
export default function ModelEdit({ aboutSystem }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dataEdit, setDataEdit] = useState("");
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (aboutSystem) {
      setTitle(aboutSystem?.title || "");
      setDataEdit(aboutSystem?.text || "");
    }
  }, [aboutSystem]);
  useEffect(() => {
    setFormData({ title, dataEdit, dataId: aboutSystem?.id });
  }, [title, dataEdit]);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BackendUrl}/api/editAboutSystem`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken()
          },
        }
      );
      if (response.data) {
        toast.success(response.data.message);
        setOpen(false);
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || t("errorOccurred");
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);

  const renderFormContent = () => (
    <Box
      sx={{ margin: "10px" }}
      component="form"
      onSubmit={handleSubmitEdit}
    >
      <Box sx={{ mb: 2, mt: 2, display: "flex", gap: 1 }} dir="rtl">
        <TextField
          label={t("title")}
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          onClearClick={() => setTitle("")}
        />
        <TextField
          label={t("text")}
          haswidth
          value={dataEdit}
          required
          onChange={(e) => setDataEdit(e.target.value)}
          onClearClick={() => setDataEdit("")}
        />
      </Box>
    </Box>
  );

  const renderFormActions = () => (
    <>
      <Button onClick={handleClose}>{t("close")}</Button>
      <Button onClick={handleSubmitEdit}>{t("saveChange")}</Button>
    </>
  );
  return (
    <div>
      <ButtonTheme onClick={handleClickOpen}>{t("edit")}</ButtonTheme>
      <PopupForm
        title={t("edit_information")}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
