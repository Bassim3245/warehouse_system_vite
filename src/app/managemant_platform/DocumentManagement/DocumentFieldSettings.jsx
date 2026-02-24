import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";

import { toast } from "react-toastify";
import { axiosInstance } from "../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../redux/api/axios";
import { getUserInformation } from "../../../utils/handelCookie";

/* ====================================================
   Constants
   ==================================================== */
const DOCUMENT_TYPES = [
  { value: "in", label: "وارد" },
  { value: "out", label: "صادر" },
  { value: "internal_transfer", label: "تحويل داخلي" },
  { value: "production_entry", label: "إنتاج" },
  { value: "internal_consumption", label: "استهلاك داخلي" },
];

const FIELD_TYPES = [
  { value: "text", label: "نص" },
  { value: "number", label: "رقم" },
  { value: "date", label: "تاريخ" },
  { value: "select", label: "قائمة اختيار" },
  { value: "textarea", label: "نص متعدد الأسطر" },
];

const EMPTY_FORM = {
  document_type: "in",
  field_key: "",
  field_label: "",
  field_type: "text",
  is_required: false,
  display_order: 0,
  is_active: true,
};

/* ====================================================
   Field Form Dialog
   ==================================================== */
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

/* ====================================================
   Delete Confirm Dialog
   ==================================================== */
const DeleteConfirmDialog = memo(
  ({ open, onClose, onConfirm, fieldLabel, loading }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          هل تريد حذف الحقل <strong>«{fieldLabel}»</strong>؟
          <br />
          سيتم حذف جميع القيم المخزنة لهذا الحقل في المستندات القديمة.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ borderRadius: 2 }}
        >
          حذف
        </Button>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          إلغاء
        </Button>
      </DialogActions>
    </Dialog>
  ),
);
DeleteConfirmDialog.displayName = "DeleteConfirmDialog";

/* ====================================================
   Main Page
   ==================================================== */
