import  { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { BackendUrl } from "../../../../redux/api/axios";
import SaveIcon from "@mui/icons-material/Save";
import { getToken } from "../../../../utils/handelCookie";
import { ButtonTheme } from "../../../../style/ButtomStyle";
const AddLabForm = ({
  editMode,
  dataUserById,
  setRefreshButton,
  dataUsers,
  dataUserFactor,
  labData,
  factory_id,
  has_factory,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: "",
    status: "",
    name: "",
    location: "",
    specialization: "",
    description: "",
    factory_id: factory_id,
  });
  useEffect(() => {
    if (labData && editMode) {
      setFormData({
        user_id: labData?.user_id || "",
        status: labData?.status || "نشط",
        name: labData?.Laboratory_name || "",
        location: labData?.location || "",
        specialization: labData?.specialization || "",
        description: labData?.description || "",
      });
    }
  }, [labData, editMode]);
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const payload = {
        id: labData?.id,
        name: formData?.name,
        status: formData?.status,
        factory_id: has_factory ? dataUserFactor?.factory_id : null,
        specialization: formData?.specialization,
        location: formData?.location,
        description: formData?.description,
        user_id: formData?.user_id || dataUserById?.user_id,
        entity_id: formData?.entity_id || dataUserById?.entity_id,
      };
      const endpoint = editMode
        ? `${BackendUrl}/api/warehouse/LaboratoriesEdit`
        : `${BackendUrl}/api/warehouse/LabRegister`;

      const response = await axios.post(endpoint, payload, {
        headers: {
          authorization: `${getToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      user_id: dataUserById?.user_id || "",
      entity_id: dataUserById?.entity_id || "",
      name: "",
      location: "",
      status: "نشط",
      specialization: "",
      description: "",
      // factory_id: "",
    });
    setErrors({});
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const renderFormContent = () => (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      dir="rtl"
    >
      <Typography> مصنع : {dataUserFactor?.Factories_name}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label={t("أسم المعمل")}
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          dir="rtl"
          margin="normal"
          required
        />

        <FormControl fullWidth>
          <InputLabel>{t("الحالة")}</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            error={!!errors.status}
            required
            label={t("الحالة")}
            dir="rtl"
          >
            <MenuItem value="نشط">{t("نشط")}</MenuItem>
            <MenuItem value="غير نشط">{t("غير نشط")}</MenuItem>
            <MenuItem value="تحت الصيانة">{t("تحت الصيانة")}</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>مسؤل المعمل</InputLabel>
          <Select
            name="user_id"
            value={formData.user_id}
            label="مسؤل المعمل"
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
            dir="rtl"
          >
            {dataUsers
              ?.filter((user) => user?.group_id === 7)
              ?.map((user) => (
                <MenuItem key={user?.id} value={user?.id}>
                  {user?.user_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label={t("التخصص")}
          dir="rtl"
          name="specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t("الموقع")}
          dir="rtl"
          name="location"
          value={formData?.location}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t("الوصف")}
          name="description"
          dir="rtl"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.value })
          }
          margin="normal"
          multiline
          rows={3}
        />
      </Box>
    </Box>
  );

  const renderFormActions = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        startIcon={<SaveIcon />}
      >
        {editMode ? t("saveChange") : t("save")}
      </Button>
      <Button onClick={handleClose} variant="outlined" disabled={loading}>
        {t("close")}
      </Button>
    </Box>
  );

  return (
    <div>
      {!editMode && (
        <ButtonTheme startIcon={<AddIcon />} onClick={handleOpen}>
          {t("أضافة معمل جديد")}
        </ButtonTheme>
      )}
      {editMode && (
        <MenuItem onClick={handleOpen} color="primary">
          <EditIcon /> {t("تعديل")}
        </MenuItem>
      )}
      <PopupForm
        title={editMode ? t("تعديل المعمل") : t("أضافة المعمل")}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        maxWidth="sm"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};

export default AddLabForm;
