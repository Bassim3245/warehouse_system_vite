import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";
import { DeleteItem } from "../../utils/Function";
import useGetfactoryInformationByUserId from "../ManageWarehouseSetting/useGetfactoryInformationByUserId";
import useUserData from "../genaral/useUserData";

const documentTypeConfig = {
  internal_transfer: "مستند نقل داخلي",
  out: "مستند تصدير",
  in: "مستند وارد",
  default: "مستند صادر",
};

export default function useInventoryDocuments({
  token,
  navigateUrl,
  documentType,
  documentTypeLabel: propDocumentTypeLabel,
  isExport = false,
  dataUserById,
  wareHouseData = [],
  refreshButton,
  has_factory,
  has_lab,
  has_warehouse,
  setRefreshButton,
}) {
  const navigate = useNavigate();
  const { dataUserLab } = useUserData();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateFilterType, setDateFilterType] = useState("document_date"); // 'document_date' or 'created_at'

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /** --------------------------------
   *  STATE
   ----------------------------------*/
  const [documentTypeValue, setDocumentTypeValue] = useState(documentType);

  // Sync state with prop if it changes
  useEffect(() => {
    if (documentType) {
      setDocumentTypeValue(documentType);
    }
  }, [documentType]);

  const [documentMaterials, setDocumentMaterials] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Always read from localStorage on init — don't rely on wareHouseData being loaded yet
  const [warehosueId, setWaerhouseId] = useState(
    () => localStorage.getItem("selectedWarehouseId") || ""
  );

  // ✅ FIX: Only auto-select first warehouse if NOTHING is saved in localStorage
  useEffect(() => {
    const savedId = localStorage.getItem("selectedWarehouseId");
    if (wareHouseData?.length > 0 && !savedId) {
      setWaerhouseId(wareHouseData[0].id);
    }
  }, [wareHouseData]);

  // Persist selections to localStorage
  useEffect(() => {
    if (warehosueId) {
      localStorage.setItem("selectedWarehouseId", warehosueId);
    }
  }, [warehosueId]);


  /** --------------------------------
   *  LABEL BASED ON TYPE
   ----------------------------------*/
  const activeDocumentType = documentTypeValue;

  const documentTypeLabel = useMemo(
    () =>
      propDocumentTypeLabel || documentTypeConfig[activeDocumentType] || documentTypeConfig.default,
    [activeDocumentType, propDocumentTypeLabel]
  );

  /** --------------------------------
   *  BUILD FETCH URL (MEMOIZED)
   ----------------------------------*/
  const requestUrl = useMemo(() => {
    const base = `${BackendUrl}/api/warehouse/documentGetDataByUserId`;
    const params = new URLSearchParams({
      documentType: activeDocumentType,
      searchTerm,
    });

    if (warehosueId) {
      params.append("warehouseId", warehosueId);
    }

    if (startDate) {
      params.append("startDate", startDate);
    }
    if (endDate) {
      params.append("endDate", endDate);
    }
    if (dateFilterType) {
      params.append("dateFilterType", dateFilterType);
    }

    if (has_warehouse && has_factory && has_lab) {
      params.append("labId", dataUserLab?.lab_id || dataUserById?.user_id);
    } else if (has_warehouse && has_factory) {
      params.append("factoryId", dataUserFactory?.factory_id || dataUserById?.user_id);
    } else if (has_warehouse && has_lab) {
      params.append("labId", dataUserLab?.lab_id || dataUserById?.user_id);
    } else if (has_warehouse && !warehosueId) {
      params.append("entityId", dataUserById?.entity_id || dataUserById?.user_id);
    } else if (!has_warehouse) {
      if (!dataUserById?.user_id) return null;
      params.append("userId", dataUserById?.user_id);
    }

    params.append("page", pagination.page);
    params.append("limit", pagination.limit);

    return `${base}?${params.toString()}`;
  }, [
    activeDocumentType,
    searchTerm,
    startDate,
    endDate,
    dateFilterType,
    has_factory,
    has_lab,
    has_warehouse,
    dataUserFactory?.factory_id,
    dataUserLab?.lab_id,
    dataUserById?.entity_id,
    dataUserById?.user_id,
    pagination.page,
    pagination.limit,
    warehosueId,
    documentType
  ]);

  /** --------------------------------
   *  FETCH DOCUMENTS
  ----------------------------------*/
  const fetchDocuments = useCallback(async () => {
    if (!requestUrl) return;

    if (has_warehouse && !warehosueId) {
      setAllDocuments([]);
      setDocumentMaterials([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(requestUrl, {
        headers: { authorization: token },
      });

      const docs = data?.data ?? [];
      setAllDocuments(docs);
      setDocumentMaterials(docs);

      setPagination((prev) => ({
        ...prev,
        total: data?.pagination?.total || 0,
        totalPages: data?.pagination?.totalPages || 1,
      }));
    } catch (error) {
      console.error("Error fetching document data:", error);
      setAllDocuments([]);
      setDocumentMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [requestUrl, token, has_warehouse, warehosueId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshButton, documentType]);

  /** --------------------------------
   *  WAREHOUSE CHANGE HANDLER
  ----------------------------------*/
  const handleWarehouseChange = useCallback((event, newValue) => {
    const newId = newValue?.id || "";
    setWaerhouseId(newId);
    // ✅ Clear localStorage if user clears the selection
    if (!newId) {
      localStorage.removeItem("selectedWarehouseId");
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  /** --------------------------------
   *  OPEN MOVEMENT PAGE
  ----------------------------------*/
  const openMovement = useCallback(
    (id) => {
      navigate(
        `${navigateUrl}?id=${id}&documentType=${activeDocumentType}&warehouseId=${warehosueId}`
      );
    },
    [navigate, navigateUrl, activeDocumentType, warehosueId]
  );

  /** --------------------------------
   *  DELETE DOCUMENT
  ----------------------------------*/
  const deleteDocument = useCallback(
    (id) => {
      DeleteItem(id, setRefreshButton, () => { }, token, "warehouse/deleteDocumentById");
    },
    [token]
  );

  /** --------------------------------
   *  COMPLETE / LOCK DOCUMENT
  ----------------------------------*/
  const completeItem = useCallback(
    async (id, isComplete) => {
      const swal = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success ms-3",
          cancelButton: "btn btn-danger",
          popup: "custom-swal-popup",
        },
        buttonsStyling: false,
      });

      const action = isComplete ? "إلغاء قفل" : "قفل";

      const result = await swal.fire({
        title: `هل أنت متأكد من ${action} المستند؟`,
        text: isComplete
          ? "سيتم إلغاء القفل وإتاحة التعديل"
          : "سيتم قفل المستند ولن يمكن تعديله",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "موافق",
        cancelButtonText: "تراجع",
      });

      if (!result.isConfirmed) return;

      try {
        await axiosInstance.post(
          `${BackendUrl}/api/warehouse/documentLock`,
          { document_id: id, is_complete: !isComplete },
          { headers: { authorization: token } }
        );
        toast.success("تم تحديث حالة المستند بنجاح");
        fetchDocuments();
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    [token, fetchDocuments]
  );

  /** --------------------------------
   *  RETURN API
  ----------------------------------*/
  return {
    documentTypeValue,
    setDocumentTypeValue,
    documentTypeLabel,
    loading,
    documentMaterials,
    warehosueId,
    handleWarehouseChange,
    handleLimitChange,
    openMovement,
    deleteDocument,
    completeItem,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateFilterType,
    setDateFilterType,
    pagination,
    setPagination,
  };
}