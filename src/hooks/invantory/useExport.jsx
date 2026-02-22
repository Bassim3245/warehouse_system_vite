import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { BackendUrl } from "../../redux/api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { getDataDocumentById } from "../../redux/documentState/documentsAction";
import usePermissionUser from "../usePermissionUser";
import useGetfactoryInformationByUserId from "../ManageWarehouseSetting/useGetfactoryInformationByUserId";
import useWarehpuseDataById from "../ManageWarehouseSetting/useWarehpuseDataById";

export const useExportData = ({ searchParams }) => {
  // Redux state
  const { document } = useSelector((state) => state?.document);
  const dispatch = useDispatch();
  const { dataUserById, dataUserLab } =
    usePermissionUser();
  const token = getToken();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const { warehouseDataBYId } = useWarehpuseDataById({ warehouseId: searchParams.get("warehouseId") });
  // Local state
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialMovements, setMaterialMovements] = useState([]);
  const [refreshButton, setRefreshButton] = useState(false);




  const initialFormData = useMemo(
    () => ({
      quantity: "",
      expiry_date: dayjs(new Date()),
      purchase_date: dayjs(new Date()),
      document_date: dayjs(new Date()),
      production_date: dayjs(new Date()),
      document_number: "",
      beneficiary: "",
      state_id: "",
      price: "",
      description: "",
      document_id: searchParams.get("id"),
      inventory_id: "",
      work_order_number: "",
    }),
    [searchParams]
  );
  const [formData, setFormData] = useState(initialFormData);
  const fetchDataByProjectId = useCallback(
    async (material) => {
      if (!material?.id) return;
      try {
        setLoading(true);
        const movementsResponse = await axiosInstance.get(
          `${BackendUrl}/api/warehouse/materialMovements/${material.id}`,
          {
            headers: { authorization: token },
          }
        );
        if (movementsResponse?.data?.data) {
          setMaterialMovements(movementsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching material movements:", error);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDateChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleMaterialSelect = useCallback(
    (material) => {
      setSelectedMaterial(material);
      fetchDataByProjectId(material);
    },
    [fetchDataByProjectId]
  );
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
  useEffect(() => {
    if (searchParams.get("id")) {
      dispatch(getDataDocumentById(searchParams.get("id")));
    }
  }, [dispatch, refreshButton, searchParams]);

  return {
    selectedMaterial,
    formData,
    setFormData,
    handleInputChange,
    handleDateChange,
    handleMaterialSelect,
    handleClearForm,
    materialMovements,
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
