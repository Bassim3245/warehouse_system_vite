import { memo, useEffect, useState } from "react";
import { DOCUMENT_TYPES, EMPTY_FORM, FIELD_TYPES } from "./utils";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { toast } from "react-toastify";
import TuneIcon from "@mui/icons-material/Tune";

 const FieldFormDialog = memo(
  ({ open, onClose, onSave, initialData, loading }) => {
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
      if (open) {
        setForm(
          initialData
            ? {
                document_type: initialData.document_type,
                field_key: initialData.field_key,
                field_label: initialData.field_label,
                field_type: initialData.field_type,
                is_required: Boolean(initialData.is_required),
                display_order: initialData.display_order,
                is_active: Boolean(initialData.is_active),
              }
            : EMPTY_FORM,
        );
      }
    }, [open, initialData]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleSubmit = () => {
      if (!form.field_key.trim()) {
        toast.error("يرجى إدخال مفتاح الحقل");
        return;
      }
      if (!form.field_label.trim()) {
        toast.error("يرجى إدخال تسمية الحقل");
        return;
      }
      onSave(form);
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, dir: "rtl" },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 1,
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
          }}
        >
          <TuneIcon />
          {initialData ? "تعديل الحقل" : "إضافة حقل جديد"}
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Grid container spacing={2} direction="column">
            {/* Document Type */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>نوع المستند</InputLabel>
                <Select
                  name="document_type"
                  value={form.document_type}
                  label="نوع المستند"
                  onChange={handleChange}
                >
                  {DOCUMENT_TYPES.map((dt) => (
                    <MenuItem key={dt.value} value={dt.value}>
                      {dt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Field Key */}
            <Grid item xs={12}>
              <TextField
                name="field_key"
                label="مفتاح الحقل (field_key)"
                value={form.field_key}
                onChange={handleChange}
                fullWidth
                size="small"
                helperText="مثال: account_number (بدون مسافات، بالإنجليزية)"
              />
            </Grid>

            {/* Field Label */}
            <Grid item xs={12}>
              <TextField
                name="field_label"
                label="تسمية الحقل (field_label)"
                value={form.field_label}
                onChange={handleChange}
                fullWidth
                size="small"
                helperText="مثال: رقم الحساب"
              />
            </Grid>

            {/* Field Type */}
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>نوع البيانات</InputLabel>
                <Select
                  name="field_type"
                  value={form.field_type}
                  label="نوع البيانات"
                  onChange={handleChange}
                >
                  {FIELD_TYPES.map((ft) => (
                    <MenuItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Display Order */}
            <Grid item xs={12}>
              <TextField
                name="display_order"
                label="ترتيب العرض"
                type="number"
                value={form.display_order}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Switches */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_required"
                      checked={form.is_required}
                      onChange={handleChange}
                      color="warning"
                    />
                  }
                  label="مطلوب"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      color="success"
                    />
                  }
                  label="مفعّل"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
            sx={{ borderRadius: 2 }}
          >
            {initialData ? "حفظ التعديل" : "إضافة"}
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            إلغاء
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);
FieldFormDialog.displayName = "FieldFormDialog";
export default FieldFormDialog;