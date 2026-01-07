import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { getDataDocumentById } from "../../redux/documentState/documentsAction";
import usePermissionUser from "../usePermissionUser";
import useGetfactoryInformationByUserId from "../ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { getWarehouseDataById } from "../../redux/wharHosueState/WareHouseAction";

export const useImportData = ({ searchParams }) => {
  const documentId = searchParams.get("id");
  const warehouseId = searchParams.get("warehouseId");

  /** ============ REDUX ============ */
  const dispatch = useDispatch();
  const { document } = useSelector((state) => state.document);
  const { warehouseDataBYId } = useSelector((state) => state.wareHouse);

  const { 
    dataUserById, 
    dataUserLab, 
    stateMaterial, 
    applicationPermission 
  } = usePermissionUser();

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const token = getToken();

  /** ============ STATE ============ */
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  const [refreshButton, setRefreshButton] = useState(false);


  /** ============ INITIAL FORM DATA ============ */
  const initialFormData = useMemo(
    () => ({
      quantity: "",
      expiry_date: dayjs(),
      purchase_date: dayjs(),
      document_date: dayjs(),
      production_date: dayjs(),
      document_number: "",
      beneficiary: "",
      state_id: "",
      price: "",
      description: "",
      document_id: documentId,
      inventory_id: "",
    }),
    [documentId]
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
          },
          headers: { authorization: token },
        }
      );

      setInvoiceData(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching import inventory:", error);
      setInvoiceData([]);
    } finally {
      setLoading(false);
    }
  }, [documentId, applicationPermission?.warehouseSystem?._id, token]);

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
      document_date: "",
    }));
  }, []);

  /** ============ FETCH DOCUMENT INFO ============ */
  useEffect(() => {
    if (documentId) {
      dispatch(getDataDocumentById(documentId));
    }
  }, [dispatch, documentId, refreshButton]);

  /** ============ FETCH WAREHOUSE INFO ============ */
  useEffect(() => {
    if (warehouseId) {
      dispatch(getWarehouseDataById(warehouseId));
    }
  }, [dispatch, warehouseId]);

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
  };
};
