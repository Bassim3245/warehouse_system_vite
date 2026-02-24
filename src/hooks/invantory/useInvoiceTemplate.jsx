import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";

/* ─────────────────────────────────────────────────────
   DEFAULT CONFIGS
   These are used when no custom template is saved.
   ───────────────────────────────────────────────────── */

export const DEFAULT_EXPORT_COLUMNS = [
    { key: "index", label: "ت", visible: true, order: 1 },
    { key: "work_order_number", label: "رقم أمر العمل", visible: true, order: 2 },
    { key: "item_code", label: "رمز المادة", visible: true, order: 3 },
    { key: "item_name", label: "اسم المادة", visible: true, order: 4 },
    { key: "specification", label: "المواصفات المادة", visible: true, order: 5 },
    { key: "quantity", label: "الكمية", visible: true, order: 6 },
    { key: "measuring_unit", label: "وحدة القياس", visible: true, order: 7 },
    { key: "price", label: "سعر الوحدة", visible: true, order: 8 },
    { key: "total_price", label: "المبلغ الاجمالي", visible: true, order: 9 },
];

export const DEFAULT_IMPORT_COLUMNS = [
    { key: "index", label: "ت", visible: true, order: 1 },
    { key: "item_code", label: "رمز المادة", visible: true, order: 2 },
    { key: "item_name", label: "اسم المادة", visible: true, order: 3 },
    { key: "quantity", label: "الكمية", visible: true, order: 4 },
    { key: "measuring_unit", label: "وحدة القياس", visible: true, order: 5 },
    { key: "price", label: "السعر", visible: true, order: 6 },
    { key: "specification", label: "مواصفات المادة", visible: true, order: 7 },
    { key: "total_price", label: "السعر الكلي", visible: true, order: 8 },
    { key: "purchase_date", label: "تاريخ الشراء", visible: true, order: 9 },
    { key: "supplier", label: "الجهة الموردة", visible: true, order: 10 },
];

export const DEFAULT_HEADER_FIELDS = [
    { key: "document_number", label: "رقم المستند", visible: true, order: 1 },
    { key: "document_date", label: "تاريخ المستند", visible: true, order: 2 },
    { key: "warehouse_name", label: "اسم المخزن", visible: true, order: 3 },
    { key: "center_cost", label: "رقم مركز الكلفة", visible: true, order: 4 },
    { key: "account_number", label: "رقم الحساب", visible: true, order: 5 },
    { key: "type_movement", label: "نوع الحركة", visible: true, order: 6 },
    { key: "type_movement_code", label: "رمز الحركة", visible: true, order: 7 },
    { key: "beneficiary", label: "الجهة المستفيدة", visible: true, order: 8 },
];

export const DEFAULT_HEADER_TEXT = {
    line1: "جمهورية العراق",
    line2: "وزارة الصناعة والمعادن",
    title: "مستند مخزني",
    systemName: "نظام ادارة الخزين في المخازن",
};

export const buildDefaultConfig = (documentType) => ({
    header: { ...DEFAULT_HEADER_TEXT },
    headerFields: DEFAULT_HEADER_FIELDS.map((f) => ({ ...f })),
    dynamicFieldsVisible: true,
    tableColumns: (documentType === "in"
        ? DEFAULT_IMPORT_COLUMNS
        : DEFAULT_EXPORT_COLUMNS
    ).map((c) => ({ ...c })),
});

/* ─────────────────────────────────────────────────────
   HOOK: useInvoiceTemplate
   Fetches saved template or returns default config
   ───────────────────────────────────────────────────── */
const useInvoiceTemplate = ({ entity_id, document_type }) => {
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTemplate = useCallback(async () => {
        if (!entity_id || !document_type) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/invoiceTemplate/${entity_id}/${document_type}`,
                { headers: { authorization: getToken() } }
            );
            // If backend returns null data means no custom template → use default
            const savedTemplate = res.data?.data;
            if (savedTemplate && savedTemplate.config) {
                setTemplate(savedTemplate.config);
            } else {
                setTemplate(buildDefaultConfig(document_type));
            }
        } catch {
            setTemplate(buildDefaultConfig(document_type));
        } finally {
            setLoading(false);
        }
    }, [entity_id, document_type]);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    return { template, loading, refetch: fetchTemplate };
};

export default useInvoiceTemplate;
