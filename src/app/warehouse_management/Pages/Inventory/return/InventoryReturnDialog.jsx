import React, { useState, useCallback, useMemo, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Replay from "@mui/icons-material/Replay";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import CustomDatePicker from "../../../../../components/reusableComponent/CustomDatePicker";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import MaterialSearchInput from "../../../../../components/InventoryComponents/MaterialSearchInput";
import useStateMaterial from "../../../../../hooks/useStatMaterila";
import Box from "@mui/material/Box";
import useMovmantExport from "../../../../../hooks/invantory/export/useMovmantExport";
import { typeDocument } from "../../../../../constants/arrayFuction";
/* ---------------------------------------------------------------
   Material state options (حالة المادة)
   These match the state_martial table in the DB.
   If your IDs differ, update accordingly.
--------------------------------------------------------------- */

const InventoryReturnDialog = ({ warehouseId, documentId, documentType, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { stateMaterial } = useStateMaterial();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [exportMovements, setExportMovements] = useState([]);
  const [selectedExport, setSelectedExport] = useState(null);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "",
    state_id: "",
    note: "",
    return_date: dayjs(),
    originalDocumentNumber: "",
    originalDocumentDate: dayjs(),
    originalDocumentType: "out",
  });
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedExport(null);
    setExportMovements([]);
    setSelectedMaterial(null);
    setFormData({
      quantity: "",
      state_id: "",
      note: "",
      // return_date: dayjs(),
      originalDocumentNumber: "",
      // originalDocumentDate: dayjs().format("YYYY-MM-DD"),
      originalDocumentType: "out",
    });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleDateChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, return_date: value }));
  }, []);

  const handleOriginalDateChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, originalDocumentDate: value }));
  }, []);

  const fetchOriginalMovements = useCallback(async () => {
    if (!selectedMaterial) {
      toast.error("الرجاء تحديد المادة أولاً");
      return;
    }
    if (!formData.originalDocumentNumber) {
      toast.error("الرجاء إدخال رقم المستند");
      return;
    }
    setLoadingMovements(true);
    setExportMovements([]);
    setSelectedExport(null);
    try {
      const response = await axiosInstance.get(`/api/warehouse/search-export-movements`, {
        params: {
          document_number: formData.originalDocumentNumber,
          document_date: formData.originalDocumentDate,
          document_type: formData.originalDocumentType,
          material_id: selectedMaterial.id,
          warehouseId:warehouseId
        },
      });
      setExportMovements(response.data.data);
      if (response.data.data.length === 1) {
        setSelectedExport(response.data.data[0]);
      }
      toast.success("تم العثور على حركات التصدير بنجاح");
    } catch (error) {
      toast.error(error?.response?.data?.message || "لم يتم العثور على حركات تصدير مطابقة");
    } finally {
      setLoadingMovements(false);
    }
  }, [selectedMaterial, formData]);

  const maxReturnable = useMemo(() => {
    if (!selectedExport) return 0;
    const exported = Number(selectedExport?.quantity ?? 0);
    const alreadyReturned = Number(selectedExport?.already_returned ?? 0);
    return Math.max(exported - alreadyReturned, 0);
  }, [selectedExport]);

  const handleSubmit = useCallback(async () => {
    if (!selectedMaterial) {
      toast.error("الرجاء تحديد المادة البحثية");
      return;
    }
    if (!selectedExport) {
      toast.error("الرجاء اختيار حركة صرف ليتم إرجاع المادة منها");
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("الرجاء إدخال كمية صحيحة");
      return;
    }
    if (Number(formData.quantity) > maxReturnable) {
      toast.error(`الكمية لا تتجاوز الحد المسموح (${maxReturnable})`);
      return;
    }
    if (!formData.state_id) {
      toast.error("الرجاء تحديد حالة المادة");
      return;
    }
    if (!formData.return_date) {
      toast.error("الرجاء تحديد تاريخ الارجاع");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        export_id: selectedExport.export_id,
        origin_import_id: selectedExport?.details?.[0]?.origin_import_id,
        material_id: selectedMaterial.id,
        document_id: documentId,
        document_type:documentType,
        quantity: Number(formData.quantity),
        state_id: Number(formData.state_id),
        note: formData.note || null,
        return_date: formData.return_date,
        warehouse_id: warehouseId,
        entity_id: selectedExport.entity_id,
      };

      const response = await axiosInstance.post(
        `/api/warehouse/inventory-return-create`,
        payload,
      );

      toast.success(response?.data?.message || "تم تسجيل الارجاع بنجاح");
      handleClose();
      window.location.reload();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء تسجيل الارجاع",
      );
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    selectedExport,
    selectedMaterial,
    maxReturnable,
    handleClose,
    documentId,
    warehouseId,
  ]);
  const onMaterialSelect = useCallback((material) => {
    setSelectedMaterial(material);
    setExportMovements([]);
    setSelectedExport(null);
  }, []);

  return (
    <>
      <ButtonTheme onClick={handleOpen}>
        <Replay sx={{ fontSize: "18px", color: "warning.main" }} />
        <span className="ms-2">ارجاع مادة</span>
      </ButtonTheme>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "warning.main",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          تسجيل ارجاع مادة مخزنية
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <MaterialSearchInput
              warehouseId={warehouseId}
              selectedMaterial={selectedMaterial}
              onSelect={onMaterialSelect}
              dir={"rtl"}
              open={open}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: "warning.dark" }}>
            بيانات المستند الصادر الأصلي
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="originalDocumentType"
                label="نوع المستند الأصلي *"
                select
                fullWidth
                size="small"
                value={formData.originalDocumentType}
                onChange={handleChange}
              >
                {typeDocument?.map((s) => (
                  <MenuItem key={s?.value} value={s?.value}>
                    {s?.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="originalDocumentNumber"
                label="رقم المستند الأصلي *"
                fullWidth
                size="small"
                value={formData.originalDocumentNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <CustomDatePicker
                label="تاريخ المستند الأصلي *"
                value={formData.originalDocumentDate}
                setValue={handleOriginalDateChange}
                format="YYYY/MM/DD"
                haswidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button 
                variant="outlined" 
                color="warning" 
                onClick={fetchOriginalMovements}
                disabled={loadingMovements || !selectedMaterial}
                startIcon={<Replay />}
              >
                {loadingMovements ? "جاري البحث..." : "بحث عن بيانات الصرف"}
              </Button>
            </Grid>
          </Grid>

          {exportMovements.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                اختر حركة الصرف:
              </Typography>
              <TextField
                select
                fullWidth
                label="حركات الصرف المتاحة"
                value={selectedExport ? selectedExport.export_id : ""}
                onChange={(e) => {
                  const selected = exportMovements.find(m => m.export_id === e.target.value);
                  setSelectedExport(selected);
                }}
              >
                {exportMovements?.map((mov) => (
                  <MenuItem key={mov?.export_id + mov?.origin_import_id} value={mov?.export_id}>
                    كمية الدفعة: {mov?.detail_quantity} | السعر: {mov?.price} | متبقي: {Number(mov?.detail_quantity) - Number(mov?.already_returned)}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="quantity"
                label={`الكمية المُرجَّعة (الحد الأقصى: ${maxReturnable}) *`}
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                error={Number(formData.quantity) > maxReturnable}
                helperText={Number(formData.quantity) > maxReturnable ? "تجاوزت الكمية المسموحة" : ""}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="state_id"
                label="حالة المادة *"
                select
                fullWidth
                value={formData.state_id}
                onChange={handleChange}
              >
                {stateMaterial.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.state_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomDatePicker
                label="تاريخ الارجاع *"
                value={formData.return_date}
                setValue={handleDateChange}
                format="YYYY/MM/DD"
                haswidth
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                name="note"
                label="ملاحظات"
                multiline
                rows={2}
                fullWidth
                value={formData.note}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="warning"
            startIcon={<SaveIcon />}
            disabled={loading || !selectedExport || maxReturnable <= 0}
          >
            {loading ? "جاري الحفظ..." : "حفظ الارجاع"}
          </Button>
          <Button onClick={handleClose} variant="outlined" disabled={loading}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(InventoryReturnDialog);
