import { getUserInformation } from "../../../../utils/handelCookie";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { formatDateAr } from "../../../../utils/formatData";
import { buildDefaultConfig } from "../../../../hooks/invantory/useInvoiceTemplate";
import { resolveColumnValue, resolveHeaderValue } from "../../../../Helpers/helperInvoice";
import { InfoCard } from "../../../../components/InventoryComponents/Invoice.jsX";


/* ──────────────────────────────────────────────────────────
   Small header info card
   ────────────────────────────────────────────────────────── */


/* ══════════════════════════════════════════════════════════
   UNIFIED INVOICE COMPONENT
   Works for any document type (in / out / transfer / etc.)
   controlled entirely by the template config injected as prop.
   If no template: falls back to buildDefaultConfig(document_type).
   ══════════════════════════════════════════════════════════ */
const UnifiedInvoice = ({
    printRef,
    invoiceData = [],
    documentNumber,
    totalQuantity,
    totalPrice,
    documentInfo,   // the document object (works for both in and out)
    signauterData,
    document_type,  // "in" | "out" | "internal_transfer" | etc.
    template,       // injected from useInvoiceTemplate — null means use default
}) => {
    const userInfo = getUserInformation();

    // Use custom template if exists, otherwise use per-type default
    const cfg = template || buildDefaultConfig(document_type || "out");

    const visibleHeaderFields = (cfg.headerFields || [])
        .filter((f) => f.visible)
        .sort((a, b) => a.order - b.order);

    const visibleColumns = (cfg.tableColumns || [])
        .filter((c) => c.visible)
        .sort((a, b) => a.order - b.order);

    return (
        <div ref={printRef}>
            <style>{`
        @media print {
          @page { size: landscape; margin: 8mm; }
        }
      `}</style>

            <Box
                sx={{ maxWidth: "297mm", mx: "auto", p: 2, border: "1px solid #bdc3c7" }}
                dir="rtl"
            >
                {/* ── Letterhead ── */}
                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50", mb: 0.5 }}>
                            {cfg.header?.line1 || "جمهورية العراق"}
                        </Typography>
                        <Typography sx={{ fontSize: "14px", color: "#34495e", fontWeight: "600", mb: 0.5 }}>
                            {cfg.header?.line2 || "وزارة الصناعة والمعادن"}
                        </Typography>
                        <Typography sx={{ fontSize: "12px", color: "#34495e", fontWeight: "600", pb: 1, display: "inline-block" }}>
                            {userInfo?.Entities_name}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: "15px", color: "#2c3e50", fontWeight: "bold" }}>
                            {cfg.header?.title ||
                                (document_type === "in" ? "مستند استلام مخزني" : "مستند صرف مخزني")}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ fontSize: "13px", color: "#34495e", fontWeight: "bold" }}>
                            {cfg.header?.systemName || "نظام ادارة الخزين في المخازن"}
                        </Typography>
                    </Box>
                </Box>

                <hr style={{ margin: "4px 0 8px 0" }} />

                {/* ── Header Fields (dynamic from template) ── */}
                {visibleHeaderFields.length > 0 && (
                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        {visibleHeaderFields.map((field) => {
                            const value = resolveHeaderValue(field.key, documentInfo, documentNumber);
                            if (!value) return null;
                            return (
                                <Grid size={{ xs: 3 }} key={field.key}>
                                    <InfoCard
                                        label={field.label}
                                        value={value}
                                        accent={field.key === "document_number"}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}

                {/* ── Extra Dynamic Fields (from document.dynamicFields) ── */}
                {cfg.dynamicFieldsVisible &&
                    documentInfo?.dynamicFields &&
                    documentInfo.dynamicFields.length > 0 && (
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            {documentInfo.dynamicFields.map((field, idx) => (
                                <Grid size={{ xs: 3 }} key={idx}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            p: 1,
                                            border: "1px dashed #bdc3c7",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "11px", mb: 0.5, color: "#7f8c8d" }}>
                                            {field.field_label}
                                        </Typography>
                                        <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "#2c3e50" }}>
                                            {field.field_type === "date"
                                                ? formatDateAr(field.value)
                                                : field.value || "---"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                {/* ── Material Table ── */}
                <Box sx={{ mt: 2, overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "11px",
                            direction: "rtl",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#2c3e50", color: "white" }}>
                                {visibleColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        style={{
                                            border: "1px solid #bdc3c7",
                                            padding: "6px 8px",
                                            textAlign: "center",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.map((item, rowIdx) => (
                                <tr
                                    key={rowIdx}
                                    style={{ backgroundColor: rowIdx % 2 === 0 ? "#ffffff" : "#f8f9fa" }}
                                >
                                    {visibleColumns.map((col) => (
                                        <td
                                            key={col.key}
                                            style={{
                                                border: "1px solid #bdc3c7",
                                                padding: "5px 8px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {resolveColumnValue(col.key, item, rowIdx)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

                {/* ── Summary Footer ── */}
                <Grid container spacing={2} sx={{ mt: 1.5, mb: 2 }}>
                    {[
                        { label: "عدد البنود", value: invoiceData?.length || 0 },
                        {
                            label: "نوع الوصل",
                            value: document_type === "in" ? "واردات مواد" : "صادرات مواد",
                        },
                        { label: "إجمالي الكمية", value: totalQuantity || 0 },
                        {
                            label: "القيمة الإجمالية",
                            value: totalPrice
                                ? `${totalPrice.toLocaleString("ar-EG")} د.ع`
                                : "0 د.ع",
                        },
                    ].map((s, i) => (
                        <Grid size={{ xs: 3 }} key={i}>
                            <Box sx={{ textAlign: "center", p: 1 }}>
                                <Typography sx={{ fontSize: "11px", mb: 0.5, fontWeight: "bold" }}>
                                    {s.label}
                                </Typography>
                                <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                                    {s.value}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* ── Signature Zones ── */}
                {signauterData && signauterData.length > 0 && (
                    <Grid container spacing={2} dir="rtl" sx={{ minHeight: "100px" }}>
                        {signauterData.map((item, index) => (
                            <Grid size key={index}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Box
                                        sx={{
                                            height: "60px",
                                            border: "1px solid #2c3e50",
                                            mb: 2,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "10px", fontStyle: "italic" }}>
                                            منطقة التوقيع
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontWeight: "bold", fontSize: "12px", mb: 1, textTransform: "uppercase" }}>
                                        {item?.title}
                                    </Typography>
                                    <Box sx={{ textAlign: "right", fontSize: "10px" }}>
                                        <Typography sx={{ mb: 0.5 }}>الاسم: ................................</Typography>
                                        <Typography sx={{ mb: 0.5 }}>التاريخ: ................................</Typography>
                                        <Typography>الختم: ................................</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </div>
    );
};

export default UnifiedInvoice;
