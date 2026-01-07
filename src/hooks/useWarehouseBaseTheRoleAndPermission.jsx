import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackendUrl } from "../redux/api/axios";
import { axiosInstance } from "../redux/api/axiosConfig";
import { getToken } from "../utils/handelCookie";
import {
  getAllWarehouse,
  getWarehouseDataByUserId,
} from "../redux/wharHosueState/WareHouseAction";
import { getAllFactory } from "../redux/FactoriesState/FactoriesAction";
import { getAllLab } from "../redux/LaboriesState/LabAction";
import { getDataUserWithFactoryById } from "../redux/getDataProjectById/getActions";
import { usePermissionsStructure } from "./useStructureCompany";
import usePermissionUser from "./usePermissionUser";

export const useWarehouseBaseTheRoleAndPermission = () => {
  const dispatch = useDispatch();
  const token = useMemo(() => getToken(), []);
  // Memoize permissions structure hook
  const {
    roles,
    dataUserById,
    applicationPermission,
  } = usePermissionUser();
  const { hierarchyConfig } = usePermissionsStructure();

  // Memoize selectors to prevent unnecessary re-renders
  const { factoryData } = useSelector((state) => state.factory);
  const { wareHouseData } = useSelector((state) => state?.wareHouse);
  const { labData } = useSelector((state) => state?.lab);
  const [dataUserFactory, setDataUserFactory] = useState([]);
  // States

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

  // Use switch statement to handle different permission combinations
  const permissionType = getPermissionType(has_lab, has_warehouse, has_factory);

  useEffect(() => {
    // Only execute if we have the required data
    if (!entityId || !roles || !applicationPermission) {
      return;
    }

    switch (permissionType) {
      case "ALL_PERMISSIONS":
        // Handle lab, warehouse, and factory logic
        dispatch(
          getAllFactory({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getAllLab({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getAllWarehouse({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getDataUserWithFactoryById({ user_id: userId, entity_id: entityId })
        );
        getFactoryRelatedUserData();
        dispatch(getWarehouseDataByUserId(userId));

        break;

      case "LAB_WAREHOUSE":
        dispatch(
          getAllLab({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getAllWarehouse({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(getWarehouseDataByUserId(userId));

        break;

      case "LAB_FACTORY":
        dispatch(
          getAllLab({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getAllFactory({ entity_id: entityId, roles, applicationPermission })
        );
        break;

      case "WAREHOUSE_FACTORY":
        dispatch(
          getAllWarehouse({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(
          getAllFactory({ entity_id: entityId, roles, applicationPermission })
        );
        dispatch(getWarehouseDataByUserId(userId));
        break;

      case "LAB_ONLY":
        dispatch(
          getAllLab({ entity_id: entityId, roles, applicationPermission })
        );
        break;

      case "WAREHOUSE_ONLY":
        dispatch(
          getAllWarehouse({ entity_id: entityId, roles, applicationPermission })
        );
        break;

      case "FACTORY_ONLY":
        dispatch(
          getAllFactory({ entity_id: entityId, roles, applicationPermission })
        );
        break;

      case "NO_PERMISSIONS":
      default:
        // No permissions or unhandled case
        console.warn(
          "No valid permissions found or unhandled permission combination"
        );
        break;
    }
  }, [dispatch, entityId, roles, applicationPermission, permissionType]);

  const getFactoryRelatedUserData = useCallback(async () => {
    if (!entityId || !userId) return;
    try {
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getFactoryAndUserData?user_id=${userId}&entity_id=${entityId}`,
        {
          headers: { authorization: token },
        }
      );
      setDataUserFactory(response?.data?.data[0] || {});
    } catch (error) {
      console.error("Error fetching warehouse and user data:", error);
    }
  }, [entityId, userId, token]);


  const getWarehouseDataIfUserId = useCallback(() => {
    if (userId) {
    }
  }, [dispatch, userId, entityId]);
  useEffect(() => {
    // dispatchFactoryLabWarehouseData();
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
