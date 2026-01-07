// components/StoreData/useStoreData.js
import { useEffect, useState, useMemo, useCallback } from "react";
import { getToken } from "../utils/handelCookie";
import { BackendUrl } from "../redux/api/axios";
import { useNavigate } from "react-router-dom";
import { getWarehouseColumns } from "../utils/ColumnsGridData";
import { renderMenuItem } from "../utils/Function";
import { usePermissionsStructure } from "./useStructureCompany";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../redux/api/axiosConfig";
import usePermissionUser from "./usePermissionUser";
import useUnitMeasuring from "./useUnitMeasuring";

const useStoreData = ({ selectedWarehouse }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = useMemo(() => getToken(), []);
  const {
    dataUserById,
    rtl,
    dataUserLab,
    roles,
    permissionData,
    applicationPermission,
  } = usePermissionUser();
  const { dataUnitMeasuring } = useUnitMeasuring();
  const { hierarchyConfig } = usePermissionsStructure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshButton, setRefreshButton] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterZeroValue, setFilterZeroValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataMaterials, setDataMaterials] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const handelSearch = useCallback(() => {
    setPage(1);
  }, []);

  const openMovement = useCallback(
    (id, url) => {
      navigate(`${url}?material_id=${id}`);
    },
    [navigate]
  );

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () =>
      getWarehouseColumns({
        t,
        token,
        setRefreshButton,
        dataUserById,
        dataUnitMeasuring,
        selectedWarehouse,
        dataUserLab,
        renderMenuItem,
        openMovement,
        hierarchyConfig,
        setAnchorEl,
        roles,
        applicationPermission,
      }),
    [
      t,
      token,
      dataUserById,
      dataUnitMeasuring,
      selectedWarehouse,
      dataUserLab,
      openMovement,
      hierarchyConfig,
      setAnchorEl,
      roles,
      applicationPermission,
    ]
  );

  // Memoize rows to prevent unnecessary re-renders
  const rows = useMemo(
    () =>
      dataMaterials?.map((item, index) => ({
        index: index + 1,
        ...item,
      })) || [],
    [dataMaterials]
  );

  // Memoize fetch all data function
  const fetchAllData = useCallback(async () => {
    // Don't fetch data if no warehouse is selected
    if (!selectedWarehouse) {
      setDataMaterials([]);
      setTotalPages(0);
      setTotalItems(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.append("search_term", searchTerm);
      searchParams.append("warehouse_id", selectedWarehouse);
      if (dataUserById?.entity_id)
        searchParams.append("entity_id", dataUserById.entity_id);
      searchParams.append("page", page);
      searchParams.append("limit", limit);
      searchParams.append("filter_status", filterStatus);
      searchParams.append("filter_zero_value", filterZeroValue);
      const materialsResponse = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/SearchStoreData?${searchParams.toString()}`,
        { headers: { authorization: token } }
      );
      if (materialsResponse?.data) {
        console.log("Fetched data - page:", page, "limit:", limit, "items:", materialsResponse.data.response?.length);
        setDataMaterials(materialsResponse.data.response);
        setTotalPages(materialsResponse.data.pagination.totalPages || 0);
        setTotalItems(materialsResponse.data.pagination.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    selectedWarehouse, // Added selectedWarehouse to dependencies
    dataUserById?.entity_id,
    page,
    limit,
    filterStatus,
    filterZeroValue,
    token
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, refreshButton]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      dataUserById,
      rtl,
      dataUserLab,
      handelSearch,
      searchTerm,
      setSearchTerm,
      filterStatus,
      setFilterStatus,
      filterZeroValue,
      setFilterZeroValue,
      loading,
      columns,
      rows,
      totalPages,
      totalItems,
      page,
      setPage,
      limit,
      setLimit,
      refreshButton,
      setRefreshButton,
      dataUnitMeasuring,
      hierarchyConfig,
      fetchAllData,
      roles,
      permissionData,
    }),
    [
      dataUserById,
      rtl,
      dataUserLab,
      handelSearch,
      searchTerm,
      filterStatus,
      filterZeroValue,
      loading,
      columns,
      rows,
      totalPages,
      totalItems,
      page,
      limit,
      refreshButton,
      dataUnitMeasuring,
      hierarchyConfig,
      fetchAllData,
      roles,
      permissionData,
    ]
  );
};

export default useStoreData;
