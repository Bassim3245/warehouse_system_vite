import React, { useState } from "react";
import Button from "@mui/material/Button";
import Print from "@mui/icons-material/Print";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import { useReactToPrint } from "react-to-print";
import UnifiedInvoice from "./UnifiedInvoice";
import SignatureForm from "./signatureForm";
import useSingnature from "../../../../hooks/useSingnature";
import useInvoiceTemplate from "../../../../hooks/invantory/useInvoiceTemplate";
import { getUserInformation } from "../../../../utils/handelCookie";

export const PrintPurchases = ({
  invoiceData,
  documentNumber,
  invoiceDate,
  totalQuantity,
  totalPrice,
  totalAmount,
  document_id,
  documentInfo,
}) => {
  const [open, setOpen] = useState(false);
  const printRef = React.useRef();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [refresh, setRefresh] = useState(false);

  const userInfo = getUserInformation();
  const entity_id = userInfo?.entity_id;

  // 🖼 Fetch template (custom or default)
  const { template } = useInvoiceTemplate({
    entity_id,
    document_type: "in",
  });

  const { signauterData } = useSingnature({
    documentId: document_id,
    refresh,
    setRefresh,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة_توريد_${documentNumber}_${formatDateYearsMonth(invoiceDate)}`,
  });

  const renderFormContent = () => (
    <>
      <UnifiedInvoice
        invoiceData={invoiceData}
        documentNumber={documentNumber}
        totalQuantity={totalQuantity}
        totalPrice={totalPrice}
        printRef={printRef}
        documentInfo={documentInfo}
        signauterData={signauterData}
        document_type="in"
        template={template}
      />
    </>
  );

  const renderFormActions = () => (
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
      <Button onClick={handleClose} variant="outlined">
        إغلاق
      </Button>
    </>
  );

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen} disableRipple>
        <Print sx={{ fontSize: "20px" }} />
        <span className="ms-2">طباعة </span>
      </Button>
      <PopupForm
        title={""}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        is_margin={true}
        fullheight={true}
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};
