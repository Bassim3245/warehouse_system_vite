import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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
import DeleteConfirmDialog from "./deleteConfirmModel";
import FieldFormDialog from "./documetFildeModel";
import { DOCUMENT_TYPES, FIELD_TYPES } from "./utils";


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
        `${BackendUrl}/api/warehouse/fieldDefinitions?entity_id=${userInformation.entity_id}&document_type=${currentDocType}`,
      );
      setFields(res.data?.data || []);
    } catch (err) {
      toast.error("خطأ في جلب تعريفات الحقول");
    } finally {
      setLoading(false);
    }
  }, [currentDocType]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);



  /* ── Create Field ────────────────────────────────── */
  const handleCreate = useCallback(
    async (formData) => {
      setActionLoading(true);
      try {
        await axiosInstance.post(
          `${BackendUrl}/api/warehouse/fieldDefinitions`,
          {...formData, entity_id: userInformation.entity_id},
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
      await axiosInstance.get(
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
      const sorted = [...fields].sort(
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
    [ fetchFields],
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
                {fields.length === 0 ? (
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
                  [...fields]
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
                                  disabled={idx === fields.length - 1}
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
