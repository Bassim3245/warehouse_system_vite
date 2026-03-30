import { memo, useEffect, useState } from "react";
import { DOCUMENT_TYPES, EMPTY_FORM, FIELD_TYPES } from "./utils";
import {
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, FormControlLabel,
  Grid, InputLabel, MenuItem, Select, Switch, TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import TuneIcon from "@mui/icons-material/Tune";
import { typeDocument } from "../../../constants/arrayFuction";

/* ─── Styles ──────────────────────────────────────────────────── */
const sx = {
  paper:   { borderRadius: 3, dir: "rtl" },
  title:   {
    display: "flex", alignItems: "center", gap: 1, pb: 1,mb:4,
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    color: "white", borderRadius: "12px 12px 0 0",
  },
  actions: { px: 3, pb: 2, gap: 1 },
  btn:     { borderRadius: 2 },
  switches: { display: "flex", gap: 3 },
};

/* ─── Sub-components ──────────────────────────────────────────── */
const SelectField = ({ name, label, value, onChange, options }) => (
  <Grid item xs={12}>
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} label={label} onChange={onChange}>
        {options.map((o) => (
          <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
);

const InputField = ({ name, label, value, onChange, helperText, type = "text", inputProps }) => (
  <Grid item xs={12}>
    <TextField
      name={name} label={label} value={value} onChange={onChange}
      fullWidth size="small" type={type}
      helperText={helperText} inputProps={inputProps}
    />
  </Grid>
);

const SwitchField = ({ name, label, checked, onChange, color }) => (
  <FormControlLabel
    label={label}
    control={<Switch name={name} checked={checked} onChange={onChange} color={color} />}
  />
);

/* ─── Main Component ──────────────────────────────────────────── */
const FieldFormDialog = memo(({ open, onClose, onSave, initialData, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(initialData
      ? {
          document_type: initialData.document_type,
          field_key:     initialData.field_key,
          field_label:   initialData.field_label,
          field_type:    initialData.field_type,
          is_required:   Boolean(initialData.is_required),
          display_order: initialData.display_order,
          is_active:     Boolean(initialData.is_active),
        }
      : EMPTY_FORM
    );
  }, [open, initialData]);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

  const handleSubmit = () => {
    if (!form.field_key.trim())   return toast.error("يرجى إدخال مفتاح الحقل");
    if (!form.field_label.trim()) return toast.error("يرجى إدخال تسمية الحقل");
    onSave(form);
  };

  const isEdit = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: sx.paper }}>

      <DialogTitle sx={sx.title}>
        <TuneIcon />
        {isEdit ? "تعديل الحقل" : "إضافة حقل جديد"}
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>

        <Grid container spacing={2} direction="column">

          <SelectField
            name="document_type" label="نوع المستند"
            value={form.document_type} onChange={handleChange}
            options={typeDocument}
          />
          <InputField
            name="field_key" label="مفتاح الحقل (field_key)"
            value={form.field_key} onChange={handleChange}
            helperText="مثال: account_number (بدون مسافات، بالإنجليزية)"
          />
          <InputField
            name="field_label" label="تسمية الحقل (field_label)"
            value={form.field_label} onChange={handleChange}
            helperText="مثال: رقم الحساب"
          />
          <SelectField
            name="field_type" label="نوع البيانات"
            value={form.field_type} onChange={handleChange}
            options={FIELD_TYPES}
          />
          <InputField
            name="display_order" label="ترتيب العرض"
            value={form.display_order} onChange={handleChange}
            type="number" inputProps={{ min: 0 }}
          />

          <Grid item xs={12}>
            <Box sx={sx.switches}>
              <SwitchField name="is_required" label="مطلوب"  checked={form.is_required} onChange={handleChange} color="warning" />
              <SwitchField name="is_active"   label="مفعّل"  checked={form.is_active}   onChange={handleChange} color="success" />
            </Box>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={sx.actions}>
        <Button
          variant="contained" onClick={handleSubmit}
          disabled={loading} sx={sx.btn}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {isEdit ? "حفظ التعديل" : "إضافة"}
        </Button>
        <Button onClick={onClose} variant="outlined" sx={sx.btn}>إلغاء</Button>
      </DialogActions>

    </Dialog>
  );
});

FieldFormDialog.displayName = "FieldFormDialog";
export default FieldFormDialog;