import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";
import { toast } from "react-toastify";
import { getUserInformation } from "../../utils/handelCookie";

/**
 * useDocumentFields
 * Fetches active field definitions for a given document_type,
 * and optionally loads existing field values for a document (edit mode).
 */
const useDocumentFields = ({ documentType = null, documentId = null }) => {
    const [fields, setFields] = useState([]);
    const [fieldValues, setFieldValues] = useState({}); // { field_id: value }
    const [loadingFields, setLoadingFields] = useState(false);
    const [loadingValues, setLoadingValues] = useState(false);
    const userInformation = getUserInformation()
    /* ── Fetch active field definitions ─────────────────── */
    const fetchFields = useCallback(async () => {
        if (!documentType) return;
        setLoadingFields(true);
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/fieldDefinitions/active?entity_id=${userInformation.entity_id}&document_type=${documentType}`
            );
            setFields(res.data?.data || []);
        } catch (err) {
            console.error("useDocumentFields - fetchFields error:", err);
            setFields([]);
        } finally {
            setLoadingFields(false);
        }
    }, [documentType]);

    /* ── Fetch existing field values (edit mode) ─────────── */
    const fetchValues = useCallback(async () => {
        if (!documentId) return;
        setLoadingValues(true);
        try {
            const res = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/fieldValues/${documentId}`
            );
            const raw = res.data?.data || [];
            // Build a flat map: { field_id: value }
            const map = {};
            raw.forEach((item) => {
                map[item.field_id] = item.value ?? "";
            });
            setFieldValues(map);
        } catch (err) {
            console.error("useDocumentFields - fetchValues error:", err);
            setFieldValues({});
        } finally {
            setLoadingValues(false);
        }
    }, [documentId]);

    useEffect(() => {
        fetchFields();
    }, [fetchFields]);

    useEffect(() => {
        if (documentId) fetchValues();
        else setFieldValues({});
    }, [fetchValues, documentId]);

    /* ── Save field values for a document ───────────────── */
    const saveFieldValues = useCallback(
        async (docId, valuesMap) => {
            if (!docId) return;
            const fieldValues = Object.entries(valuesMap).map(([field_id, value]) => ({
                field_id: Number(field_id),
                value: value ?? "",
            }));
            try {
                await axiosInstance.post(
                    `${BackendUrl}/api/warehouse/fieldValues/${docId}`,
                    { fieldValues }
                );
            } catch (err) {
                toast.error("خطأ في حفظ الحقول الإضافية");
                throw err;
            }
        },
        []
    );

    return {
        fields,
        fieldValues,
        setFieldValues,
        loadingFields,
        loadingValues,
        refreshFields: fetchFields,
        refreshValues: fetchValues,
        saveFieldValues,
    };
};

export default useDocumentFields;