export default function DocumentFieldSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const currentDocType = DOCUMENT_TYPES[activeTab].value;
  const userInformation = getUserInformation();
  /* ── Fetch all field definitions ────────────────── */
  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/fieldDefinitions?entity_id=${userInformation.entity_id}`,
      );
      setFields(res.data?.data || []);
    } catch (err) {
      toast.error("خطأ في جلب تعريفات الحقول");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  /* ── Filter fields for current tab ──────────────── */
  const filteredFields = useMemo(
    () => fields.filter((f) => f.document_type === currentDocType),
    [fields, currentDocType],
  );

  /* ── Create Field ────────────────────────────────── */
  const handleCreate = useCallback(
    async (formData) => {
      setActionLoading(true);
      try {
        await axiosInstance.post(
          `${BackendUrl}/api/warehouse/fieldDefinitions`,
          formData,
        );
        toast.success("تم إنشاء الحقل بنجاح");
        setFormOpen(false);
        fetchFields();
      } catch (err) {
        toast.error(err?.response?.data?.message || "خطأ في إنشاء الحقل");
      } finally {
        setActionLoading(false);
      }
    },
    [fetchFields],
  );

  /* ── Update Field ────────────────────────────────── */
  const handleUpdate = useCallback(
    async (formData) => {
      setActionLoading(true);
      try {
        await axiosInstance.post(
          `${BackendUrl}/api/warehouse/fieldDefinitions/${editTarget.id}`,
          formData,
        );
        toast.success("تم تحديث الحقل بنجاح");
        setFormOpen(false);
        setEditTarget(null);
        fetchFields();
      } catch (err) {
        toast.error(err?.response?.data?.message || "خطأ في تحديث الحقل");
      } finally {
        setActionLoading(false);
      }
    },
    [editTarget, fetchFields],
  );

  /* ── Toggle Active ───────────────────────────────── */
  const handleToggle = useCallback(
    async (id) => {
      try {
        await axiosInstance.get(
          `${BackendUrl}/api/warehouse/fieldDefinitions/toggle/${id}`,
        );
        toast.success("تم تغيير حالة الحقل");
        fetchFields();
      } catch (err) {
        toast.error("خطأ في تغيير حالة الحقل");
      }
    },
    [fetchFields],
  );

  /* ── Delete Field ────────────────────────────────── */
  const handleDeleteConfirm = useCallback(async () => {
    setActionLoading(true);
    try {
      await axiosInstance.delete(
        `${BackendUrl}/api/warehouse/fieldDefinitions/${deleteTarget.id}`,
      );
      toast.success("تم حذف الحقل بنجاح");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchFields();
    } catch (err) {
      toast.error("خطأ في حذف الحقل");
    } finally {
      setActionLoading(false);
    }
  }, [deleteTarget, fetchFields]);

  /* ── Reorder (move up/down) ──────────────────────── */
  const handleReorder = useCallback(
    async (field, direction) => {
      const sorted = [...filteredFields].sort(
        (a, b) => a.display_order - b.display_order,
      );
      const idx = sorted.findIndex((f) => f.id === field.id);
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sorted.length) return;

      const reordered = [...sorted];
      [reordered[idx], reordered[targetIdx]] = [
        reordered[targetIdx],
        reordered[idx],
      ];
      const payload = reordered.map((f, i) => ({
        id: f.id,
        display_order: i + 1,
      }));
      try {
        await axiosInstance.post(
          `${BackendUrl}/api/warehouse/fieldDefinitions/reorder`,
          { fields: payload },
        );
        fetchFields();
      } catch (err) {
        toast.error("خطأ في ترتيب الحقول");
      }
    },
    [filteredFields, fetchFields],
  );

  return (
    <Box dir="rtl" sx={{ p: { xs: 2, md: 4 } }}>
      {/* ── Header ─────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
              display: "flex",
              color: "white",
            }}
          >
            <SettingsIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
              إعدادات حقول المستندات
            </Typography>
            <Typography variant="body2" color="text.secondary">
              إدارة الحقول الديناميكية لكل نوع مستند
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditTarget(null);
            setFormOpen(true);
          }}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(135deg, #1976d2, #1565c0)",
            boxShadow: "0 4px 16px rgba(25,118,210,0.35)",
            "&:hover": { boxShadow: "0 6px 20px rgba(25,118,210,0.45)" },
          }}
        >
          إضافة حقل جديد
        </Button>
      </Box>

      {/* ── Stats Cards ─────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "إجمالي الحقول", value: fields.length, color: "#1976d2" },
          {
            label: "حقول مفعّلة",
            value: fields.filter((f) => f.is_active).length,
            color: "#2e7d32",
          },
          {
            label: "حقول معطّلة",
            value: fields.filter((f) => !f.is_active).length,
            color: "#c62828",
          },
          {
            label: "حقول إجبارية",
            value: fields.filter((f) => f.is_required).length,
            color: "#e65100",
          },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: stat.color }}
              >
                {loading ? "—" : stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Tabs ────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTab-root": { fontWeight: 600, minWidth: 120 },
            "& .Mui-selected": { color: "primary.main" },
          }}
        >
          {DOCUMENT_TYPES.map((dt) => {
            const count = fields.filter(
              (f) => f.document_type === dt.value,
            ).length;
            return (
              <Tab
                key={dt.value}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {dt.label}
                    <Chip
                      label={count}
                      size="small"
                      sx={{ height: 18, fontSize: "0.7rem" }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        {/* ── Table ─────────────────────────────────── */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell align="center" sx={{ fontWeight: 700, width: 60 }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>مفتاح الحقل</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>التسمية</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>النوع</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    إجباري
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    الترتيب
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    الحالة
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    العمليات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFields.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <TuneIcon
                          sx={{ fontSize: 48, color: "text.disabled" }}
                        />
                        <Typography color="text.secondary">
                          لا توجد حقول لهذا النوع من المستندات
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setEditTarget(null);
                            setFormOpen(true);
                          }}
                        >
                          أضف أول حقل
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  [...filteredFields]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((field, idx) => (
                      <TableRow
                        key={field.id}
                        sx={{
                          "&:hover": { bgcolor: "action.hover" },
                          opacity: field.is_active ? 1 : 0.55,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              color: "primary.main",
                              fontWeight: 600,
                            }}
                          >
                            {field.field_key}
                          </Typography>
                        </TableCell>
                        <TableCell>{field.field_label}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              FIELD_TYPES.find(
                                (ft) => ft.value === field.field_type,
                              )?.label || field.field_type
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {field.is_required ? (
                            <Chip label="إجباري" size="small" color="warning" />
                          ) : (
                            <Chip
                              label="اختياري"
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="تحريك لأعلى">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleReorder(field, "up")}
                                  disabled={idx === 0}
                                >
                                  <KeyboardArrowUpIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Typography
                              variant="body2"
                              sx={{ minWidth: 20, textAlign: "center" }}
                            >
                              {field.display_order}
                            </Typography>
                            <Tooltip title="تحريك لأسفل">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleReorder(field, "down")}
                                  disabled={idx === filteredFields.length - 1}
                                >
                                  <KeyboardArrowDownIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={Boolean(field.is_active)}
                            onChange={() => handleToggle(field.id)}
                            size="small"
                            color="success"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="تعديل">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  setEditTarget(field);
                                  setFormOpen(true);
                                }}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setDeleteTarget(field);
                                  setDeleteOpen(true);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* ── Dialogs ─────────────────────────────────── */}
      <FieldFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSave={editTarget ? handleUpdate : handleCreate}
        initialData={editTarget}
        loading={actionLoading}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        fieldLabel={deleteTarget?.field_label || ""}
        loading={actionLoading}
      />
    </Box>
  );
}
