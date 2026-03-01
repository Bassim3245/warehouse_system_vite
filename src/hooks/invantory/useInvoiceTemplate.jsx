import { useState, useCallback } from "react";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";

/* ─────────────────────────────────────────────────────
   HOOK: useInvoiceTemplate
   Fetches fully rendered HTML from backend
   ───────────────────────────────────────────────────── */
const useInvoiceTemplate = () => {
    const [renderedHtml, setRenderedHtml] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchRenderedDocument = useCallback(
        async (document_id, document_type) => {
            if (!document_id || !document_type) return;
            setLoading(true);
            try {
                const res = await axiosInstance.get(
                    `${BackendUrl}/api/warehouse/renderDocument/${document_id}/${document_type}`,
                    { headers: { authorization: getToken() } }
                );
                setRenderedHtml(res.data?.html || "");
            } catch (err) {
                console.error("Error fetching rendered document:", err);
                setRenderedHtml("<p style='color:red;text-align:center;'>حدث خطأ أثناء تحميل القالب</p>");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    console.log("renderedHtml", renderedHtml);
    const downloadPdf = useCallback(async (document_id, document_type) => {
        if (!document_id || !document_type) return;
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/downloadPdf/${document_id}/${document_type}`,
                {
                    headers: { authorization: getToken() },
                    responseType: "blob", // Important for binary data
                }
            );
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `document_${document_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Error downloading PDF:", err);
        }
    }, []);

    return { renderedHtml, loading, fetchRenderedDocument, downloadPdf };
};

export default useInvoiceTemplate;
