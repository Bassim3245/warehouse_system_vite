import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { BackendUrl } from "../../redux/api/axios";
import { DeleteItem } from "../../utils/Function";
import usePermissionUser from "../usePermissionUser";
import useGetfactoryInformationByUserId from "../ManageWarehouseSetting/useGetfactoryInformationByUserId";

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
  const { dataUserLab } = usePermissionUser();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  /** --------------------------------
   *  STATE
  ----------------------------------*/

  const [documentTypeValue, setDocumentTypeValue] = useState(
    isExport ? "internal_consumption" : documentType || "internal_consumption"
  );
  const [documentMaterials, setDocumentMaterials] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [warehosueId, setWaerhouseId] = useState(
    wareHouseData?.[0]?.id || ""
  );

  /** --------------------------------
   *  LABEL BASED ON TYPE
  ----------------------------------*/
  const activeDocumentType = isExport ? documentTypeValue : documentType;

  const documentTypeLabel = useMemo(
    () =>
      documentTypeConfig[activeDocumentType] || documentTypeConfig.default,
    [activeDocumentType]
  );

  /** --------------------------------
   *  BUILD FETCH URL (MEMOIZED)
  ----------------------------------*/
  const requestUrl = useMemo(() => {
    const base = `${BackendUrl}/api/warehouse/documentGetDataByUserId`;
    const params = new URLSearchParams({ documentType: activeDocumentType, searchTerm });

    // warehouse + factory + lab
    if (has_warehouse && has_factory && has_lab) {
      params.append("labId", dataUserLab?.lab_id || dataUserById?.user_id);
    }
    // warehouse + factory
    else if (has_warehouse && has_factory) {
      params.append(
        "factoryId",
        dataUserFactory?.factory_id || dataUserById?.user_id
      );
    }
    // warehouse + lab
    else if (has_warehouse && has_lab) {
      params.append("labId", dataUserLab?.lab_id || dataUserById?.user_id);
    }
    // only warehouse
    else if (has_warehouse) {
      params.append(
        "entityId",
        dataUserById?.entity_id || dataUserById?.user_id
      );
    } else {
      if (!dataUserById?.user_id) return null;
      params.append("userId", dataUserById?.user_id);
    }
    params.append("page", pagination.page);
    params.append("limit", pagination.limit);

    return `${base}?${params.toString()}`;
  }, [
    activeDocumentType,
    searchTerm,
    has_factory,
    has_lab,
    has_warehouse,
    dataUserFactory?.factory_id,
    dataUserLab?.lab_id,
    dataUserById?.entity_id,
    dataUserById?.user_id,
    pagination.page,
    pagination.limit,
  ]);

  /** --------------------------------
   *  FETCH DOCUMENTS
  ----------------------------------*/
  const fetchDocuments = useCallback(async () => {
    if (!requestUrl) return;

    try {
      setLoading(true);

      const { data } = await axiosInstance.get(requestUrl, {
        headers: { authorization: token },
      });

      const docs = data?.data ?? [];
      setAllDocuments(docs);

      setPagination({
        page: data?.pagination?.page || 1,
        limit: data?.pagination?.limit || 10,
        total: data?.pagination?.total || 0,
        totalPages: data?.pagination?.totalPages || 1,
      });
      setDocumentMaterials(
        warehosueId ? docs.filter((d) => d.warehouse_id === warehosueId) : docs
      );
    } catch (error) {
      console.error("Error fetching document data:", error);
      setAllDocuments([]);
      setDocumentMaterials([]);
    } finally {
      setLoading(false);
    }
  }, [requestUrl, token, warehosueId]);

  /** --------------------------------
   *  TRIGGER FETCH WHEN NEEDED
  ----------------------------------*/
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshButton ,pagination.page,pagination.limit]);

  /** --------------------------------
   *  WAREHOUSE CHANGE HANDLER
  ----------------------------------*/
  const handleWarehouseChange = useCallback(
    (event, newValue) => {
      const newId = newValue?.id || "";
      setWaerhouseId(newId);

      const filtered = newId
        ? allDocuments.filter((d) => d.warehouse_id === newId)
        : allDocuments;

      setDocumentMaterials(filtered);
    },
    [allDocuments]
  );

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
        toast.error(error.response?.data?.message || "حدث خطأ");
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
    openMovement,
    deleteDocument,
    completeItem,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination,
  };
}
