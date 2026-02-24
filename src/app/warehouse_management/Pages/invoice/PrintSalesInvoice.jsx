import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Print from "@mui/icons-material/Print";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import { useReactToPrint } from "react-to-print";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { getToken, getUserInformation } from "../../../../utils/handelCookie";
import UnifiedInvoice from "./UnifiedInvoice";
import useSingnature from "../../../../hooks/useSingnature";
import SignatureForm from "./signatureForm";
import useInvoiceTemplate from "../../../../hooks/invantory/useInvoiceTemplate";

const PrintSales = ({ document_id, document, document_type }) => {
  const [open, setOpen] = useState(false);
  const printRef = useRef();
  const [invoiceData, setInvoiceData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  // ---------------------------
  // Get entity_id from logged-in user
  // ---------------------------
  const userInfo = getUserInformation();
  const entity_id = userInfo?.entity_id;

  // ---------------------------
  // 🖼 Fetch invoice template (custom or default)
  // ---------------------------
  const { template } = useInvoiceTemplate({
    entity_id,
    document_type,
  });

  // ---------------------------
  // 🔒 Signature hook
  // ---------------------------
  const { signauterData } = useSingnature({
    documentId: document_id,
    refresh,
    setRefresh,
  });

  // ---------------------------
  // 📌 Fetch invoice data
  // ---------------------------
  const getDataInvoice = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/api/warehouse/getMaterialExportByDocumentId?document_id=${document_id}&documentType=${document_type}`,
        { headers: { authorization: getToken() } }
      );
      setInvoiceData(response?.data?.data || []);
    } catch (error) {
      console.error("Error searching materials:", error);
      setInvoiceData([]);
    }
  }, [document_id, document_type]);

  useEffect(() => {
    getDataInvoice();
  }, [getDataInvoice]);

  // ---------------------------
  // 🧮 Totals
  // ---------------------------
  const summary = useMemo(() => {
    const totalAmount = invoiceData.reduce((sum, i) => sum + i.total, 0);
    const totalQuantity = invoiceData.reduce(
      (sum, i) => sum + parseFloat(i.total_quantity || 0),
      0
    );
    const totalPrice = invoiceData.reduce(
      (sum, i) =>
        sum +
        parseFloat(i.price || 0) * parseFloat(i.total_quantity || 0),
      0
    );
    const invoiceDate =
      invoiceData.length > 0 ? invoiceData[0].purchase_date : new Date();
    const documentNumber =
      invoiceData.length > 0 ? invoiceData[0].document_number : "غير متوفر";

    return { totalAmount, totalQuantity, totalPrice, invoiceDate, documentNumber };
  }, [invoiceData]);

  // ---------------------------
  // 🖨 Print handler
  // ---------------------------
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `فاتورة_تصدير_${summary.documentNumber}_${formatDateYearsMonth(
      summary.invoiceDate
    )}`,
  });

  const formContent = useMemo(
    () => (
      <UnifiedInvoice
        invoiceData={invoiceData}
        documentNumber={summary.documentNumber}
        invoiceDate={summary.invoiceDate}
        totalQuantity={summary.totalQuantity}
        totalPrice={summary.totalPrice}
        totalAmount={summary.totalAmount}
        printRef={printRef}
        documentInfo={document}
        signauterData={signauterData}
        document_type={document_type}
        template={template}
      />
    ),
    [invoiceData, summary, document, signauterData, template]
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
