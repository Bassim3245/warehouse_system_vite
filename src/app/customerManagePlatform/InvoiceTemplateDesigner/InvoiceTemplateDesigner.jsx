import React, { useState, useEffect, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";
import PreviewIcon from "@mui/icons-material/Preview";
import CodeIcon from "@mui/icons-material/Code";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TableChartIcon from "@mui/icons-material/TableChart";
import InjectIcon from "@mui/icons-material/PlaylistAdd";

import { toast } from "react-toastify";
import { axiosInstance } from "../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken, getUserInformation } from "../../../utils/handelCookie";

const DOCUMENT_TYPES = [
    { value: "in",                   label: "مستند وارد" },
    { value: "out",                  label: "مستند صادر" },
    { value: "internal_transfer",    label: "تحويل داخلي" },
    { value: "production_entry",     label: "إدخال إنتاج" },
    { value: "internal_consumption", label: "استهلاك داخلي" },
];

const AVAILABLE_VARIABLES = [
    { key: "header_line1",       desc: "السطر الأول من الرأسية" },
    { key: "header_line2",       desc: "السطر الثاني" },
    { key: "entity_name",        desc: "اسم الجهة / الشركة" },
    { key: "document_number",    desc: "رقم المستند" },
    { key: "document_date",      desc: "تاريخ المستند" },
    { key: "warehouse_name",     desc: "اسم المخزن" },
    { key: "warehouse_code",     desc: "رمز المخزن" },
    { key: "center_cost",        desc: "رقم مركز الكلفة" },
    { key: "center_cost_name",   desc: "اسم مركز الكلفة" },
    { key: "account_number",     desc: "رقم الحساب" },
    { key: "type_movement",      desc: "نوع الحركة" },
    { key: "type_movement_code", desc: "رمز نوع الحركة" },
    { key: "beneficiary",        desc: "المستفيد" },
    { key: "user_name",          desc: "اسم المستخدم" },
    { key: "factory_name",       desc: "اسم المعمل" },
    { key: "lab_name",           desc: "اسم المختبر" },
    { key: "description",        desc: "الملاحظات" },
    { key: "items_table",        desc: "جدول مواد كامل تلقائي" },
    { key: "items_rows",         desc: "صفوف البيانات فقط" },
    { key: "items_count",        desc: "عدد البنود" },
    { key: "total_quantity",     desc: "إجمالي الكمية" },
    { key: "total_price",        desc: "القيمة الإجمالية" },
    { key: "dynamic_fields",     desc: "الحقول الديناميكية" },
    { key: "signatures",         desc: "كل التوقيعات" },
    { key: "signature_1",        desc: "توقيع 1" },
    { key: "signature_2",        desc: "توقيع 2" },
    { key: "signature_3",        desc: "توقيع 3" },
    { key: "signature_4",        desc: "توقيع 4" },
];

/* ══════════════════════════════════════════════════════
   ALL COLUMNS — fixed order matching buildItemsRows()
   Position index (1-based) corresponds to <td> position
   ══════════════════════════════════════════════════════ */
const DEFAULT_COLUMNS = [
    { pos: 1,  field: "index",    label: "ت" },
    { pos: 2,  field: "work_order", label: "رقم أمر العمل" },
    { pos: 3,  field: "code",     label: "رمز المادة" },
    { pos: 4,  field: "name",     label: "اسم المادة" },
    { pos: 5,  field: "spec",     label: "المواصفات" },
    { pos: 6,  field: "qty",      label: "الكمية" },
    { pos: 7,  field: "unit",     label: "وحدة القياس" },
    { pos: 8,  field: "price",    label: "سعر الوحدة" },
    { pos: 9,  field: "total",    label: "المبلغ الإجمالي" },
    { pos: 10, field: "date",     label: "تاريخ الشراء" },
    { pos: 11, field: "supplier", label: "الجهة الموردة" },
];

/* ══════════════════════════════════════════════════════
   TABLE COLUMN DESIGNER
   ══════════════════════════════════════════════════════ */
function TableColumnDesigner({ htmlContent, onApply }) {
    const [columns, setColumns] = useState(
        DEFAULT_COLUMNS.map((c) => ({ ...c, visible: true }))
    );
    const [tableId] = useState(() => "tbl_" + Math.random().toString(36).slice(2, 7));

    const toggleColumn = (pos) => {
        setColumns((prev) =>
            prev.map((c) => c.pos === pos ? { ...c, visible: !c.visible } : c)
        );
    };

    const renameColumn = (pos, newLabel) => {
        setColumns((prev) =>
            prev.map((c) => c.pos === pos ? { ...c, label: newLabel } : c)
        );
    };

    const generateTableHtml = useCallback(() => {
        const hiddenPositions = columns.filter((c) => !c.visible).map((c) => c.pos);

        // Build CSS to hide unused columns
        const hideRules = hiddenPositions.map(
            (p) => `.${tableId} th:nth-child(${p}), .${tableId} td:nth-child(${p}) { display:none; }`
        ).join("\n    ");

        // We still use all 11 <th> slots but hide the unwanted ones via CSS
        const allHeaders = columns.map((c) => `<th>${c.label}</th>`).join("");

        return `<!-- جدول مواد مخصص -->
<style>
    .${tableId} { width:100%; border-collapse:collapse; font-size:11px; }
    ${hideRules}
</style>
<table class="inv-table ${tableId}">
  <thead>
    <tr>
      ${allHeaders}
    </tr>
  </thead>
  <tbody>
    {{items_rows}}
  </tbody>
</table>`;
    }, [columns, tableId]);

    const handleInsert = useCallback(() => {
        if (!htmlContent) { toast.warning("افتح قالباً أولاً"); return; }
        const tableHtml = generateTableHtml();
        let updated = htmlContent;
        if (updated.includes("{{items_table}}")) {
            updated = updated.replace("{{items_table}}", tableHtml);
        } else if (updated.includes("{{items_rows}}") && updated.includes("<!-- جدول مواد مخصص -->")) {
            updated = updated.replace(
                /<!-- جدول مواد مخصص -->[\s\S]*?<\/table>/,
                tableHtml
            );
        } else {
            const lastDiv = updated.lastIndexOf("</div>");
            if (lastDiv !== -1) {
                updated = updated.slice(0, lastDiv) + "\n" + tableHtml + "\n" + updated.slice(lastDiv);
            } else {
                updated = updated + "\n" + tableHtml;
            }
        }
        onApply(updated);
        toast.success("تم إدراج جدول المواد في القالب");
    }, [htmlContent, generateTableHtml, onApply]);

    const previewHeaders = columns.filter((c) => c.visible);

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                <TableChartIcon sx={{ fontSize: 16 }} /> تصميم أعمدة الجدول
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                فعّل / أوقف الأعمدة وغيّر تسمياتها
            </Typography>

            <Box sx={{ maxHeight: 280, overflow: "auto", mb: 1.5 }}>
                {columns.map((col) => (
                    <Box key={col.pos}
                        sx={{
                            display: "flex", alignItems: "center", gap: 0.5, mb: 0.5,
                            p: 0.5, borderRadius: 1,
                            bgcolor: col.visible ? "action.hover" : "transparent",
                            opacity: col.visible ? 1 : 0.45,
                        }}>
                        <Switch
                            size="small"
                            checked={col.visible}
                            onChange={() => toggleColumn(col.pos)}
                            sx={{ mr: 0.5 }}
                        />
                        <TextField
                            size="small"
                            value={col.label}
                            onChange={(e) => renameColumn(col.pos, e.target.value)}
                            disabled={!col.visible}
                            inputProps={{ style: { fontSize: 12, padding: "2px 6px" } }}
                            sx={{ flex: 1 }}
                        />
                        <Typography sx={{ fontSize: 10, color: "text.disabled", minWidth: 12 }}>
                            {col.pos}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Mini preview */}
            <Paper variant="outlined" sx={{ p: 0.5, mb: 1.5, overflowX: "auto" }}>
                <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                    معاينة الهيدر
                </Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                    <thead>
                        <tr>
                            {previewHeaders.map((c) => (
                                <th key={c.pos} style={{
                                    background: "#2c3e50", color: "white",
                                    padding: "3px 5px", border: "1px solid #bdc3c7",
                                    textAlign: "center", whiteSpace: "nowrap"
                                }}>{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {previewHeaders.map((c) => (
                                <td key={c.pos} style={{
                                    padding: "2px 5px", border: "1px solid #bdc3c7",
                                    textAlign: "center", color: "#888"
                                }}>
                                    {c.field === "index" ? "1" : "..."}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </Paper>

            <Button fullWidth variant="contained" startIcon={<InjectIcon />} onClick={handleInsert}
                sx={{ background: "linear-gradient(135deg,#388e3c,#2e7d32)", boxShadow: "0 3px 12px rgba(56,142,60,0.3)", mb: 1 }}>
                إدراج الجدول في القالب
            </Button>

            <Button fullWidth variant="outlined" size="small"
                onClick={() => setColumns(DEFAULT_COLUMNS.map((c) => ({ ...c, visible: true })))}>
                إعادة تعيين كل الأعمدة
            </Button>
        </Box>
    );
}

/* ══════════════════════════════════════════════════════
   VISUAL TABLE STYLE EDITOR
   ══════════════════════════════════════════════════════ */
function HeaderStyleEditor({ htmlContent, onApply }) {
    const [thBg, setThBg]           = useState("#2c3e50");
    const [thColor, setThColor]     = useState("#ffffff");
    const [thFontSize, setThFontSize] = useState(11);
    const [tdFontSize, setTdFontSize] = useState(11);
    const [borderColor, setBorderColor] = useState("#bdc3c7");
    const [accentColor, setAccentColor] = useState("#e74c3c");

    const applyStyles = useCallback(() => {
        if (!htmlContent) { toast.warning("افتح قالباً أولاً"); return; }
        let updated = htmlContent;
        const styleMatch = updated.match(/<style>([\s\S]*?)<\/style>/i);
        if (styleMatch) {
            let sc = styleMatch[1];
            sc = sc
                .replace(/\.inv-table\s+th\s*\{[^}]*\}/g,
                    `.inv-table th { background:${thBg}; color:${thColor}; padding:6px 8px; border:1px solid ${borderColor}; text-align:center; white-space:nowrap; font-size:${thFontSize}px; }`)
                .replace(/\.inv-table\s+td\s*\{[^}]*\}/g,
                    `.inv-table td { padding:5px 8px; border:1px solid ${borderColor}; text-align:center; font-size:${tdFontSize}px; }`)
                .replace(/\.header-value\.accent\s*\{[^}]*\}/g,
                    `.header-value.accent { color:${accentColor}; font-size:14px; }`);
            updated = updated.replace(/<style>([\s\S]*?)<\/style>/i, `<style>${sc}</style>`);
        }
        onApply(updated);
        toast.success("تم تطبيق التنسيق");
    }, [htmlContent, thBg, thColor, thFontSize, tdFontSize, borderColor, accentColor, onApply]);

    const ColorRow = ({ label, value, onChange }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
                style={{ width: 40, height: 30, border: "none", borderRadius: 4, cursor: "pointer", padding: 0 }} />
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{label}</Typography>
                <Typography sx={{ fontSize: 10, fontFamily: "monospace", color: "primary.main" }}>{value}</Typography>
            </Box>
        </Box>
    );

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                <PaletteIcon sx={{ fontSize: 16 }} /> تنسيق الجدول
            </Typography>
            <ColorRow label="لون خلفية الهيدر"  value={thBg}         onChange={setThBg} />
            <ColorRow label="لون نص الهيدر"      value={thColor}      onChange={setThColor} />
            <ColorRow label="لون الحدود"          value={borderColor}  onChange={setBorderColor} />
            <ColorRow label="لون رقم المستند"    value={accentColor}  onChange={setAccentColor} />
            <Divider sx={{ my: 1 }} />
            <Typography sx={{ fontSize: 11, mb: 0.5, color: "text.secondary" }}>حجم خط الهيدر: {thFontSize}px</Typography>
            <Slider value={thFontSize} min={8} max={16} step={1} onChange={(_, v) => setThFontSize(v)} size="small" sx={{ mb: 1 }} />
            <Typography sx={{ fontSize: 11, mb: 0.5, color: "text.secondary" }}>حجم خط الخلايا: {tdFontSize}px</Typography>
            <Slider value={tdFontSize} min={8} max={16} step={1} onChange={(_, v) => setTdFontSize(v)} size="small" sx={{ mb: 2 }} />

            {/* Live preview */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: thFontSize, marginBottom: 12 }}>
                <thead>
                    <tr>
                        {["ت", "اسم المادة", "الكمية", "السعر"].map((h) => (
                            <th key={h} style={{
                                background: thBg, color: thColor,
                                padding: "4px 6px", border: `1px solid ${borderColor}`, textAlign: "center"
                            }}>{h}</th>
                        ))}
                    </tr>
                    <tr style={{ fontSize: tdFontSize }}>
                        {["1", "مادة تجريبية", "100", "500"].map((v, i) => (
                            <td key={i} style={{ padding: "3px 6px", border: `1px solid ${borderColor}`, textAlign: "center" }}>{v}</td>
                        ))}
                    </tr>
                </thead>
            </table>

            <Button fullWidth variant="contained" startIcon={<AutoFixHighIcon />} onClick={applyStyles}
                sx={{ background: "linear-gradient(135deg,#1976d2,#1565c0)", boxShadow: "0 3px 12px rgba(25,118,210,0.3)" }}>
                تطبيق على كود القالب
            </Button>
        </Box>
    );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function InvoiceTemplateDesigner() {
    const user      = getUserInformation();
    const companyId = user?.entity_id;

    const [docTypeTab, setDocTypeTab] = useState(0);
    const [sideTab,    setSideTab]    = useState(0);

    const [templates, setTemplates] = useState([]);
    const [loading,   setLoading]   = useState(false);
    const [saving,    setSaving]    = useState(false);

    const [editingId,     setEditingId]     = useState(null);
    const [templateName,  setTemplateName]  = useState("");
    const [htmlContent,   setHtmlContent]   = useState("");
    const [showPreview,   setShowPreview]   = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");

    const currentDocType = DOCUMENT_TYPES[docTypeTab].value;

    const loadTemplates = useCallback(async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/documentTemplates/${companyId}`,
                { headers: { authorization: getToken() } }
            );
            setTemplates(res.data?.data || []);
        } catch { setTemplates([]); }
        finally { setLoading(false); }
    }, [companyId]);

    useEffect(() => { loadTemplates(); }, [loadTemplates]);

    const filteredTemplates = useMemo(
        () => templates.filter((t) => t.document_type === currentDocType),
        [templates, currentDocType]
    );

    const loadDefault = useCallback(async () => {
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/defaultTemplate/${currentDocType}`,
                { headers: { authorization: getToken() } }
            );
            setHtmlContent(res.data?.data?.html_content || "");
            setTemplateName(`قالب ${DOCUMENT_TYPES[docTypeTab].label} — مخصص`);
            setEditingId(null);
        } catch { toast.error("فشل في تحميل القالب الافتراضي"); }
    }, [currentDocType, docTypeTab]);

    const handleEdit = useCallback(async (template) => {
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/documentTemplate/${template.id}`,
                { headers: { authorization: getToken() } }
            );
            const data = res.data?.data;
            if (data) {
                setHtmlContent(data.html_content || "");
                setTemplateName(data.template_name || "");
                setEditingId(data.id);
            }
        } catch { toast.error("فشل في تحميل القالب"); }
    }, []);

    const handleSave = useCallback(async () => {
        if (!htmlContent.trim()) { toast.warning("القالب فارغ"); return; }
        if (!templateName.trim()) { toast.warning("أدخل اسم القالب"); return; }
        setSaving(true);
        try {
            await axiosInstance.post(
                `${BackendUrl}/api/warehouse/documentTemplate`,
                {
                    id: editingId || undefined,
                    template_name: templateName,
                    document_type: currentDocType,
                    entity_id:    companyId,
                    html_content:  htmlContent,
                },
                { headers: { authorization: getToken() } }
            );
            toast.success("تم حفظ القالب بنجاح");
            loadTemplates();
        } catch (err) {
            toast.error(err?.response?.data?.message || "حدث خطأ أثناء الحفظ");
        } finally { setSaving(false); }
    }, [htmlContent, templateName, editingId, currentDocType, companyId, loadTemplates]);

    const handleDelete = useCallback(async (id) => {
        try {
            await axiosInstance.delete(
                `${BackendUrl}/api/warehouse/documentTemplate/${id}`,
                { headers: { authorization: getToken() } }
            );
            toast.success("تم حذف القالب");
            if (editingId === id) { setEditingId(null); setHtmlContent(""); setTemplateName(""); }
            loadTemplates();
        } catch (err) {
            toast.error(err?.response?.data?.message || "لا يمكن حذف القالب الافتراضي");
        }
    }, [editingId, loadTemplates]);

    const copyVariable = useCallback((key) => {
        navigator.clipboard.writeText(`{{${key}}}`);
        toast.info(`تم نسخ {{${key}}}`);
    }, []);

    const handleNewTemplate = useCallback(() => {
        setNameDialogOpen(true);
        setNewTemplateName(`قالب ${DOCUMENT_TYPES[docTypeTab].label} — مخصص`);
    }, [docTypeTab]);

    const confirmNewTemplate = useCallback(async () => {
        setNameDialogOpen(false);
        setTemplateName(newTemplateName);
        setEditingId(null);
        await loadDefault();
    }, [newTemplateName, loadDefault]);

    const SIDE_TABS = [
        { label: "القوالب",      icon: <DescriptionIcon sx={{ fontSize: 14 }} /> },
        { label: "المتغيرات",    icon: <CodeIcon         sx={{ fontSize: 14 }} /> },
        { label: "أعمدة الجدول", icon: <TableChartIcon   sx={{ fontSize: 14 }} /> },
        { label: "تنسيق",        icon: <PaletteIcon      sx={{ fontSize: 14 }} /> },
    ];

    return (
        <Box dir="rtl" sx={{ p: { xs: 2, md: 3 } }}>
            {/* ── Page Header ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{
                    p: 1.2, borderRadius: 2,
                    background: "linear-gradient(135deg,#1976d2,#1565c0)",
                    color: "white", display: "flex",
                }}>
                    <DescriptionIcon />
                </Box>
                <Box>
                    <Typography variant="h5" fontWeight={700}>مصمّم قوالب الطباعة</Typography>
                    <Typography variant="body2" color="text.secondary">
                        تحكّم في كل تفاصيل الاستمارة — الأعمدة، التسميات، الألوان، التوقيعات
                    </Typography>
                </Box>
            </Box>

            {/* ── Document type tabs ── */}
            <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, mb: 2 }}>
                <Tabs
                    value={docTypeTab}
                    onChange={(_, v) => {
                        setDocTypeTab(v);
                        setEditingId(null);
                        setHtmlContent("");
                        setTemplateName("");
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {DOCUMENT_TYPES.map((dt) => (
                        <Tab key={dt.value} label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                {dt.label}
                                <Chip
                                    label={templates.filter((t) => t.document_type === dt.value).length}
                                    size="small"
                                    sx={{ height: 18, fontSize: "0.7rem" }}
                                />
                            </Box>
                        } />
                    ))}
                </Tabs>
            </Paper>

            <Grid container spacing={2}>
                {/* ── LEFT SIDEBAR ── */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <Tabs
                            value={sideTab}
                            onChange={(_, v) => setSideTab(v)}
                            variant="fullWidth"
                            sx={{
                                borderBottom: "1px solid", borderColor: "divider",
                                "& .MuiTab-root": { minHeight: 38, fontSize: "10px", gap: 0.3 },
                            }}
                        >
                            {SIDE_TABS.map((t, i) => (
                                <Tab key={i} icon={t.icon} label={t.label} iconPosition="top" />
                            ))}
                        </Tabs>

                        <CardContent sx={{ p: 1.5 }}>

                            {/* Tab 0 — Templates list */}
                            {sideTab === 0 && (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>القوالب</Typography>
                                        <Button size="small" startIcon={<AddIcon />} onClick={handleNewTemplate}>جديد</Button>
                                    </Box>
                                    <Divider sx={{ mb: 1 }} />
                                    {loading ? (
                                        <Box sx={{ textAlign: "center", py: 3 }}><CircularProgress size={24} /></Box>
                                    ) : filteredTemplates.length === 0 ? (
                                        <Alert severity="info" sx={{ fontSize: "11px" }}>
                                            لا توجد قوالب. اضغط "جديد".
                                        </Alert>
                                    ) : (
                                        <List dense>
                                            {filteredTemplates.map((t) => (
                                                <ListItem
                                                    key={t.id}
                                                    selected={editingId === t.id}
                                                    onClick={() => handleEdit(t)}
                                                    sx={{ borderRadius: 1, mb: 0.5, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                                                >
                                                    <ListItemText
                                                        primary={t.template_name}
                                                        secondary={t.is_default ? "افتراضي" : "مخصص"}
                                                        slotProps={{
                                                            primary:   { sx: { fontSize: "12px" } },
                                                            secondary: { sx: { fontSize: "10px" } },
                                                        }}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(t); }}>
                                                            <EditIcon sx={{ fontSize: 14 }} />
                                                        </IconButton>
                                                        {!t.is_default && (
                                                            <IconButton size="small" color="error"
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}>
                                                                <DeleteIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                        )}
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </>
                            )}

                            {/* Tab 1 — Variables */}
                            {sideTab === 1 && (
                                <>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>اضغط لنسخ</Typography>
                                    <Box sx={{ maxHeight: 480, overflow: "auto" }}>
                                        {AVAILABLE_VARIABLES.map((v) => (
                                            <Box key={v.key} sx={{
                                                display: "flex", alignItems: "center",
                                                justifyContent: "space-between",
                                                p: 0.5, mb: 0.3, borderRadius: 1,
                                                "&:hover": { bgcolor: "action.hover" },
                                            }}>
                                                <Box>
                                                    <Typography sx={{ fontSize: "11px", fontFamily: "monospace", color: "primary.main" }}>
                                                        {`{{${v.key}}}`}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "10px", color: "text.secondary" }}>{v.desc}</Typography>
                                                </Box>
                                                <Tooltip title="نسخ">
                                                    <IconButton size="small" onClick={() => copyVariable(v.key)}>
                                                        <ContentCopyIcon sx={{ fontSize: 13 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        ))}
                                    </Box>
                                </>
                            )}

                            {/* Tab 2 — Column Designer */}
                            {sideTab === 2 && (
                                <TableColumnDesigner htmlContent={htmlContent} onApply={setHtmlContent} />
                            )}

                            {/* Tab 3 — Style Editor */}
                            {sideTab === 3 && (
                                <HeaderStyleEditor htmlContent={htmlContent} onApply={setHtmlContent} />
                            )}

                        </CardContent>
                    </Card>
                </Grid>

                {/* ── RIGHT: Editor + Preview ── */}
                <Grid size={{ xs: 12, md: 9 }}>
                    {htmlContent ? (
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent>
                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
                                    <TextField
                                        label="اسم القالب"
                                        value={templateName}
                                        onChange={(e) => setTemplateName(e.target.value)}
                                        size="small"
                                        sx={{ flexGrow: 1, minWidth: 200 }}
                                    />
                                    <Button
                                        variant={showPreview ? "contained" : "outlined"}
                                        startIcon={showPreview ? <CodeIcon /> : <PreviewIcon />}
                                        onClick={() => setShowPreview(!showPreview)}
                                        size="small"
                                    >
                                        {showPreview ? "كود" : "معاينة"}
                                    </Button>
                                    <Button
                                        variant="outlined" color="warning"
                                        startIcon={<RestoreIcon />}
                                        onClick={loadDefault}
                                        size="small"
                                    >
                                        استعادة الافتراضي
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
                                        onClick={handleSave}
                                        disabled={saving}
                                        size="small"
                                        sx={{ background: "linear-gradient(135deg,#1976d2,#1565c0)", boxShadow: "0 4px 16px rgba(25,118,210,0.3)" }}
                                    >
                                        حفظ القالب
                                    </Button>
                                </Box>

                                {showPreview ? (
                                    <Paper elevation={1} sx={{
                                        p: 2, border: "2px dashed", borderColor: "primary.light",
                                        borderRadius: 2, minHeight: 400, overflow: "auto",
                                    }}>
                                        <Typography variant="caption" color="primary" fontWeight={700} sx={{ display: "block", mb: 1 }}>
                                            معاينة الهيكل (المتغيرات ستظهر كنص)
                                        </Typography>
                                        <Divider sx={{ mb: 1 }} />
                                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                    </Paper>
                                ) : (
                                    <TextField
                                        multiline
                                        minRows={22}
                                        maxRows={50}
                                        value={htmlContent}
                                        onChange={(e) => setHtmlContent(e.target.value)}
                                        fullWidth
                                        placeholder="اكتب كود HTML هنا..."
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    fontFamily: '"Fira Code","Consolas",monospace',
                                                    fontSize: "13px",
                                                    lineHeight: 1.6,
                                                    direction: "ltr",
                                                    textAlign: "left",
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ textAlign: "center", py: 10 }}>
                                <DescriptionIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                    اختر قالباً أو أنشئ قالباً جديداً
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    اضغط "جديد" لتحميل القالب الافتراضي وتخصيصه
                                </Typography>
                                <Button variant="contained" startIcon={<AddIcon />} onClick={handleNewTemplate}>
                                    إنشاء قالب جديد
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>

            {/* ── New template name dialog ── */}
            <Dialog open={nameDialogOpen} onClose={() => setNameDialogOpen(false)}>
                <DialogTitle>إنشاء قالب جديد</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus fullWidth
                        label="اسم القالب"
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNameDialogOpen(false)}>إلغاء</Button>
                    <Button variant="contained" onClick={confirmNewTemplate}>إنشاء</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}