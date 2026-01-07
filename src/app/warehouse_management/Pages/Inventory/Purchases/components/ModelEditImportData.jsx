
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import PopupForm from "../../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../../components/reusableComponent/CustomDatePicker";
import ModeEditOutlined from "@mui/icons-material/ModeEditOutlined";
import SaveIcon from "@mui/icons-material/Save";

import dayjs from "dayjs";
import { BackendUrl } from "../../../../../../redux/api/axios";
import { toast } from "react-toastify";
import { ButtonTheme } from "../../../../../../style/ButtomStyle";
import { axiosInstance } from "../../../../../../redux/api/axiosConfig";
import usePermissionUser from "../../../../../../hooks/usePermissionUser";

function ModelEditImportData({ inventoryData, setRefreshButton }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { stateMaterial } = usePermissionUser()

  /* ------------------------------
        FORM DATA FOR EDITING
     ------------------------------ */
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    quantity: "",
    expiry_date: dayjs(),
    purchase_date: dayjs(),
    production_date: dayjs(),
    state_id: "",
    price: "",
  });

  /* ------------------------------
      LOAD DATA FOR EDITING
     ------------------------------ */
  useEffect(() => {
    setFormData({
      code: inventoryData.cod_material || "",
      name: inventoryData.name_of_material || "",
      quantity: inventoryData.quantity || "",
      price: inventoryData.price || "",
      state_id: inventoryData.state_id || "",
      expiry_date: inventoryData.expiry_date ? dayjs(inventoryData.expiry_date) : null,
      purchase_date: inventoryData.purchase_date ? dayjs(inventoryData.purchase_date) : null,
      production_date: inventoryData.production_date ? dayjs(inventoryData.production_date) : null,
    });
  }, [inventoryData]);

  /* ------------------------------
        HANDLE INPUT CHANGE
     ------------------------------ */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* ------------------------------
        HANDLE DATE CHANGE
     ------------------------------ */
  const handleDateChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  /* ------------------------------
        SUBMIT EDIT
     ------------------------------ */
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/inventory-import-edit`,
        {
          formData: formData,
          originQuantity: inventoryData?.quantity,
          inventory_id: inventoryData?.id,
          material_id: inventoryData?.material_id,
          document_id: inventoryData?.document_id,
        },
      );

      toast.success(response?.data?.message || "تم التعديل بنجاح");
      setRefreshButton((prev) => !prev);
      setOpen(false);
    } catch (err) {
      console.log("Error submitting data:", err);
      toast.error(err?.response?.data?.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  /* ------------------------------
         POPUP OPEN/CLOSE
     ------------------------------ */
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  /* ------------------------------
         FORM CONTENT
     ------------------------------ */
  const renderFormContent = useMemo(
    () => (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {/* {props?.dataUserLab?.Laboratory_name} */}
        </Typography>

        <Grid container spacing={2}>
          {/* Material Code - Read Only */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="رمز المادة"
              value={formData.code}
              fullWidth
              disabled
            />
          </Grid>

          {/* Material Name - Read Only */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="اسم المادة"
              value={formData.name}
              fullWidth
              disabled
            />
          </Grid>

          {/* Quantity */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="quantity"
              label="الكمية الواردة"
              value={formData.quantity}
              type="number"
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* Price */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              name="price"
              label="السعر"
              value={formData.price}
              type="number"
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">دينار</InputAdornment>,
              }}
            />
          </Grid>

          {/* State */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>حالة المادة</InputLabel>
              <Select
                name="state_id"
                value={formData?.state_id}
                onChange={handleInputChange}
                label="حالة المادة"
              >
                {stateMaterial?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.state_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Production Date */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDatePicker
              label="تاريخ الانتاج"
              value={formData.production_date}
              setValue={(v) => handleDateChange("production_date", v)}
              format="YYYY/MM/DD"
              haswidth
            />
          </Grid>

          {/* Expiry Date */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDatePicker
              label="تاريخ نفاذ الصلاحية"
              value={formData.expiry_date}
              setValue={(v) => handleDateChange("expiry_date", v)}
              format="YYYY/MM/DD"
              haswidth
            />
          </Grid>

          {/* Purchase Date */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomDatePicker
              label="تاريخ شراء المادة"
              value={formData.purchase_date}
              setValue={(v) => handleDateChange("purchase_date", v)}
              format="YYYY/MM/DD"
              haswidth
            />
          </Grid>
        </Grid>
      </Box>
    ),
    [formData, handleInputChange, handleDateChange]
  );

  /* ------------------------------
         FORM ACTIONS
     ------------------------------ */
  const renderFormActions = useMemo(
    () => (
      <>
        <ButtonTheme
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          تعديل
        </ButtonTheme>

        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          إغلاق
        </Button>
      </>
    ),
    [handleSubmit, loading, handleClose]
  );

  /* ------------------------------
         TRIGGER BUTTON
     ------------------------------ */
  const triggerButton = useMemo(
    () => (
      <MenuItem onClick={handleOpen} disableRipple>
        <ModeEditOutlined sx={{ fontSize: 20 }} />
        <span className="ms-2">تعديل</span>
      </MenuItem>
    ),
    [handleOpen]
  );

  /* ------------------------------
                RENDER
     ------------------------------ */
  return (
    <>
      {triggerButton}

      <PopupForm
        title="أستمارة تعديل مستند وارد"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="70%"
        content={renderFormContent}
        footer={renderFormActions}
      />
    </>
  );
}

export default React.memo(ModelEditImportData);
