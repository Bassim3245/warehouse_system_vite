import { useState, useEffect, forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { BackendUrl } from "../../../../redux/api/axios";
import { setLanguage } from "../../../../redux/LanguageState";
import { getToken } from "../../../../utils/handelCookie";
import { TextField, MenuItem } from "@mui/material";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});
export default function ModelEdit(props) {
  const { edit_id, edit_path, label, edit_select, edit_value, dataMainClass } =
    props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState(edit_value || "");
  const [select, setSelect] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const token = getToken();
  useEffect(() => {
    if (dataMainClass?.length && edit_select) {
      const selectedMainClass = dataMainClass.find(
        (item) => item.mainClass_id === edit_select
      );
      if (selectedMainClass) setSelect(selectedMainClass);
    }
  }, [dataMainClass, edit_select]);
  useEffect(() => {
    const selectMainClassId = select?.mainClass_id;
    const updatedFormData = {
      ...(dataEdit && { dataEdit }),
      ...(selectMainClassId && { selectMainClassId }),
      ...(edit_id && { dataId: edit_id }),
    };
    setFormData(updatedFormData);
  }, [dataEdit, select]);
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      console.log("edit_id", edit_id);

      setLoading(true);
      const response = await axios.post(
        `${BackendUrl}/api/${edit_path}`,
        formData,
        {
          headers: {
            authorization: ` ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        toast.success(response.data.message);
        props?.setRefresh?.((prev) => !prev);
        setOpen(false);
        props?.setOpen1?.(false);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
            {label === "subClass" && (
              <>
                <Box sx={{ mb: "20px" }}>
                  <TextField
                    fullWidth
                    label={t("ministry_name")}
                    value={dataEdit}
                    onChange={(e) => setDataEdit(e.target.value)}
                  />
                </Box>
                <Box sx={{ mb: "15px" }}>
                  <TextField
                    fullWidth
                    select
                    label={t("select_main_category")}
                    value={select || ""}
                    required
                    onChange={(e) => {
                      setSelect(e.target.value);
                    }}
                  >
                    {dataMainClass?.map((option) => (
                      <MenuItem key={option?.mainClass_id} value={option?.mainClass_id}>
                        {option?.main_Class_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </>
            )}

            {label === "UintMeasuring" && (
              <>
                <Box sx={{ mb: "15px" }}>
                  <TextField
                    fullWidth
                    label={t("Stagnant.measuringUnit")}
                    value={dataEdit}
                    onChange={(e) => setDataEdit(e.target.value)}
                    onClearClick={() => setDataEdit("")}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>{t("close")}</Button>
          <Button onClick={handleSubmitEdit}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
