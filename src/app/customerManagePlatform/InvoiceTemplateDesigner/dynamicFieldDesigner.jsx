import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import InjectIcon from "@mui/icons-material/PlaylistAdd";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { toast } from "react-toastify";
function DynamicFieldDesigner({ htmlContent, onApply }) {
    const [dynCols, setDynCols] = useState(2);
    const [showDynFields, setShowDynFields] = useState(true);

    const applyDynLayout = useCallback(() => {
        if (!htmlContent) { toast.warning("افتح قالباً أولاً"); return; }
        let updated = htmlContent;

        if (!showDynFields) {
            // Remove dynamic_fields placeholder entirely
            updated = updated.replace(/\{\{dynamic_fields\}\}/g, "");
            // Also remove any existing rendered dyn-fields-table
            updated = updated.replace(/<table class="dyn-fields-table">[\s\S]*?<\/table>/g, "");
            onApply(updated);
            toast.success("تم إخفاء الحقول الديناميكية");
            return;
        }

        // Ensure {{dynamic_fields}} is present - if not, add it before items_table
        if (!updated.includes("{{dynamic_fields}}")) {
            const itemsIdx = updated.indexOf("{{items_table}}");
            if (itemsIdx !== -1) {
                updated = updated.slice(0, itemsIdx) + "{{dynamic_fields}}\n\n  " + updated.slice(itemsIdx);
            }
        }

        // Update the dyn-fields-table CSS to use the chosen column count
        // Each field occupies 2 <td> (label + value), so table width adjusts automatically
        const colWidthLabel = Math.floor(50 / dynCols);
        const colWidthValue = Math.ceil(50 / dynCols);

        const newDynCss = `.dyn-fields-table .dyn-label { font-weight:bold; background:#f5f5f5; width:${colWidthLabel}%; text-align:right; }`;

        // Replace existing .dyn-label rule
        const labelRegex = /\.dyn-fields-table\s+\.dyn-label\s*\{[^}]*\}/;
        if (labelRegex.test(updated)) {
            updated = updated.replace(labelRegex, newDynCss);
        }

        onApply(updated);
        toast.success(`تم تعيين عدد أعمدة الحقول الديناميكية إلى ${dynCols}`);
    }, [htmlContent, dynCols, showDynFields, onApply]);

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                <ViewColumnIcon sx={{ fontSize: 16 }} /> تصميم الحقول الديناميكية
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                تحكم في عرض وتخطيط الحقول الإضافية
            </Typography>

            <FormControlLabel
                control={<Switch checked={showDynFields} onChange={(e) => setShowDynFields(e.target.checked)} />}
                label={<Typography sx={{ fontSize: 12 }}>{showDynFields ? "الحقول ظاهرة" : "الحقول مخفية"}</Typography>}
                sx={{ mb: 2, display: "flex" }}
            />

            {showDynFields && (
                <>
                    <Typography sx={{ fontSize: 11, mb: 0.5, color: "text.secondary" }}>
                        عدد الحقول في كل صف: {dynCols}
                    </Typography>
                    <Slider
                        value={dynCols} min={1} max={4} step={1}
                        marks={[
                            { value: 1, label: "1" },
                            { value: 2, label: "2" },
                            { value: 3, label: "3" },
                            { value: 4, label: "4" },
                        ]}
                        onChange={(_, v) => setDynCols(v)}
                        size="small"
                        sx={{ mb: 2 }}
                    />

                    {/* Mini Preview */}
                    <Paper variant="outlined" sx={{ p: 1, mb: 2 }}>
                        <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                            معاينة التخطيط
                        </Typography>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                            <tbody>
                                <tr>
                                    {Array.from({ length: dynCols }).map((_, i) => (
                                        <React.Fragment key={i}>
                                            <td style={{ border: "1px solid #000", padding: "3px 5px", fontWeight: "bold", background: "#f5f5f5", textAlign: "right" }}>
                                                حقل {i + 1}
                                            </td>
                                            <td style={{ border: "1px solid #000", padding: "3px 5px", textAlign: "center" }}>
                                                قيمة
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </Paper>
                </>
            )}

            <Button fullWidth variant="contained" startIcon={<InjectIcon />} onClick={applyDynLayout}
                sx={{ background: "linear-gradient(135deg,#000,#333)", boxShadow: "0 3px 12px rgba(0,0,0,0.3)" }}>
                تطبيق على القالب
            </Button>
        </Box>
    );
}

export default DynamicFieldDesigner;
