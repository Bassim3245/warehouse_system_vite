import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    memo,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";

import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PaletteIcon from "@mui/icons-material/Palette";
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewListIcon from "@mui/icons-material/ViewList";

import { toast } from "react-toastify";
import { axiosInstance } from "../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken, getUserInformation } from "../../../utils/handelCookie";
import {
    buildDefaultConfig,
    DEFAULT_EXPORT_COLUMNS,
    DEFAULT_IMPORT_COLUMNS,
    DEFAULT_HEADER_FIELDS,
    DEFAULT_HEADER_TEXT,
} from "../../../hooks/invantory/useInvoiceTemplate";

const DOCUMENT_TYPES = [
    { value: "in", label: "مستند وارد" },
    { value: "out", label: "مستند صادر" },
    { value: "internal_transfer", label: "تحويل داخلي" },
    { value: "production_entry", label: "إدخال إنتاج" },
    { value: "internal_consumption", label: "استهلاك داخلي" },
];

/* ──────────────────────────────────────────
   Reusable: a single draggable/orderable row
   ────────────────────────────────────────── */
const FieldRow = memo(({ item, index, total, onToggle, onLabelChange, onMoveUp, onMoveDown }) => (
    <Paper
        elevation={0}
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            mb: 0.5,
            border: "1px solid",
            borderColor: item.visible ? "primary.light" : "divider",
            borderRadius: 2,
            bgcolor: item.visible ? "primary.50" : "grey.50",
            opacity: item.visible ? 1 : 0.6,
            transition: "all 0.2s",
        }}
    >
        {/* Order arrows */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton size="small" onClick={() => onMoveUp(index)} disabled={index === 0}>
                <KeyboardArrowUpIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onMoveDown(index)} disabled={index === total - 1}>
                <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
        </Box>

        {/* Order badge */}
        <Chip label={index + 1} size="small" sx={{ minWidth: 28, fontSize: "0.7rem" }} />

        {/* Editable label */}
        <TextField
            value={item.label}
            onChange={(e) => onLabelChange(index, e.target.value)}
            size="small"
            variant="outlined"
            sx={{ flex: 1 }}
            label="التسمية"
            disabled={!item.visible}
        />

        {/* Visibility toggle */}
        <Tooltip title={item.visible ? "إخفاء" : "إظهار"}>
            <IconButton
                size="small"
                color={item.visible ? "primary" : "default"}
                onClick={() => onToggle(index)}
            >
                {item.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
        </Tooltip>
    </Paper>
));
FieldRow.displayName = "FieldRow";

/* ──────────────────────────────────────────
   List of rows with move up/down helpers
   ────────────────────────────────────────── */
const FieldList = ({ items, onChange }) => {
    const handleToggle = useCallback((idx) => {
        const updated = items.map((f, i) =>
            i === idx ? { ...f, visible: !f.visible } : f
        );
        onChange(updated);
    }, [items, onChange]);

    const handleLabelChange = useCallback((idx, value) => {
        const updated = items.map((f, i) => (i === idx ? { ...f, label: value } : f));
        onChange(updated);
    }, [items, onChange]);

    const handleMove = useCallback((idx, dir) => {
        const arr = [...items];
        const target = dir === "up" ? idx - 1 : idx + 1;
        [arr[idx], arr[target]] = [arr[target], arr[idx]];
        onChange(arr.map((f, i) => ({ ...f, order: i + 1 })));
    }, [items, onChange]);

    return (
        <Box>
            {items.map((item, idx) => (
                <FieldRow
                    key={item.key}
                    item={item}
                    index={idx}
                    total={items.length}
                    onToggle={handleToggle}
                    onLabelChange={handleLabelChange}
                    onMoveUp={(i) => handleMove(i, "up")}
                    onMoveDown={(i) => handleMove(i, "down")}
                />
            ))}
        </Box>
    );
};

/* ──────────────────────────────────────────
   Mini print preview panel
   ────────────────────────────────────────── */
