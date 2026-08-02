// ===== REACT HOOKS =====
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ===== CUSTOM HOOKS =====
import useUserPermissions from "../genaral/useUserPermissions";
import useGetfactoryInformationByUserId from "./useGetfactoryInformationByUserId";

// ===== REDUX RTK QUERY HOOKS =====
import {
  useGetAllWarehouseQuery,
  useGetWarehouseByLabIdQuery,
  useGetAllWarehouseByFactoryAndLabQuery,
  useGetWarehouseDataByUserIdQuery,
} from "../../redux/wharHosueState/WarehouseApi";

// ===== UTILS =====
import { getCompanyStructure } from "../../utils/handelCookie";
import useUserData from "../genaral/useUserData";

/**
 * هوك مخصص لجلب جميع بيانات المخازن
 * يدير عملية جلب المخازن بناءً على صلاحيات المستخدم ونوع المجموعة
 * @returns {Object} بيانات المخازن وحالة التحميل ووظائف التحديث
 */
const useGetAllWarehouse = () => {
  // ===== PERMISSION HOOKS =====
  const { roles, applicationPermission } = useUserPermissions();
  const { dataUserLab, dataUserById } = useUserData()
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  // ===== STATE MANAGEMENT =====
  const [refreshKey, setRefreshKey] = useState(false);
  const hasFetched = useRef(false);

  // RTK Query Config State
  const [queryConfig, setQueryConfig] = useState({ type: null, params: null });

  // ===== MEMOIZED VALUES =====
  const entityId = useMemo(() => dataUserById?.entity_id, [dataUserById?.entity_id]);
  const userId = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);
  const labId = useMemo(() => dataUserLab?.lab_id, [dataUserLab?.lab_id]);
  const factoryId = useMemo(() => dataUserFactory?.factory_id, [dataUserFactory?.factory_id]);
  const hierarchyConfig = useMemo(() => getCompanyStructure(), []);

  // ===== PERMISSION CONFIGURATION =====
  const {
    has_lab = false,
    has_factory = false,
    has_warehouse = false,
    has_production_warehouse = false,
    has_main_warehouse = false,
    has_branch_warehouse = false,
  } = hierarchyConfig || {};

  // ===== RTK QUERY HOOKS =====
  // These hooks will only execute when their respective type is set in queryConfig
  const { data: allData, isFetching: allLoading } = useGetAllWarehouseQuery(
    queryConfig.params,
    { skip: queryConfig.type !== "getAllWarehouse" || !queryConfig.params }
  );

  const { data: labData, isFetching: labLoading } = useGetWarehouseByLabIdQuery(
    queryConfig.params,
    { skip: queryConfig.type !== "getWarehouseByLabId" || !queryConfig.params }
  );

  const { data: factoryData, isFetching: factoryLoading } = useGetAllWarehouseByFactoryAndLabQuery(
    queryConfig.params,
    { skip: queryConfig.type !== "getAllWarehouseByFactoryAndLab" || !queryConfig.params }
  );

  const { data: userData, isFetching: userLoading } = useGetWarehouseDataByUserIdQuery(
    userId,
    { skip: queryConfig.type !== "getWarehouseDataByUserId" || !userId }
  );

  const wareHouseData = allData || labData || factoryData || userData || [];
  const loading = allLoading || labLoading || factoryLoading || userLoading;

  // ===== WAREHOUSE DATA FETCHING LOGIC =====
  const determineQueryConfig = useCallback(() => {
    if (!entityId || !roles || !applicationPermission) {
      return;
    }

    try {
      const userRole = dataUserById?.group_name;
      let newConfig = { type: null, params: null };

      // Helper to set params for getAllWarehouse
      const setAllWarehouse = (warehouse_type = "") => {
        newConfig = {
          type: "getAllWarehouse",
          params: {
            entity_id: entityId,
            warehouse_type,
            checkPermissionUser: roles?.get_all_report_for_factory_lab_warehouse?._id,
            applicationPermission: applicationPermission.warehouseSystem._id,
          },
        };
      };

      switch (userRole) {
        case "Admin":
          if (has_warehouse) {
            setAllWarehouse("");
          }
          break;

        case "lab user":
          if (has_lab && labId && has_branch_warehouse) {
            newConfig = {
              type: "getWarehouseByLabId",
              params: { entity_id: entityId, lab_id: labId, warehouseType: "branch" },
            };
          }
          break;

        case "Factory user":
          if (has_factory && factoryId) {
            newConfig = {
              type: "getAllWarehouseByFactoryAndLab",
              params: { entity_id: entityId, factory_id: factoryId, lab_id: null, warehouseType: "main" },
            };
          }
          break;

        case "warehouse_Manager":
          if (has_warehouse && userId) {
            newConfig = { type: "getWarehouseDataByUserId", params: {} };
          }
          break;

        case "production_manager":
          if (has_production_warehouse) {
            if (has_factory && factoryId) {
              newConfig = {
                type: "getAllWarehouseByFactoryAndLab",
                params: { entity_id: entityId, factory_id: factoryId, lab_id: null },
              };
            } else {
              setAllWarehouse("production");
            }
          }
          break;

        case "warehouse_main_manger":
          if (has_main_warehouse) {
            setAllWarehouse("main");
          }
          break;

        default:
          if (has_factory && has_lab && has_warehouse) {
            if (labId) {
              newConfig = {
                type: "getWarehouseByLabId",
                params: { entity_id: entityId, lab_id: labId, warehouseType: "intermediate" },
              };
            } else if (factoryId) {
              newConfig = {
                type: "getAllWarehouseByFactoryAndLab",
                params: { entity_id: entityId, factory_id: factoryId, lab_id: null },
              };
            }
          } else if (has_factory && factoryId) {
            newConfig = {
              type: "getAllWarehouseByFactoryAndLab",
              params: { entity_id: entityId, factory_id: factoryId, lab_id: null },
            };
          } else if (has_lab && labId) {
            newConfig = {
              type: "getWarehouseByLabId",
              params: { entity_id: entityId, lab_id: labId, warehouseType: "intermediate" },
            };
          } else {
            setAllWarehouse("");
          }
          break;
      }

      setQueryConfig(newConfig);
    } catch (error) {
      console.error("خطأ في تحديد إعدادات المخازن:", error);
    }
  }, [
    entityId,
    labId,
    factoryId,
    roles,
    applicationPermission,
    dataUserById?.group_name,
    has_factory,
    has_lab,
    has_warehouse,
    has_branch_warehouse,
    has_main_warehouse,
    has_production_warehouse,
    userId,
  ]);

  // ===== EFFECTS =====
  useEffect(() => {
    hasFetched.current = false;
    determineQueryConfig();
  }, [determineQueryConfig, refreshKey]);

  useEffect(() => {
    if (hasFetched.current) return;
    if (!entityId || !roles || !applicationPermission) return;

    const userRole = dataUserById?.group_name;
    const needsLab = userRole === "lab user" || (userRole !== "Admin" && userRole !== "warehouse_Manager" && userRole !== "warehouse_main_manger" && userRole !== "production_manager" && userRole !== "Factory user");
    const needsFactory = userRole === "Factory user" || userRole === "production_manager" || (userRole !== "Admin" && userRole !== "warehouse_Manager" && userRole !== "warehouse_main_manger" && userRole !== "lab user");

    if (needsLab && !labId && has_lab) return;
    if (needsFactory && !factoryId && has_factory) return;

    determineQueryConfig();
    hasFetched.current = true;
  }, [entityId, roles, applicationPermission, labId, factoryId, dataUserById?.group_name, has_lab, has_factory, determineQueryConfig]);

  // ===== RETURN VALUES =====
  return {
    wareHouseData,
    loading,
    setRefreshKey,
    refreshKey,
    entityId,
    userId,
    labId,
    factoryId,
    hierarchyConfig,
  };
};

export default useGetAllWarehouse;
