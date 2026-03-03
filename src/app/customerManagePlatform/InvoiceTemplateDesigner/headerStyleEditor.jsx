import  { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { toast } from "react-toastify";
function HeaderStyleEditor({ htmlContent, onApply }) {
    const [thBg, setThBg] = useState("#000000");
    const [thColor, setThColor] = useState("#ffffff");
    const [thFontSize, setThFontSize] = useState(11);
    const [tdFontSize, setTdFontSize] = useState(11);
    const [borderColor, setBorderColor] = useState("#000000");
    const [accentColor, setAccentColor] = useState("#000000");

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
            <ColorRow label="لون خلفية الهيدر" value={thBg} onChange={setThBg} />
            <ColorRow label="لون نص الهيدر" value={thColor} onChange={setThColor} />
            <ColorRow label="لون الحدود" value={borderColor} onChange={setBorderColor} />
            <ColorRow label="لون رقم المستند" value={accentColor} onChange={setAccentColor} />
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

export default HeaderStyleEditor;
