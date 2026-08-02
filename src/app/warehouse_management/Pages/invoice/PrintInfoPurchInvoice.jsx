import  { useState, useRef, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
import Print from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import { useReactToPrint } from "react-to-print";
import UnifiedInvoice from "./UnifiedInvoice";
import SignatureForm from "./signatureForm";
import useSingnature from "../../../../hooks/useSingnature";
import useInvoiceTemplate from "../../../../hooks/invantory/useInvoiceTemplate";

export const PrintPurchases = ({
  documentNumber,
  invoiceDate,
  document_id,
  searchParams,
}) => {
  const [open, setOpen] = useState(false);
  const printRef = useRef();
  const [refresh, setRefresh] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    if (open && document_id) {
      fetchRenderedDocument(document_id, searchParams.get("documentType"));
    }
  }, [open, document_id, fetchRenderedDocument]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة_توريد_${documentNumber}_${formatDateYearsMonth(invoiceDate)}`,
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
          onClick={() => downloadPdf(document_id, "in")}
          startIcon={<DownloadIcon />}
        >
          تحميل PDF
        </Button>
        <Button onClick={handleClose} variant="outlined">
          إغلاق
        </Button>
      </>
    ),
    [handlePrint, refresh, signauterData, document_id]
  );

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen} disableRipple>
        <Print sx={{ fontSize: "20px" }} />
        <span className="ms-2">طباعة </span>
      </Button>

      <PopupForm
        title=""
        open={open}
        onClose={handleClose}
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
