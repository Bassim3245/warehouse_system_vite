import  { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
const AddFactoriesForm = ({
  editMode,
  setRefreshButton,
  dataUserById,
  factoryData,
  dataUsers,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    Factories_name: "",
    location: "",
    status: "نشط",
    description: "",
    warehouse_id: "",
    user_id: "",
  });

  useEffect(() => {
    if (factoryData && editMode) {
      setFormData({
        Factories_name: factoryData?.Factories_name || "",
        location: factoryData?.location || "",
        status: factoryData?.status || "نشط",
        description: factoryData?.description || "",
        warehouse_id: factoryData?.warehouse_id || "",
        user_id: factoryData?.user_id || "",
      });
    }
  }, [factoryData, editMode]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const payload = {
        Factories_name: formData.Factories_name.trim(),
        location: formData.location.trim(),
        status: formData.status,
        description: formData.description.trim(),
        warehouse_id: formData.warehouse_id,
        user_id: formData?.user_id,
        entity_id: dataUserById?.entity_id,
        id: factoryData?.id, // Use this if editing
      };
      const endpoint = editMode
        ? `${BackendUrl}/api/warehouse/FactoriesEdit`
        : `${BackendUrl}/api/warehouse/FactoriesRegister`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          authorization: `${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      if (response.data.message) {
        toast.success(response.data.message);
        setRefreshButton((prev) => !prev); // Trigger refresh
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log("Error during submission:", error);
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      status: "active",
      description: "",
      warehouse_id: "",
      user_id: "",
    });
    setErrors({});
  };

  const renderFormContent = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label={t("أسم المصنع")}
            name="Factories_name"
            value={formData.Factories_name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label={t("الموقع")}
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            required
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{t("الحالة")}</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={!!errors.status}
              required
              label={t("الحالة")}
            >
              <MenuItem value="نشط">{t("نشط")}</MenuItem>
              <MenuItem value="غير نشط">{t("غير نشط")}</MenuItem>
              <MenuItem value="تحت الصيانة">{t("تحت الصيانة")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>مسؤل المصنع</InputLabel>
            <Select
              name="user_id"
              value={formData.user_id}
              label="مسؤل المصنع"
              onChange={handleChange}
            >
              {dataUsers
                ?.filter((user) => user?.group_id === 8) // Exclude user with id 254
                .map((user) => (
                  <MenuItem key={user?.id} value={user?.id}>
                    {user?.user_name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{t("المستودع")}</InputLabel>
            <Select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              error={!!errors.warehouse_id}
              required
              label={t("المستودع")}
            >
              {wareHouseData?.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>{t("المخزن")}</InputLabel>
            <Select
              name="state_id"
              value={formData.state_id}
              onChange={handleChange}
              error={!!errors.state_id}
              required
              label={t("المخزن")}
            >
              {wareHouseData?.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("الوصف")}
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            variant="outlined"
          />
        </Grid>
      </Grid>
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          {t("اضافة المصنع")}
        </Button>
      )}
      {editMode && (
        <MenuItem onClick={handleOpen} color="primary">
          <EditIcon /> تعديل
        </MenuItem>
      )}
      <PopupForm
        title={editMode ? t("تعديل معلومات المصنع") : t("أضافة معلومات المصنع")}
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        width="100%"
        maxWidth="sm"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};

export default AddFactoriesForm;
