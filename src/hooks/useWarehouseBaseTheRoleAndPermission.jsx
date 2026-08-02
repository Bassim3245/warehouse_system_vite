import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BackendUrl } from "../redux/api/axios";
import { axiosInstance } from "../redux/api/axiosConfig";
import { getToken, getUserInformation } from "../utils/handelCookie";

import useGetfactoryInformationByUserId from "./ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { usePermissionsStructure } from "./useStructureCompany";
import useUserPermissions from "./genaral/useUserPermissions";

// Import RTK Query Hooks
import {
  useGetAllWarehouseQuery,
  useGetWarehouseDataByUserIdQuery,
} from "../redux/wharHosueState/WarehouseApi";
import { useGetAllFactoryQuery } from "../redux/FactoriesState/FactoryApi";
import { useGetAllLabQuery } from "../redux/LaboriesState/LabApi";

export const useWarehouseBaseTheRoleAndPermission = () => {
  const dispatch = useDispatch();
  const token = useMemo(() => getToken(), []);

  // Memoize permissions structure hook
  const {
    roles,
    applicationPermission,
  } = useUserPermissions();
  const dataUserById = getUserInformation()
  const { hierarchyConfig } = usePermissionsStructure();

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const userId = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );
  const {
    has_lab = false,
    has_factory = false,
    has_warehouse = false,
  } = hierarchyConfig || {};

  // Helper function to determine permission type
  const getPermissionType = (has_lab, has_warehouse, has_factory) => {
    if (has_lab && has_warehouse && has_factory) return "ALL_PERMISSIONS";
    if (has_lab && has_warehouse) return "LAB_WAREHOUSE";
    if (has_lab && has_factory) return "LAB_FACTORY";
    if (has_warehouse && has_factory) return "WAREHOUSE_FACTORY";
    if (has_lab) return "LAB_ONLY";
    if (has_warehouse) return "WAREHOUSE_ONLY";
    if (has_factory) return "FACTORY_ONLY";
    return "NO_PERMISSIONS";
  };

  const permissionType = getPermissionType(has_lab, has_warehouse, has_factory);

  const shouldFetchAllWarehouse = [
    "ALL_PERMISSIONS",
    "LAB_WAREHOUSE",
    "WAREHOUSE_FACTORY",
    "WAREHOUSE_ONLY"
  ].includes(permissionType) && !!entityId && !!roles && !!applicationPermission;

  const shouldFetchUserWarehouse = [
    "ALL_PERMISSIONS",
    "LAB_WAREHOUSE",
    "WAREHOUSE_FACTORY"
  ].includes(permissionType) && !!entityId && !!roles && !!applicationPermission && !!userId;

  const shouldFetchFactory = [
    "ALL_PERMISSIONS",
    "LAB_FACTORY",
    "WAREHOUSE_FACTORY",
    "FACTORY_ONLY"
  ].includes(permissionType) && !!entityId && !!roles && !!applicationPermission;

  const shouldFetchLab = [
    "ALL_PERMISSIONS",
    "LAB_WAREHOUSE",
    "LAB_FACTORY",
    "LAB_ONLY"
  ].includes(permissionType) && !!entityId && !!roles && !!applicationPermission;

  // RTK Query: fetch all warehouse data
  const { data: allWarehouseData } = useGetAllWarehouseQuery(
    {
      entity_id: entityId,
      warehouse_type: "",
      checkPermissionUser: roles?.get_all_report_for_factory_lab_warehouse?._id,
      applicationPermission: applicationPermission?.warehouseSystem?._id,
    },
    { skip: !shouldFetchAllWarehouse }
  );

  // RTK Query: fetch warehouse data by user ID
  const { data: userWarehouseData } = useGetWarehouseDataByUserIdQuery(
    userId,
    { skip: !shouldFetchUserWarehouse }
  );

  // RTK Query: fetch factory data
  const { data: factoryData = [] } = useGetAllFactoryQuery(
    { entity_id: entityId, roles, applicationPermission },
    { skip: !shouldFetchFactory }
  );

  // RTK Query: fetch lab data
  const { data: labData = [] } = useGetAllLabQuery(
    { entity_id: entityId, roles, applicationPermission },
    { skip: !shouldFetchLab }
  );

  const wareHouseData = allWarehouseData || userWarehouseData || [];

  useEffect(() => {
    if (!entityId || !roles || !applicationPermission) {
      return;
    }

    if (permissionType === "ALL_PERMISSIONS") {
      // Factory user data is now fetched automatically by useGetfactoryInformationByUserId
    }
  }, [dispatch, entityId, roles, applicationPermission, permissionType, userId]);

  const getWarehouseDataIfUserId = useCallback(() => {
    if (userId) {
    }
  }, [userId]);

  useEffect(() => {
    getWarehouseDataIfUserId();
  }, [getWarehouseDataIfUserId]);

  return useMemo(
    () => ({
      dataUserFactory,
      wareHouseData,
      factoryData,
      labData,
    }),
    [dataUserFactory, wareHouseData, factoryData, labData]
  );
};