const PreviewPanel = ({ config, documentType }) => {
    if (!config) return null;
    const visibleHeader = (config.headerFields || []).filter((f) => f.visible);
    const visibleCols = (config.tableColumns || []).filter((c) => c.visible);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                border: "2px dashed",
                borderColor: "primary.light",
                borderRadius: 2,
                bgcolor: "#fafafa",
                minHeight: 300,
                fontFamily: "Arial, sans-serif",
                direction: "rtl",
            }}
        >
            <Typography variant="caption" color="primary" fontWeight={700} sx={{ display: "block", mb: 1 }}>
                معاينة مبسطة
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {/* Header text */}
            <Box sx={{ textAlign: "center", mb: 1 }}>
                <Typography sx={{ fontSize: "11px", fontWeight: "bold" }}>
                    {config.header?.line1}
                </Typography>
                <Typography sx={{ fontSize: "10px" }}>{config.header?.line2}</Typography>
                <Typography sx={{ fontSize: "10px", color: "#666" }}>
                    {config.header?.title}
                </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />

            {/* Header fields chips */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                {visibleHeader.map((f) => (
                    <Chip key={f.key} label={f.label} size="small" variant="outlined" sx={{ fontSize: "9px" }} />
                ))}
            </Box>

            {/* Table column headers */}
            <Box
                sx={{
                    display: "flex",
                    gap: 0.5,
                    bgcolor: "#2c3e50",
                    borderRadius: 1,
                    p: 0.5,
                    flexWrap: "wrap",
                }}
            >
                {visibleCols.map((c) => (
                    <Chip
                        key={c.key}
                        label={c.label}
                        size="small"
                        sx={{ fontSize: "8px", bgcolor: "white", height: 18 }}
                    />
                ))}
            </Box>

            {config.dynamicFieldsVisible && (
                <Typography sx={{ fontSize: "9px", color: "#888", mt: 1 }}>
                    ✓ الحقول الديناميكية مرئية
                </Typography>
            )}
        </Paper>
    );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */
