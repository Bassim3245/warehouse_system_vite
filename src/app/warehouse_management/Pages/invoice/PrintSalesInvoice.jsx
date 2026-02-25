import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Print from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import { useReactToPrint } from "react-to-print";
import UnifiedInvoice from "./UnifiedInvoice";
import useSingnature from "../../../../hooks/useSingnature";
import SignatureForm from "./signatureForm";
import useInvoiceTemplate from "../../../../hooks/invantory/useInvoiceTemplate";

const PrintSales = ({ document_id, document, document_type }) => {
  const [open, setOpen] = useState(false);
  const printRef = useRef();
  const [refresh, setRefresh] = useState(false);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  // Fetch rendered HTML from backend
  const { renderedHtml, loading, fetchRenderedDocument, downloadPdf } = useInvoiceTemplate();

  // Signatures
  const { signauterData } = useSingnature({
    documentId: document_id,
    refresh,
    setRefresh,
  });

  // Fetch rendered document when popup opens
  useEffect(() => {
    if (open && document_id && document_type) {
      fetchRenderedDocument(document_id, document_type);
    }
  }, [open, document_id, document_type, fetchRenderedDocument]);

  // Print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة_${document?.document_number || ""}_${formatDateYearsMonth(new Date())}`,
  });

  const formContent = useMemo(
    () => (
      <UnifiedInvoice
        printRef={printRef}
        renderedHtml={renderedHtml}
        loading={loading}
      />
    ),
    [renderedHtml, loading]
  );

  const formActions = useMemo(
    () => (
      <>
        <SignatureForm
          documentId={document_id}
          refresh={refresh}
          setRefresh={setRefresh}
          signauterData={signauterData}
        />
        <ButtonTheme
          variant="contained"
          color="primary"
          onClick={handlePrint}
          startIcon={<Print />}
        >
          طباعة
        </ButtonTheme>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => downloadPdf(document_id, document_type)}
          startIcon={<DownloadIcon />}
        >
          تحميل PDF
        </Button>
        <Button onClick={toggleOpen} variant="outlined">
          إغلاق
        </Button>
      </>
    ),
    [handlePrint, refresh, signauterData, document_id, toggleOpen]
  );

  return (
    <div>
      <Button variant="outlined" onClick={toggleOpen} disableRipple>
        <Print sx={{ fontSize: "20px" }} />
        <span className="ms-2">طباعة </span>
      </Button>

      <PopupForm
        title=""
        open={open}
        onClose={toggleOpen}
        setOpen={setOpen}
        width="100%"
        is_margin={true}
        fullheight={true}
        content={formContent}
        footer={formActions}
      />
    </div>
  );
};

export default React.memo(PrintSales);
