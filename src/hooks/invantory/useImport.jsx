import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { getDataDocumentById } from "../../redux/documentState/documentsAction";
import useUserPermissions from "../genaral/useUserPermissions";
import useGetfactoryInformationByUserId from "../ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { useGetWarehouseDataByIdQuery } from "../../redux/wharHosueState/WarehouseApi";
import useUserData from "../genaral/useUserData";
import useStateMaterial from "../genaral/useStatMaterila";

export const useImportData = ({ searchParams }) => {
  const documentId = searchParams.get("id");
  const warehouseId = searchParams.get("warehouseId");

  /** ============ REDUX ============ */
  const dispatch = useDispatch();
  const { document } = useSelector((state) => state.document);

  const { data: warehouseDataBYId } = useGetWarehouseDataByIdQuery(
    warehouseId,
    { skip: !warehouseId }
  );

  const { applicationPermission } = useUserPermissions();
  const { stateMaterial } = useStateMaterial()
  const { dataUserById, dataUserLab } = useUserData()

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const token = getToken();

  /** ============ STATE ============ */
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [refreshButton, setRefreshButton] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  /** ============ INITIAL FORM DATA ============ */
  const initialFormData = useMemo(
    () => ({
      quantity: "",
      expiry_date: null,
      purchase_date: null,
      production_date: null,
      beneficiary: "",
      state_id: "",
      price: "",
      description: "",
      document_id: documentId,
      inventory_id: "",
      note: "",
      inspection_number: "",
      inspection_date: null,
      return_date: null,
      has_inspection: false,
      document_type: searchParams.get("documentType") || "in",
    }),
    [documentId],
  );

  const [formData, setFormData] = useState(initialFormData);

  /** ============ FETCH IMPORT INVENTORY ============ */
  const getDataImportInventory = useCallback(async () => {
    if (!documentId || !applicationPermission?.warehouseSystem?._id) return;

    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/materialImportMovements`,
        {
          params: {
            document_id: documentId,
            applicationPermission: applicationPermission?.warehouseSystem?._id,
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: { authorization: token },
        },
      );

      setInvoiceData(res?.data?.data || []);
      setPagination(res?.data?.pagination || {});
    } catch (error) {
      console.error("Error fetching import inventory:", error);
      setInvoiceData([]);
    } finally {
      setLoading(false);
    }
  }, [
    documentId,
    applicationPermission?.warehouseSystem?._id,
    token,
    pagination.limit,
    pagination.page,
  ]);

  /** ============ FORM HANDLERS ============ */

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDateChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleMaterialSelect = useCallback((material) => {
    setSelectedMaterial(material);
    setInvoiceData([]);
  }, []);

  const handleClearForm = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      quantity: "",
      price: "",
      beneficiary: "",
      description: "",
      check_number: "",
      inspection_number: "",
      inspection_date: dayjs(),
      has_inspection: false,
      return_date: null,
    }));
  }, []);

  /** ============ FETCH DOCUMENT INFO ============ */
  useEffect(() => {
    if (documentId) {
      dispatch(getDataDocumentById(documentId));
    }
  }, [dispatch, documentId, refreshButton]);

  /** ============ FETCH IMPORT MOVEMENTS ============ */
  useEffect(() => {
    getDataImportInventory();
  }, [getDataImportInventory, refreshButton]);

  /** ============ RETURN HOOK DATA ============ */
  return {
    selectedMaterial,
    selectedWarehouse,
    setSelectedWarehouse,
    formData,
    setFormData,
    stateMaterial,
    handleInputChange,
    handleDateChange,
    handleMaterialSelect,
    handleClearForm,
    getDataImportInventory,
    invoiceData,
    setSelectedMaterial,
    document,
    refreshButton,
    setRefreshButton,
    dataUserById,
    dataUserLab,
    loading,
    dataUserFactory,
    warehouseDataBYId,
    pagination,
    setPagination,
  };
};
