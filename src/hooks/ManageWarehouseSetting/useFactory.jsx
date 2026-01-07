import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePermissionUser from "../usePermissionUser";
import { usePermissionsStructure } from "../useStructureCompany";
import { getAllFactory } from "../../redux/FactoriesState/FactoriesAction";

export const useFactoryManagement = () => {
  const dispatch = useDispatch();
  const { factoryData } = useSelector((state) => state.factory);
  const { roles, applicationPermission, dataUserById } = usePermissionUser();
  const { has_factory, allow_to_manage_all_lab } = usePermissionsStructure();
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );

  const dispatchWarehouseData = useCallback(() => {
    if (!entityId || !roles || !applicationPermission) {
      return;
    }
    try {
      const userRole = dataUserById?.group_name;
      switch (userRole) {
        case "Admin":
          dispatch(
            getAllFactory({ entity_id: entityId, roles, applicationPermission })
          );
          break;
        // case "Factory user":
        //   if (has_factory) {
        //     dispatch(
        //       getAllFactory({
        //         entity_id: entityId,
        //         roles,
        //         applicationPermission,
        //       })
        //     );
        //   }
        //   break;
        default:
          console.log("صلاحيات غير مصرح بها");
          break;
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات المخازن:", error);
    }
  }, [
    dispatch,
    entityId,
    roles,
    applicationPermission,
    dataUserById?.group_name,
    allow_to_manage_all_lab,
    has_factory,
  ]);

  useEffect(() => {
    dispatchWarehouseData();
  }, [dispatchWarehouseData]);
  return useMemo(
    () => ({
      factoryData,
    }),
    [factoryData]
  );
};
