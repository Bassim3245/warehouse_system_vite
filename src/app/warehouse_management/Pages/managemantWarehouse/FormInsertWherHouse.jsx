import { useCallback, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { getToken } from "../../../../utils/handelCookie";
import { hasPermission } from "../../../../utils/Function";

function WarehouseModel({
  editMode,
  token,
  setRefreshButton,
  dataUserById,
  dataUserLab,
  wareHouseData,
  has_lab,
  has_factory,
  has_warehouse,
  allow_to_manage_all_lab,
  has_branch_warehouse,
  labData,
  dataUserFactory,
  roles,
  permissionData,
}) {
  // =======================
  // STATES
  // =======================
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectLab, setSelectLab] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userWarehouse, setUserWarehouse] = useState([]);

  const { t } = useTranslation();

  // =======================
  // INITIAL FORM
  // =======================
  const defaultForm = useMemo(
    () => ({
      name: "",
      location: "",
      user_id: "",
      status: "نشط",
      code: "",
      factory_id: "",
      warehouse_type: "",
      lab_id: "",
    }),
    []
  );

  const [formData, setFormData] = useState(defaultForm);

  // =======================
  // LOAD USERS FOR SELECTED LAB
  // =======================
  const getInformationUserWarehouse = useCallback(async () => {
    setLoadingUsers(true);

    const params = new URLSearchParams();

    if (selectLab) {
      params.append("lab_id", selectLab);
    } else if (dataUserLab?.lab_id) {
      params.append("lab_id", dataUserLab?.lab_id);
    } else if (dataUserFactory?.factory_id) {
      params.append("factory_id", dataUserFactory?.factory_id);
    } else {
      if (dataUserById?.group_name === "production_manager") {
        params.append("warehouse_type", formData?.warehouse_type || "production");
      } if (dataUserById?.group_name === "warehouse_manager" || dataUserById?.group_name === "warehouse_main_manger") {
        params.append("warehouse_type", formData?.warehouse_type || "main");
      }
    }

    try {
      const res = await axiosInstance.get(
        `/api/getInformationUsersWhenSetToLab?${params.toString()}`,
        { headers: { Authorization: getToken() } }
      );

      setUserWarehouse(res.data.data || []);
    } catch (error) {
      console.error("Error fetching user warehouse:", error);
      setUserWarehouse([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [selectLab, dataUserLab?.lab_id, dataUserFactory?.factory_id, formData?.warehouse_type, dataUserById?.group_name]);

  useEffect(() => {
    getInformationUserWarehouse();
  }, [getInformationUserWarehouse]);

  // =======================
  // PRELOAD DATA FOR EDIT MODE
  // =======================
  useEffect(() => {
    if (editMode && wareHouseData) {
      setFormData({
        name: wareHouseData.name || "",
        location: wareHouseData.location || "",
        status: wareHouseData.status || "نشط",
        code: wareHouseData.code || "",
        user_id: wareHouseData.user_id || "",
        warehouse_type: wareHouseData.warehouse_type,
        factory_id: wareHouseData.factory_id || "",
        lab_id: wareHouseData.laboratory_id || "",
      });

      if (wareHouseData.laboratory_id) {
        setSelectLab(wareHouseData.laboratory_id);
      }
    }
  }, [editMode, wareHouseData]);

  // =======================
  // SYNC LAB WITH FORM
  // =======================
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_id: "",
      lab_id: selectLab,
    }));
  }, [selectLab]);

  // =======================
  // HANDLE INPUTS
  // =======================
  const handleInputChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleLabChange = useCallback((e) => {
    setSelectLab(e.target.value);
  }, []);

  // =======================
  // VALIDATION
  // =======================
  const validateFormData = useCallback(() => {
    const required = [
      { field: "name", msg: "اسم المخزن مطلوب" },
      { field: "code", msg: "رمز المخزن مطلوب" },
      { field: "location", msg: "موقع المخزن مطلوب" },
    ];

    const errors = required
      .filter((item) => !formData[item.field]?.trim())
      .map((item) => item.msg);

    return errors;
  }, [formData]);

  // =======================
  // SUBMIT (ADD/EDIT)
  // =======================
  const handleSubmit = useCallback(async () => {
    const errors = validateFormData();
    if (errors.length > 0) {
      toast.error(errors.join(", "));
      return;
    }

    setLoading(true);

    try {
      // Factory
      let factoryId = null;

      if (has_factory && !has_lab && has_warehouse) factoryId = dataUserFactory?.factory_id;
      else if (has_factory && has_lab && has_warehouse) factoryId = dataUserLab?.factory_id;
      else if (!has_factory && has_lab && has_warehouse) factoryId = null;
      else factoryId = has_factory ? dataUserFactory?.factory_id : null;

      // Lab
      let labId = null;

      if (dataUserById.group_name !== "warehouse_main_manger") {
        if (has_factory && !has_lab && has_warehouse) labId = null;
        else if (has_factory && has_lab && has_warehouse)
          labId = allow_to_manage_all_lab ? selectLab : dataUserLab?.lab_id;
        else if (!has_factory && has_lab && has_warehouse)
          labId = allow_to_manage_all_lab ? selectLab : dataUserLab?.lab_id;
        else
          labId = has_lab
            ? allow_to_manage_all_lab
              ? selectLab
              : dataUserLab?.lab_id
            : null;
      }

      // Payload
      const payload = {
        ...formData,
        user_id: formData.user_id || null,
        warehouse_id: editMode ? wareHouseData?.id : undefined,
        ministry_id: dataUserById?.minister_id,
        entity_id: dataUserById?.entity_id,
        factory_id: factoryId,
        lab_id: labId,
      };

      const endpoint = editMode
        ? `${BackendUrl}/api/warehouse/warehouseEdit`
        : `${BackendUrl}/api/warehouse/warehouseRegister`;

      const res = await axios.post(endpoint, payload, {
        headers: {
          authorization: token,
          "Content-Type": "application/json",
        },
      });

      toast.success(
        res.data.message ??
        (editMode ? "تم تحديث المخزن بنجاح" : "تم إضافة المخزن بنجاح")
      );

      setRefreshButton((prev) => !prev);
      setOpen(false);
    } catch (error) {
      console.error("Warehouse error:", error);
      toast.error(error.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    validateFormData,
    editMode,
    dataUserById,
    dataUserFactory,
    dataUserLab,
    has_lab,
    has_factory,
    has_warehouse,
    allow_to_manage_all_lab,
    selectLab,
    setRefreshButton,
    token,
    wareHouseData?.id,
  ]);

  // =======================
  // RESET FORM
  // =======================
  const resetForm = useCallback(() => {
    setFormData(defaultForm);
    setSelectLab("");
  }, [defaultForm]);
  // التحقق من صلاحية اختيار مخزن الإنتاج
  const hasProductionWarehousePermission = useMemo(() => {
    return hasPermission(roles?.allow_to_select_production_warehouse?._id, permissionData);
  }, [roles, permissionData]);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClosePopup = useCallback(() => {
    setOpen(false);
    if (!editMode) resetForm();
  }, [editMode, resetForm]);


  // =======================
  // MEMO: FORM FIELDS
  // =======================
  const renderFormContent = useMemo(
    () => (
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          {/* name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="name"
              label="اسم المخزن"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* code */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="code"
              label="رمز المخزن"
              value={formData.code}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* location */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="location"
              label="الموقع"
              value={formData?.location}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>

          {/* status */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="status"
              label="الحالة"
              value={formData?.status}
              onChange={handleInputChange}
              select
              fullWidth
            >
              <MenuItem value="نشط">نشط</MenuItem>
              <MenuItem value="تحت الصيانة">تحت الصيانة</MenuItem>
              <MenuItem value="مغلق">مغلق</MenuItem>
            </TextField>
          </Grid>

          {/* warehouse type */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="warehouse_type"
              label="نوع المخزن"
              value={formData?.warehouse_type}
              onChange={handleInputChange}
              fullWidth
              select={true}
            >

              {
                !hasProductionWarehousePermission ? (<MenuItem value="main">مخزن رئيسي</MenuItem>) : null
              }
              {/* <MenuItem value="branch">مخزن فرعي</MenuItem> */}


              {hasProductionWarehousePermission && (<MenuItem
                value="production"
                disabled={!hasProductionWarehousePermission}
                sx={{
                  opacity: !hasProductionWarehousePermission ? 0.5 : 1,
                  cursor: !hasProductionWarehousePermission ? 'not-allowed' : 'pointer',
                }}
              >

                مخزن إنتاج {!hasProductionWarehousePermission && '(غير مسموح)'}
              </MenuItem>)}
            </TextField>
          </Grid>

          {/* lab selection */}
          {(has_lab) ? (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                name="lab_id"
                label="أختر المعمل *"
                value={selectLab}
                onChange={handleLabChange}
                fullWidth
                select
                required
              >
                <MenuItem value="">
                  <em>اختر المعمل</em>
                </MenuItem>
                {labData?.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.Laboratory_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ) : null}

          {/* user selection */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="user_id"
              label="أمين المخزن"
              value={formData.user_id}
              onChange={handleInputChange}
              fullWidth
              select
              disabled={loadingUsers}
            >
              <MenuItem value="">
                <em>اختر أمين المخزن</em>
              </MenuItem>

              {userWarehouse?.length > 0
                ? userWarehouse?.map((user) => (
                  <MenuItem key={user?.user_id} value={user?.user_id}>
                    {user?.user_name}
                  </MenuItem>
                ))
                : !loadingUsers &&
                selectLab && (
                  <MenuItem disabled>
                    <em>لا يوجد مستخدمين لهذا المعمل</em>
                  </MenuItem>
                )}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    ),
    [
      formData,
      selectLab,
      userWarehouse,
      handleInputChange,
      handleLabChange,
      loadingUsers,
      labData,
      hasProductionWarehousePermission,
      has_lab
    ]
  );

  // =======================
  // MEMO FOOTER
  // =======================
  const renderFormActions = useMemo(
    () => (
      <>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "جاري الحفظ..." : editMode ? "تحديث" : "إضافة"}
        </Button>

        <Button onClick={handleClosePopup} variant="outlined" disabled={loading}>
          {t("close")}
        </Button>
      </>
    ),
    [handleSubmit, loading, editMode, handleClosePopup, t]
  );

  // =======================
  // RENDER
  // =======================
  return (
    <div>
      {!editMode && (
        <ButtonTheme startIcon={<AddIcon />} onClick={handleOpen}>
          إضافة مخزن
        </ButtonTheme>
      )}

      {editMode && (
        <MenuItem onClick={handleOpen}>
          <EditIcon sx={{ mr: 1 }} /> تعديل
        </MenuItem>
      )}

      <PopupForm
        title={editMode ? "تعديل مخزن" : "إضافة مخزن جديد"}
        open={open}
        onClose={handleClosePopup}
        setOpen={setOpen}
        width="80%"
        content={renderFormContent}
        footer={renderFormActions}
      />
    </div>
  );
}

export default WarehouseModel;
