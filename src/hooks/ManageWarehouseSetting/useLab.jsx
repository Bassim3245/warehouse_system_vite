import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllLab,
} from "../../redux/LaboriesState/LabAction";
import usePermissionUser from "../usePermissionUser";
import { usePermissionsStructure } from "../useStructureCompany";
import useGetfactoryInformationByUserId from "./useGetfactoryInformationByUserId";
import { getDataUserWithWareHouseDataById } from "../../redux/getDataProjectById/getActions";

export const useLabManagement = () => {
  const dispatch = useDispatch();
  const { labData } = useSelector((state) => state?.lab);
  const { dataUserFactory } = useGetfactoryInformationByUserId();

  const { roles, applicationPermission, dataUserById } = usePermissionUser();
  const {
    has_lab,
    has_factory,
    has_warehouse,
    allow_to_manage_all_lab,
    has_production_warehouse,
    has_main_warehouse,
    allow_show_data_l,
    hierarchyConfig,
  } = usePermissionsStructure();
  const userId = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);
  const factoryId = useMemo(
    () => dataUserFactory?.factory_id,
    [dataUserFactory?.factory_id]
  );
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );

  const dispatchWarehouseData = useCallback(() => {
    // التحقق من وجود البيانات المطلوبة
    if (!entityId || !roles || !applicationPermission) {
      return;
    }

    try {
      // ===== SWITCH STATEMENT BASED ON USER ROLE =====
      const userRole = dataUserById?.group_name;
      switch (userRole) {
        case "Admin":
          if (has_lab && has_factory && has_warehouse) {
            dispatch(
              getAllLab({ entity_id: entityId, roles, applicationPermission })
            );
          }
          if (has_lab && has_factory && !has_warehouse) {
            dispatch(
              getAllLab({ entity_id: entityId, roles, applicationPermission })
            );
          }
          if (has_lab && !has_factory && has_warehouse) {
            dispatch(
              getAllLab({ entity_id: entityId, roles, applicationPermission })
            );
          }
          if (has_lab && !has_factory && !has_warehouse) {
            dispatch(
              getAllLab({ entity_id: entityId, roles, applicationPermission })
            );
          }
          break;
        case "lab user":
          if (has_lab) {
            if (allow_to_manage_all_lab) {
              dispatch(
                getAllLab({ entity_id: entityId, roles, applicationPermission })
              );
            } else {
              dispatch(
                getDataUserWithWareHouseDataById({
                  entity_id: entityId,
                  roles,
                  applicationPermission,
                })
              );
            }
          }
          break;
        case "Factory user":
          if (has_factory && factoryId) {
            dispatch(
              getAllLab({ entity_id: entityId, roles, applicationPermission })
            );
          }
          break;
        case "warehouse_Manager":
          if (has_warehouse) {
            if (userId) {
              dispatch(
                getAllLab({ entity_id: entityId, roles, applicationPermission })
              );
            }
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات المخازن:", error);
    }
  }, [
    dispatch,
    entityId,
    factoryId,
    roles,
    applicationPermission,
    dataUserById?.group_name,
    allow_to_manage_all_lab,
    has_factory,
    has_lab,
    has_warehouse,
  ]);

  const dispatchFactoryLabWarehouseData = useCallback(() => {
    if (!entityId) return;
    if (allow_to_manage_all_lab && has_lab) {
      dispatch(
        getAllLab({ entity_id: entityId, roles, applicationPermission })
      );
    }
  }, []);
  useEffect(() => {
    dispatchWarehouseData();
  }, [dispatchFactoryLabWarehouseData]);

  return useMemo(
    () => ({
      labData,
      has_lab,
      has_factory,
      has_warehouse,
      allow_to_manage_all_lab,
      has_production_warehouse,
      has_main_warehouse,
      allow_show_data_l,
      hierarchyConfig,
    }),
    [
      labData,
      has_lab,
      has_factory,
      has_warehouse,
      allow_to_manage_all_lab,
      has_production_warehouse,
      has_main_warehouse,
      allow_show_data_l,
      hierarchyConfig,
    ]
  );
};
