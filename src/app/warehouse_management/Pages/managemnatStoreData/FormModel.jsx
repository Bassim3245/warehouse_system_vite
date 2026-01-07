import  { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";



import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ModeEditOutlined from "@mui/icons-material/ModeEditOutlined";

import { BackendUrl } from "../../../../redux/api/axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { ButtonTheme } from "../../../../style/ButtomStyle";
export default function StoreFormModel({
  editMode,
  dataUnitMeasuring,
  setRefreshButton,
  dataUserById,
  warehouseId,
  dataUserLab,
  hierarchyConfig,
  has_main_warehouse,
  storeData = null
}) {

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [duplicateCheck, setDuplicateCheck] = useState({
    loading: false,
    exists: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    minimum_stock_level: "",
    specification: "",
    state_id: "",
    origin: "",
    measuring_id: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log("formData", formData)
  useEffect(() => {
    if (editMode) {
      setFormData({
        code: storeData?.cod_material,
        name: storeData?.name_of_material,
        specification: storeData?.specification,
        state_id: storeData?.state_id,
        origin: storeData?.origin,
        measuring_id: storeData?.measuring_id,
        minimum_stock_level: storeData?.minimum_stock_level,
      });
    }
  }, [editMode, storeData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = "كود المنتج مطلوب";
    if (!formData.name) newErrors.name = "اسم المنتج مطلوب";
    if (!formData.measuring_id) newErrors.measuring_id = "وحدة القياس مطلوبة";


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const url = editMode ? "StorDataEdit" : "storeDataRegister";
      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/${url}`,
        {
          formData,
          entity_id: dataUserById?.entity_id,
          user_id: dataUserById?.user_id,
          ministry_id: dataUserById?.minister_id,
          storeData_id: storeData?.id,
          warehouse_id: hierarchyConfig?.has_warehouse
            ? warehouseId
            : null,
          lab_id: hierarchyConfig?.has_lab ? (!has_main_warehouse ? dataUserLab?.lab_id : null) : null,
          factory_id: hierarchyConfig?.has_factory ? (!has_main_warehouse ? dataUserLab?.factory_id : null) : null
        },
      );
      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev); // Trigger data refresh
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        {dataUserLab?.Laboratory_name}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="code"
            label="رمز المادة"
            value={formData?.code}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.code || duplicateCheck.exists}
            helperText={
              errors.code || (duplicateCheck.exists ? "يوجد رمز مادة مكرر" : "")
            }
            InputProps={{
              endAdornment: duplicateCheck.loading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="name"
            label="اسم المادة"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
            error={!!errors.name || duplicateCheck.exists}
            helperText={
              errors.name || (duplicateCheck.exists ? "يوجد اسم مادة مكرر" : "")
            }
            InputProps={{
              endAdornment: duplicateCheck.loading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required error={!!errors.measuring_id}>
            <InputLabel>الوحدة</InputLabel>
            <Select
              name="measuring_id"
              value={formData?.measuring_id}
              onChange={handleInputChange}
              label="الوحدة"
            >
              {dataUnitMeasuring?.map((item) => (
                <MenuItem key={item?.unit_id} value={item?.unit_id}>
                  {item?.measuring_unit}
                </MenuItem>
              ))}
            </Select>
            {errors.measuring_id && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1 }}
              >
                {errors.measuring_id}
              </Typography>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="minimum_stock_level"
            label="الحد الادنى للمخزون"
            type="number"
            value={formData.minimum_stock_level}
            onChange={handleInputChange}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="specification"
            label="المواصفة الفنية"
            type="text"
            value={formData.specification}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="origin"
            label="المنشأ"
            type="text"
            value={formData.origin}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>
  );
  const renderFormActions = () => (
    <>
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
    </>
  );
  return (
    <div>
      {!editMode && (
        <Tooltip title="رفع مادة جديدة">
          <ButtonTheme disabled={loading} onClick={handleOpen} startIcon={<AddIcon />}>
            تسجيل مادة
          </ButtonTheme>
        </Tooltip>
      )}
      {editMode && (
        <MenuItem onClick={handleOpen} disableRipple>
          <ModeEditOutlined sx={{ color: "", fontSize: "20px" }} />
          <span className="ms-2">تعديل</span>
        </MenuItem>
      )}
      <PopupForm
        title={
          editMode
            ? "تعديل منتج"
            : `${warehouseId}إضافة مادة جديد`
        }
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
