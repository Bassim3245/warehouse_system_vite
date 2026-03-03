import { useState, useEffect, useCallback, useMemo } from "react";
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
import TableChartIcon from "@mui/icons-material/TableChart";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

import { toast } from "react-toastify";
import { axiosInstance } from "../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../redux/api/axios";
import { getToken, getUserInformation } from "../../../utils/handelCookie";
import { typeDocument } from "../../../constants/arrayFuction";
import { AVAILABLE_VARIABLES } from "../../../constants/invoiceDocument";
import TableColumnDesigner from "./tableColumnDesigner";
import HeaderStyleEditor from "./headerStyleEditor";
import DynamicFieldDesigner from "./dynamicFieldDesigner";





/* ══════════════════════════════════════════════════════
   TABLE COLUMN DESIGNER — DND + Loop-Based HTML
   ══════════════════════════════════════════════════════ */


export default function InvoiceTemplateDesigner() {
    const user = getUserInformation();
    const companyId = user?.entity_id;

    const [docTypeTab, setDocTypeTab] = useState(0);
    const [sideTab, setSideTab] = useState(0);

    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [nameDialogOpen, setNameDialogOpen] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState("");

    const currentDocType = typeDocument[docTypeTab].value;

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
                    entity_id: companyId,
                    html_content: htmlContent,
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
            await axiosInstance.get(
                `${BackendUrl}/api/warehouse/removeDocumentTemplate/${id}`,
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
        { label: "القوالب", icon: <DescriptionIcon sx={{ fontSize: 14 }} /> },
        { label: "المتغيرات", icon: <CodeIcon sx={{ fontSize: 14 }} /> },
        { label: "أعمدة الجدول", icon: <TableChartIcon sx={{ fontSize: 14 }} /> },
        { label: "تنسيق", icon: <PaletteIcon sx={{ fontSize: 14 }} /> },
        { label: "حقول ديناميكية", icon: <ViewColumnIcon sx={{ fontSize: 14 }} /> },
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
                    {typeDocument.map((dt) => (
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
                                                            primary: { sx: { fontSize: "12px" } },
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

                            {/* Tab 4 — Dynamic Field Designer */}
                            {sideTab === 4 && (
                                <DynamicFieldDesigner htmlContent={htmlContent} onApply={setHtmlContent} />
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