import React, { useState, useCallback, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import PopupForm from "../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../components/reusableComponent/CustomDatePicker";

import { ButtonTheme } from "../../../../../style/ButtomStyle";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../../redux/api/axios";
import { getToken } from "../../../../../utils/handelCookie";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import { WarehouseIcon } from "lucide-react";
import { typeDocument } from "../../../../../constants/arrayFuction";
import useGetDataId from "../../../../../hooks/useGetDataId";

function DocumentModel({
  documentTypeValue,
  editMode,
  dataUserById,
  entity_id,
  setRefreshButton,
  lastDocumentNumber,
  filedLabel,
  documentData = {},
  wareHouseData = [],
  documentType,
  isExport,
}) {
  const { t } = useTranslation();
  const { labId, factoryId } = useGetDataId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------------------
      FORM DATA (MEMO INITIAL)
   ------------------------------ */
  const initialForm = useMemo(
    () => ({
      document_number: 1,
      document_date: dayjs(),
      beneficiary: "",
      description: "",
      total_amount: 0,
      status: "draft",
      documentType: documentTypeValue,
      warehouse_id: "",
      account_number: "",
      type_movement: "",
      type_movement_code: "",
      work_order: "",
      center_cost: "",
    }),
    [documentTypeValue],
  );

  const [formData, setFormData] = useState(initialForm);

  /* ------------------------------
      Handle change functions
   ------------------------------ */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDateChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleWarehouseChange = useCallback((event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      warehouse_id: newValue ? newValue.id : "",
    }));
  }, []);

  /* ------------------------------
      OPEN / CLOSE POPUP
   ------------------------------ */
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  /* ------------------------------
      Auto-increment document number
   ------------------------------ */
  useEffect(() => {
    if (lastDocumentNumber && open && !editMode) {
      setFormData((prev) => ({
        ...prev,
        document_number: parseInt(lastDocumentNumber) + 1,
      }));
    }
  }, [lastDocumentNumber, open, editMode]);

  /* ------------------------------
      Edit Mode → Load Data
   ------------------------------ */
  useEffect(() => {
    if (editMode && open) {
      setFormData({
        document_number: documentData?.document_number,
        document_date: dayjs(documentData?.document_date),
        beneficiary: documentData?.beneficiary,
        description: documentData?.description,
        total_amount: documentData?.total_amount,
        status: documentData?.status,
        documentType: documentData?.document_type,
        warehouse_id: documentData?.warehouse_id,
        account_number: documentData?.account_number,
        type_movement: documentData?.type_movement,
        type_movement_code: documentData?.type_movement_code,
        work_order: documentData?.work_order,
        center_cost: documentData?.center_cost,
      });
    }
  }, [editMode, open, documentData]);

  /* ------------------------------
      Auto select document type
   ------------------------------ */
  useEffect(() => {
    if (!editMode && !isExport && documentType) {
      setFormData((prev) => ({
        ...prev,
        documentType,
      }));
    }
  }, [editMode, isExport, documentType]);

  /* ------------------------------
      SUBMIT FORM
   ------------------------------ */
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const url = editMode ? "documentEdit" : "documentRegister";

      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/${url}`,
        {
          ...formData,
          entity_id,
          user_id: dataUserById?.user_id,
          factory_id: factoryId,
          lab_id: labId,
          documentId: documentData?.id ?? null,
        },
        {
          headers: {
            Authorization: getToken(),
            "Content-Type": "application/json",
          },
        },
      );

      if (response) {
        setRefreshButton((prev) => !prev);
        handleClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  }, [
    editMode,
    formData,
    entity_id,
    dataUserById,
    factoryId,
    labId,
    documentData,
    handleClose,
    setRefreshButton,
  ]);

  /* ------------------------------
      FORM CONTENT (MEMOIZED)
   ------------------------------ */
  const renderFormContent = useMemo(
    () => (
      <Box dir="rtl">
        {/* ===== الحقول الإجبارية ===== */}
        <Box
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              fontWeight: "bold",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            ★ الحقول الإجبارية
          </Typography>
          <Grid container spacing={2}>
            {/* المخزن */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <Autocomplete
                fullWidth
                options={wareHouseData}
                getOptionLabel={(opt) => opt?.name || ""}
                value={
                  wareHouseData.find((w) => w.id === formData.warehouse_id) ||
                  null
                }
                onChange={handleWarehouseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="اختر المخزن"
                    required
                    sx={{ bgcolor: "white", borderRadius: 1 }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box {...props} sx={{ display: "flex", gap: 1, p: 1 }}>
                    <WarehouseIcon size={18} />
                    <Box>
                      <Typography>{option?.name}</Typography>
                      <Typography variant="caption">
                        {option?.location} - {option?.user_name}
                      </Typography>
                    </Box>
                    <Chip
                      label={option.status}
                      color={option.status === "ممتلئ" ? "error" : "success"}
                      size="small"
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="beneficiary"
                label={filedLabel}
                value={formData?.beneficiary}
                onChange={handleInputChange}
                fullWidth
                required
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomDatePicker
                label="تاريخ المستند"
                value={formData?.document_date}
                setValue={(v) => handleDateChange("document_date", v)}
                format="YYYY/MM/DD"
                haswidth
              />
            </Grid>
          </Grid>
        </Box>

        {/* ===== الحقول الاختيارية ===== */}
        <Box
          sx={{
            p: 2,
            border: "1px dashed",
            borderColor: "grey.400",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1.5,
              fontWeight: "bold",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            معلومات إضافية (اختيارية)
          </Typography>
          <Grid container spacing={2}>
            {/* نوع المستند */}
            {!(documentType === "in" && !isExport) && (
              <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="documentType"
                  label="نوع المستند"
                  fullWidth
                  select
                  value={formData.documentType}
                  onChange={handleInputChange}
                >
                  {typeDocument
                    .filter((item) => item.value !== "in")
                    .map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
                     <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="center_cost"
                label="رقم مركز الكلفة "
                value={formData.center_cost}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            </>
            )}
            {/* رقم الحساب */}
     
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="account_number"
                label="رقم الحساب"
                value={formData.account_number}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* نوع الحركة */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="type_movement"
                label="نوع الحركة"
                value={formData.type_movement}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* رمز نوع الحركة */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="type_movement_code"
                label="رمز نوع الحركة"
                value={formData.type_movement_code}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            {/* تاريخ المستند */}

            {/* المبلغ الإجمالي */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="total_amount"
                label="المبلغ الأجمالي"
                type="number"
                value={formData.total_amount}
                fullWidth
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">دينار</InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* الملاحظات */}
            <Grid size={{ xs: 12 }}>
              <TextField
                name="description"
                label="ملاحظات"
                multiline
                rows={3}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    ),
    [
      formData,
      handleDateChange,
      handleWarehouseChange,
      wareHouseData,
      documentType,
      isExport,
      filedLabel,
    ],
  );

  /* ------------------------------
      FORM ACTIONS (MEMOIZED)
   ------------------------------ */
  const renderFormActions = useMemo(
    () => (
      <>
        <ButtonTheme
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {editMode ? t("saveChange") : t("save")}
        </ButtonTheme>

        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          {t("close")}
        </Button>
      </>
    ),
    [editMode, loading, handleSubmit, handleClose, t],
  );

  return (
    <>
      {!editMode ? (
        <ButtonTheme onClick={handleOpen}>
          <Add fontSize="small" /> <span>إنشاء مستند جديد</span>
        </ButtonTheme>
      ) : (
        <MenuItem onClick={handleOpen}>
          <Edit fontSize="small" /> تعديل
        </MenuItem>
      )}

      <PopupForm
        title="أستمارة تعريف المستند"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        content={renderFormContent}
        footer={renderFormActions}
      />
    </>
  );
}

export default React.memo(DocumentModel);
