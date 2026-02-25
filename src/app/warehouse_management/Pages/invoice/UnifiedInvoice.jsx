import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/* ══════════════════════════════════════════════════════════
   UNIFIED INVOICE — HTML Template Renderer
   Receives pre-rendered HTML from backend and displays it.
   Used by both PrintSalesInvoice and PrintInfoPurchInvoice.
   ══════════════════════════════════════════════════════════ */
const UnifiedInvoice = ({ printRef, renderedHtml, loading }) => {
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!renderedHtml) {
        return (
            <Box sx={{ textAlign: "center", p: 4, color: "#999" }}>
                لا يوجد محتوى للعرض
            </Box>
        );
    }

    return (
        <div ref={printRef}>
            <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        </div>
    );
};

export default React.memo(UnifiedInvoice);
