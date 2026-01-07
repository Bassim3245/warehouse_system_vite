import { useState, useEffect, forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ButtonTheme, VisuallyHiddenInput } from "../../../../style/ButtomStyle";
import { BackendUrl } from "../../../../redux/api/axios";
import { setLanguage } from "../../../../redux/LanguageState";
import { getDataMinistries } from "../../../../redux/MinistriesState/MinistresAction";
import { getToken } from "../../../../utils/handelCookie";
import { TextField, MenuItem } from "@mui/material";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default function ModelEdit(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { Ministries } = useSelector((state) => state?.Ministries);
  const [open, setOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState(props?.edit_data || "");
  const [dataEdit2, setDataEdit2] = useState(props?.edit_data2 || "");
  const [select, setSelect] = useState("");
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const theme = useTheme();
  const token = getToken();
  const { edit_id, edit_path, label, imageName, image_id, ministries_id } =
    props;
  useEffect(() => {
    if (Ministries?.length && ministries_id) {
      const selectedMinistry = Ministries.find(
        (item) => item.id === ministries_id
      );
      if (selectedMinistry) setSelect(selectedMinistry);
    }
  }, [Ministries, ministries_id]);

  useEffect(() => {
    dispatch(getDataMinistries());
  }, [dispatch]);

  useEffect(() => {
    const selectMinistry = select?.id;
    const updatedFormData = {
      ...(dataEdit && { dataEdit }),
      ...(selectMinistry && { selectMinistry }),
      ...(imageName && { imageName }),
      ...(image_id && { image_id }),
      ...(image && { image }),
      ...(dataEdit2 && { dataEdit2 }),
      ...(edit_id && { dataId: edit_id }),
    };
    setFormData(updatedFormData);
  }, [dataEdit, select, imageName, image_id, image, edit_id]);
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const contentType =
        label === "mainClass" ? "multipart/form-data" : "application/json";
      const response = await axios.post(
        `${BackendUrl}/api/${edit_path}`,
        formData,
        {
          headers: {
            authorization: `${token}`,
            "Content-Type": contentType,
          },
        }
      );
      if (response.data) {
        toast.success(response.data.message);
        props?.setRefresh?.((prev) => !prev);
        props?.setRefresh2?.((prev) => !prev);
        props?.setRefresh3?.((prev) => !prev);
        setOpen(false);
        props?.setOpen(false);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    }
  };
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  return (
    <div>
      <ButtonTheme onClick={handleClickOpen}>{t("edit")}</ButtonTheme>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        TransitionProps={{ timeout: 600 }}
        BackdropProps={{
          style: {
            background:
              theme.components.MuiDialog.defaultProps.BackdropProps.style.background,
            backdropFilter:
              theme.components.MuiDialog.defaultProps.BackdropProps.style.backdropFilter,
          },
        }}
      >
        <DialogTitle>{t("edit_information")}</DialogTitle>
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            margin: "10px",
          }}
          component="form"
          onSubmit={handleSubmitEdit}
        >
          <Box>
            {(label === "Entities" || label === "Ministries") && (
              <Box sx={{ mb: "20px" }}>
                <TextField
                  fullWidth
                  label={t("ministry_name")}
                  value={dataEdit}
                  onChange={(e) => setDataEdit(e.target.value)}
                />
              </Box>
            )}
            {label === "Entities" && (
              <Box sx={{ mb: "15px" }}>
                <TextField
                  fullWidth
                  select
                  label={t("select_main_category")}
                  value={select}
                  required
                  onChange={(e) => {
                    setSelect(e.target.value);
                  }}
                >
                  {Ministries?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.ministries}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}
            {label === "mainClass" && (
              <>
                <Box sx={{ mb: "15px" }}>
                  <TextField
                    fullWidth
                    label={props?.labelFelid}
                    value={dataEdit}
                    onChange={(e) => setDataEdit(e.target.value)}
                  />
                </Box>
                <ButtonTheme
                  component="label"
                  variant="contained"
                  sx={{
                    width: "100%",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                  startIcon={<CloudUploadIcon sx={{ fontSize: 40 }} />}
                >
                  {t("upload_image")}
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                </ButtonTheme>
              </>
            )}
            {label === "Governorate" ||
              (label === "editPermission" && (
                <Box sx={{ mb: "15px" }}>
                  <TextField
                    fullWidth
                    label={label === "Governorate" ? "محافظة" : "صلاحية"}
                    value={dataEdit}
                    onChange={(e) => setDataEdit(e.target.value)}
                  />
                </Box>
              ))}
            {label === "editBanner" && (
              <Box sx={{ mb: "15px" }}>
                <TextField
                  label={"عنوان الاعلان"}
                  value={dataEdit}
                  onChange={(e) => setDataEdit(e.target.value)}
                />
                <Box sx={{ mt: "15px" }}>
                  <TextField
                    fullWidth
                    label={"الوصف"}
                    value={dataEdit2}
                    onChange={(e) => setDataEdit2(e.target.value)}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>{t("close")}</Button>
          <Button onClick={handleSubmitEdit}>{t("saveChange")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
