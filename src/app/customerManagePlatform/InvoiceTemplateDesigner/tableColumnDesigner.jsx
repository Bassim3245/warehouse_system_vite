import { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import TableChartIcon from "@mui/icons-material/TableChart";
import InjectIcon from "@mui/icons-material/PlaylistAdd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { toast } from "react-toastify";
import { DEFAULT_COLUMNS } from "../../../constants/invoiceDocument";



function TableColumnDesigner({ htmlContent, onApply }) {
    const [columns, setColumns] = useState(
        DEFAULT_COLUMNS.map((c) => ({ ...c, visible: true }))
    );

    /* ---- Toggle visibility ---- */
    const toggleColumn = (id) => {
        setColumns((prev) =>
            prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c)
        );
    };

    /* ---- Rename ---- */
    const renameColumn = (id, newLabel) => {
        setColumns((prev) =>
            prev.map((c) => c.id === id ? { ...c, label: newLabel } : c)
        );
    };

    /* ---- Move Up / Down ---- */
    const moveColumn = (idx, direction) => {
        setColumns((prev) => {
            const arr = [...prev];
            const targetIdx = idx + direction;
            if (targetIdx < 0 || targetIdx >= arr.length) return prev;
            [arr[idx], arr[targetIdx]] = [arr[targetIdx], arr[idx]];
            return arr;
        });
    };

    /* ---- Generate loop-based HTML ---- */
    const generateTableHtml = useCallback(() => {
        const visibleCols = columns.filter((c) => c.visible);

        const headerCells = visibleCols.map((c) => `<th>${c.label}</th>`).join("");
        const dataCells = visibleCols.map((c) => `<td>{{${c.placeholder}}}</td>`).join("");

        return `<!-- جدول مواد مخصص -->
<table class="inv-table">
  <thead>
    <tr>${headerCells}</tr>
  </thead>
  <tbody>
    {{items_loop_start}}
    <tr>${dataCells}</tr>
    {{items_loop_end}}
  </tbody>
</table>`;
    }, [columns]);

    /* ---- Insert into template ---- */
    const handleInsert = useCallback(() => {
        if (!htmlContent) { toast.warning("افتح قالباً أولاً"); return; }
        const tableHtml = generateTableHtml();
        let updated = htmlContent;

        // Replace {{items_table}} placeholder
        if (updated.includes("{{items_table}}")) {
            updated = updated.replace("{{items_table}}", tableHtml);
        }
        // Replace existing custom table
        else if (updated.includes("<!-- جدول مواد مخصص -->")) {
            updated = updated.replace(
                /<!-- جدول مواد مخصص -->[\s\S]*?<\/table>/,
                tableHtml
            );
        }
        // Replace old {{items_rows}} based tables
        else if (updated.includes("{{items_rows}}")) {
            // Find the table containing items_rows and replace it
            updated = updated.replace(
                /<table[^>]*class="inv-table[^"]*"[^>]*>[\s\S]*?\{\{items_rows\}\}[\s\S]*?<\/table>/,
                tableHtml
            );
        }
        // Replace old loop-based tables
        else if (updated.includes("{{items_loop_start}}")) {
            updated = updated.replace(
                /<table[^>]*class="inv-table[^"]*"[^>]*>[\s\S]*?\{\{items_loop_start\}\}[\s\S]*?\{\{items_loop_end\}\}[\s\S]*?<\/table>/,
                tableHtml
            );
        }
        // Insert before closing div
        else {
            const lastDiv = updated.lastIndexOf("</div>");
            if (lastDiv !== -1) {
                updated = updated.slice(0, lastDiv) + "\n" + tableHtml + "\n" + updated.slice(lastDiv);
            } else {
                updated += "\n" + tableHtml;
            }
        }
        onApply(updated);
        toast.success("تم إدراج جدول المواد في القالب");
    }, [htmlContent, generateTableHtml, onApply]);

    const visibleCols = columns.filter((c) => c.visible);

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                <TableChartIcon sx={{ fontSize: 16 }} /> تصميم أعمدة الجدول
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                فعّل / أوقف / رتّب الأعمدة وغيّر تسمياتها
            </Typography>

            <Box sx={{ maxHeight: 340, overflow: "auto", mb: 1.5 }}>
                {columns.map((col, idx) => (
                    <Box key={col.id}
                        sx={{
                            display: "flex", alignItems: "center", gap: 0.3, mb: 0.5,
                            p: 0.5, borderRadius: 1,
                            bgcolor: col.visible ? "action.hover" : "transparent",
                            opacity: col.visible ? 1 : 0.4,
                            border: "1px solid",
                            borderColor: col.visible ? "divider" : "transparent",
                        }}>
                        {/* Drag handle / reorder arrows */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 0.2 }}>
                            <IconButton size="small" onClick={() => moveColumn(idx, -1)} disabled={idx === 0}
                                sx={{ p: 0, "& svg": { fontSize: 13 } }}>
                                <ArrowUpwardIcon />
                            </IconButton>
                            <DragIndicatorIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                            <IconButton size="small" onClick={() => moveColumn(idx, 1)} disabled={idx === columns.length - 1}
                                sx={{ p: 0, "& svg": { fontSize: 13 } }}>
                                <ArrowDownwardIcon />
                            </IconButton>
                        </Box>

                        <Switch
                            size="small"
                            checked={col.visible}
                            onChange={() => toggleColumn(col.id)}
                        />
                        <TextField
                            size="small"
                            value={col.label}
                            onChange={(e) => renameColumn(col.id, e.target.value)}
                            disabled={!col.visible}
                            inputProps={{ style: { fontSize: 11, padding: "2px 6px" } }}
                            sx={{ flex: 1, minWidth: 0 }}
                        />
                        <Tooltip title={`{{${col.placeholder}}}`}>
                            <Typography sx={{ fontSize: 9, color: "primary.main", fontFamily: "monospace", minWidth: 55, textAlign: "left" }}>
                                {col.placeholder}
                            </Typography>
                        </Tooltip>
                    </Box>
                ))}
            </Box>

            {/* Mini preview */}
            <Paper variant="outlined" sx={{ p: 0.5, mb: 1.5, overflowX: "auto" }}>
                <Typography variant="caption" color="primary" fontWeight={600} sx={{ display: "block", mb: 0.5 }}>
                    معاينة الجدول
                </Typography>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                    <thead>
                        <tr>
                            {visibleCols.map((c) => (
                                <th key={c.id} style={{
                                    background: "#000", color: "#fff",
                                    padding: "3px 5px", border: "1px solid #000",
                                    textAlign: "center", whiteSpace: "nowrap"
                                }}>{c.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {visibleCols.map((c) => (
                                <td key={c.id} style={{
                                    padding: "2px 5px", border: "1px solid #000",
                                    textAlign: "center", color: "#888", fontSize: 9,
                                }}>
                                    {c.id === "index" ? "1" : `{{${c.placeholder}}}`}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </Paper>

            <Button fullWidth variant="contained" startIcon={<InjectIcon />} onClick={handleInsert}
                sx={{ background: "linear-gradient(135deg,#000,#333)", boxShadow: "0 3px 12px rgba(0,0,0,0.3)", mb: 1 }}>
                إدراج الجدول في القالب
            </Button>

            <Button fullWidth variant="outlined" size="small"
                onClick={() => setColumns(DEFAULT_COLUMNS.map((c) => ({ ...c, visible: true })))}>
                إعادة تعيين كل الأعمدة
            </Button>
        </Box>
    );
}

export default TableColumnDesigner;