export default function InvoiceTemplateDesigner() {
    const user = getUserInformation();
    const entityId = user?.entity_id;

    const [activeTab, setActiveTab] = useState(0);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [hasCustom, setHasCustom] = useState(false);
    const [sectionTab, setSectionTab] = useState(0);

    const currentDocType = DOCUMENT_TYPES[activeTab].value;

    /* ── Fetch saved template or fall back to default ── */
    const loadTemplate = useCallback(async () => {
        if (!entityId) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/invoiceTemplate/${entityId}/${currentDocType}`,
                { headers: { authorization: getToken() } }
            );
            const saved = res.data?.data;
            if (saved && saved.config) {
                setConfig(saved.config);
                setHasCustom(true);
            } else {
                setConfig(buildDefaultConfig(currentDocType));
                setHasCustom(false);
            }
        } catch {
            setConfig(buildDefaultConfig(currentDocType));
            setHasCustom(false);
        } finally {
            setLoading(false);
        }
    }, [entityId, currentDocType]);

    useEffect(() => {
        loadTemplate();
        setSectionTab(0);
    }, [loadTemplate]);

    /* ── Save ── */
    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            await axiosInstance.post(
                `${BackendUrl}/api/warehouse/invoiceTemplate`,
                { entity_id: entityId, document_type: currentDocType, config },
                { headers: { authorization: getToken() } }
            );
            toast.success("تم حفظ قالب الفاتورة بنجاح");
            setHasCustom(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    }, [entityId, currentDocType, config]);

    /* ── Reset to default ── */
    const handleReset = useCallback(async () => {
        try {
            await axiosInstance.delete(
                `${BackendUrl}/api/warehouse/invoiceTemplate/${entityId}/${currentDocType}`,
                { headers: { authorization: getToken() } }
            );
            setConfig(buildDefaultConfig(currentDocType));
            setHasCustom(false);
            toast.success("تم إعادة القالب الافتراضي");
        } catch {
            // Template didn't exist, just reset locally
            setConfig(buildDefaultConfig(currentDocType));
            setHasCustom(false);
        }
    }, [entityId, currentDocType]);

    /* ── Config updaters ── */
    const setHeaderText = useCallback(
        (field, value) =>
            setConfig((prev) => ({ ...prev, header: { ...prev.header, [field]: value } })),
        []
    );
    const setHeaderFields = useCallback(
        (fields) => setConfig((prev) => ({ ...prev, headerFields: fields })),
        []
    );
    const setTableColumns = useCallback(
        (cols) => setConfig((prev) => ({ ...prev, tableColumns: cols })),
        []
    );

    const sectionTabs = useMemo(
        () => [
            { label: "الرأسية", icon: <PaletteIcon fontSize="small" /> },
            { label: "الحقول", icon: <ViewListIcon fontSize="small" /> },
            { label: "الأعمدة", icon: <TableChartIcon fontSize="small" /> },
        ],
        []
    );

    return (
        <Box dir="rtl" sx={{ p: { xs: 2, md: 3 } }}>
            {/* ── Page Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                    sx={{
                        p: 1,
                        borderRadius: 2,
                        background: "linear-gradient(135deg,#1976d2,#1565c0)",
                        color: "white",
                        display: "flex",
                    }}
                >
                    <DescriptionIcon />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        مصمم قالب الفاتورة
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        خصص تصميم الفاتورة لكل نوع مستند
                    </Typography>
                </Box>
                <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    {hasCustom && (
                        <Chip
                            label="قالب مخصص محفوظ"
                            color="success"
                            size="small"
                            variant="outlined"
                        />
                    )}
                    <Tooltip title="حذف التخصيص والرجوع للافتراضي">
                        <Button
                            variant="outlined"
                            color="warning"
                            startIcon={<RestoreIcon />}
                            onClick={handleReset}
                            size="small"
                        >
                            افتراضي
                        </Button>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving || loading || !config}
                        sx={{
                            background: "linear-gradient(135deg,#1976d2,#1565c0)",
                            boxShadow: "0 4px 16px rgba(25,118,210,0.35)",
                        }}
                    >
                        حفظ التغييرات
                    </Button>
                </Box>
            </Box>

            {!hasCustom && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    يستخدم النظام حالياً القالب الافتراضي. يمكنك تخصيصه وحفظه ليظهر عند الطباعة.
                </Alert>
            )}

            <Grid container spacing={2}>
                {/* ── Left: Editor ── */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Document type tabs */}
                    <Paper
                        elevation={0}
                        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, mb: 2 }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                        >
                            {DOCUMENT_TYPES.map((dt) => (
                                <Tab key={dt.value} label={dt.label} />
                            ))}
                        </Tabs>

                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                                <CircularProgress />
                            </Box>
                        ) : config ? (
                            <Box sx={{ p: 2 }}>
                                {/* Section sub-tabs */}
                                <Tabs
                                    value={sectionTab}
                                    onChange={(_, v) => setSectionTab(v)}
                                    sx={{ mb: 2 }}
                                    variant="fullWidth"
                                >
                                    {sectionTabs.map((st, i) => (
                                        <Tab key={i} label={st.label} icon={st.icon} iconPosition="start" />
                                    ))}
                                </Tabs>

                                {/* ── Section 0: Header text ── */}
                                {sectionTab === 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            نصوص رأس الفاتورة (السطور العلوية)
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {[
                                                { key: "line1", label: "السطر الأول" },
                                                { key: "line2", label: "السطر الثاني" },
                                                { key: "title", label: "عنوان المستند" },
                                                { key: "systemName", label: "اسم النظام" },
                                            ].map((f) => (
                                                <Grid size={{ xs: 12, sm: 6 }} key={f.key}>
                                                    <TextField
                                                        label={f.label}
                                                        value={config.header?.[f.key] || ""}
                                                        onChange={(e) => setHeaderText(f.key, e.target.value)}
                                                        fullWidth
                                                        size="small"
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* ── Section 1: Header fields ── */}
                                {sectionTab === 1 && (
                                    <Box>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                حقول معلومات المستند (الهيدر)
                                            </Typography>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={!!config.dynamicFieldsVisible}
                                                        onChange={(e) =>
                                                            setConfig((prev) => ({
                                                                ...prev,
                                                                dynamicFieldsVisible: e.target.checked,
                                                            }))
                                                        }
                                                        size="small"
                                                        color="success"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="caption">
                                                        إظهار الحقول الديناميكية
                                                    </Typography>
                                                }
                                            />
                                        </Box>
                                        <FieldList
                                            items={config.headerFields || []}
                                            onChange={setHeaderFields}
                                        />
                                    </Box>
                                )}

                                {/* ── Section 2: Table columns ── */}
                                {sectionTab === 2 && (
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            أعمدة جدول المواد
                                        </Typography>
                                        <FieldList
                                            items={config.tableColumns || []}
                                            onChange={setTableColumns}
                                        />
                                    </Box>
                                )}
                            </Box>
                        ) : null}
                    </Paper>
                </Grid>

                {/* ── Right: Preview ── */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        معاينة حية
                    </Typography>
                    <PreviewPanel config={config} documentType={currentDocType} />
                </Grid>
            </Grid>
        </Box>
    );
}
