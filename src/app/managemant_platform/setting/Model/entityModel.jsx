import React, { useCallback, useState, useMemo, useEffect } from "react";
import { BackendUrl } from "../../../../redux/api/axios";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import { getToken } from "../../../../utils/handelCookie";

const EntityModel = ({ t, Ministries, setRefresh, isEdit, company = {} }) => {
  // ============ State Management ============
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    status: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    ministry_id: "",
  });

  // ============ Handlers ============
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: company?.Entities_name,
        code: company?.code,
        type: company?.type,
        status: company?.is_active ? "active" : "inactive",
        address: company?.address,
        phone: company?.phone,
        email: company?.email,
        website: company?.website,
        description: company?.description,
        ministry_id: company?.ministries_id,
      });
    }
  }, [isEdit, company]);
  // Fix: Create stable change handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? "editEntities" : "EntitiesRegister";
      const response = await axiosInstance({
        method: "post",
        url: `${BackendUrl}/api/${url}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: getToken(),
        },
        data: { ...formData, entity_id: company.entities_id },
      });

      if (response) {
        toast.success(response?.data?.message || "تم التسجيل بنجاح");
        setRefresh((prev) => !prev);
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء التسجيل";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Memoize FormContent to prevent re-rendering and focus loss
  const FormContent = useMemo(
    () => (
      <form onSubmit={handelSubmit}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <InputLabel> اختر الوزارة *</InputLabel>
              <Select
                value={formData.ministry_id}
                onChange={handleInputChange}
                name="ministry_id"
                required
              >
                {Ministries?.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item?.ministries}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              label="اسم الشركة *"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              required
            />
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              label="كود الشركة *"
              value={formData.code}
              onChange={handleInputChange}
              name="code"
              required
            />
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <InputLabel>نوع الشركة *</InputLabel>
              <Select
                value={formData.type}
                onChange={handleInputChange}
                name="type"
                required
              >
                <MenuItem value="company_only">شركة فقط</MenuItem>
                <MenuItem value="company_warehouse">شركة + مخزن</MenuItem>
                <MenuItem value="company_factory_warehouse">
                  شركة + مصنع + مخزن
                </MenuItem>
                <MenuItem value="company_factory_lab_warehouse">
                  شركة + مصنع + معمل + مخزن
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <FormControl fullWidth>
              <InputLabel>الحالة</InputLabel>
              <Select
                value={formData.status}
                name="status"
                onChange={handleInputChange}
              >
                <MenuItem value="active">نشط</MenuItem>
                <MenuItem value="inactive">غير نشط</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              name="phone"
              label="رقم الهاتف"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              name="website"
              label="الموقع الإلكتروني"
              value={formData.website}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="العنوان"
              value={formData.address}
              name="address"
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="الوصف"
              value={formData.description}
              name="description"
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </form>
    ),
    [formData, handleInputChange, handelSubmit]
  );

  // ============ Form Actions Component ============
  // Memoize FormActions to prevent re-rendering
  const FormActions = useMemo(
    () => (
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
          size="medium"
          sx={{ minWidth: "100px" }}
        >
          {t("close")}
        </Button>

        <ButtonTheme
          variant="contained"
          color="success"
          onClick={handelSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <FolderSpecial />
            )
          }
          size="medium"
          sx={{ minWidth: "150px" }}
        >
          {loading ? "جاري الحفظ..." : "تأكيد التسجيل"}
        </ButtonTheme>
      </Stack>
    ),
    [loading, handleClose, handelSubmit, t]
  );

  // ============ Main Render ============
  return (
    <>
      {isEdit ? (
        <Tooltip title="تعديل معلومات الشركة" arrow placement="top">
          <IconButton
            size="small"
            onClick={handleOpen}
            sx={{ mr: 0.5 }}
            title="تعديل"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="تسجيل شركة جديدة" arrow placement="top">
          <ButtonTheme
            onClick={handleOpen}
            startIcon={<Add />}
            variant="contained"
            sx={{
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
                transition: "all 0.3s ease",
              },
            }}
          >
            تسجيل الشركة
          </ButtonTheme>
        </Tooltip>
      )}

      <PopupForm
        title="تسجيل جهة جديدة"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        icon={<FolderSpecial color="success" />}
        width="70%"
        content={FormContent}
        footer={FormActions}
      />
    </>
  );
};

export default EntityModel;
