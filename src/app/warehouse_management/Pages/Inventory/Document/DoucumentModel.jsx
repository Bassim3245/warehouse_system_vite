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
import CircularProgress from "@mui/material/CircularProgress";

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
import useDocumentFields from "../../../../../hooks/invantory/useDocumentFields";

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
    }),
    [documentTypeValue],
  );

  const [formData, setFormData] = useState(initialForm);

  /* ------------------------------
      Dynamic fields state
   ------------------------------ */
  // Holds dynamic field values: { field_id: value }
  const [dynValues, setDynValues] = useState({});

  // Get the document type to use for fetching fields
  const resolvedDocType = formData.documentType || documentType || documentTypeValue;

  const {
    fields: dynFields,
    fieldValues: loadedFieldValues,
    loadingFields,
    saveFieldValues,
  } = useDocumentFields({
    documentType: open ? resolvedDocType : null,
    documentId: editMode && open ? (documentData?.id ?? null) : null,
  });

  // Sync loaded field values into local state (edit mode)
  useEffect(() => {

    if (editMode && open && Object.keys(loadedFieldValues).length > 0) {
      setDynValues(loadedFieldValues);
    }
  }, [loadedFieldValues, editMode, open]);

  // Reset dynamic values when closing
  useEffect(() => {
    if (!open) setDynValues({});
  }, [open]);

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
      // Build dynamic field values array: [{ field_id, value }]
      const dynFieldValues = dynFields.map((f) => ({
        field_id: f.id,
        value: dynValues[f.id] ?? "",
      }));

      // Build unified payload — null-safe for optional fields
      const payload = {
        ...formData,
        entity_id,
        user_id: dataUserById?.user_id,
        factory_id: factoryId ?? null,
        lab_id: labId ?? null,
        documentId: documentData?.id ?? null,
        fieldValues: dynFieldValues,
      };

      const url = editMode ? "documentEdit" : "documentRegister";

      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/${url}`,
        payload,
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
    dynFields,
    dynValues,
    saveFieldValues,
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

        {/* ===== نوع المستند (للصادر فقط) ===== */}
        {!(documentType === "in" && !isExport) && (
          <Box sx={{ px: 2, mb: 2 }}>
            <Grid container spacing={2}>
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
            </Grid>
          </Box>
        )}

        {/* ===== الحقول الإضافية الديناميكية ===== */}
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
            معلومات إضافية
            {loadingFields && <CircularProgress size={14} sx={{ ml: 1 }} />}
          </Typography>

          {dynFields.length === 0 && !loadingFields ? (
            <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
              لا توجد حقول إضافية لهذا النوع من المستندات
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {dynFields?.map((field) => (
                <Grid key={field.id} size={{ xs: 12, sm: 6 }}>
                  {field.field_type === "textarea" ? (
                    <TextField
                      label={`${field?.field_label}${field?.is_required ? " *" : ""}`}
                      value={dynValues[field?.id] ?? ""}
                      onChange={(e) =>
                        setDynValues((prev) => ({ ...prev, [field?.id]: e.target.value }))
                      }
                      multiline
                      rows={3}
                      fullWidth
                      required={Boolean(field?.is_required)}
                    />
                  ) : field?.field_type === "date" ? (
                    <CustomDatePicker
                      label={`${field?.field_label}${field?.is_required ? " *" : ""}`}
                      value={dynValues[field?.id] ? dayjs(dynValues[field?.id]) : null}
                      setValue={(v) =>
                        setDynValues((prev) => ({
                          ...prev,
                          [field?.id]: v ? dayjs(v).format("YYYY-MM-DD") : "",
                        }))
                      }
                      format="YYYY/MM/DD"
                      haswidth
                    />
                  ) : (
                    <TextField
                      label={`${field?.field_label}${field?.is_required ? " *" : ""}`}
                      type={field?.field_type === "number" ? "number" : "text"}
                      value={dynValues[field?.id] ?? ""}
                      onChange={(e) =>
                        setDynValues((prev) => ({ ...prev, [field?.id]: e.target.value }))
                      }
                      fullWidth
                      required={Boolean(field.is_required)}
                    />
                  )}
                </Grid>
              ))}

              {/* المبلغ الإجمالي - ثابت دائماً */}
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

              {/* ملاحظات - ثابت دائماً */}
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
          )}
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
      dynFields,
      dynValues,
      loadingFields,
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
