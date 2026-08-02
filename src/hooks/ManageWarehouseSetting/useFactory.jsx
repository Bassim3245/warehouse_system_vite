import { useMemo } from "react";
import useUserPermissions from "../genaral/useUserPermissions";
import { useGetAllFactoryQuery } from "../../redux/FactoriesState/FactoryApi";
import { getUserInformation } from "../../utils/handelCookie";

export const useFactoryManagement = () => {
  const { roles, applicationPermission } = useUserPermissions();
  const dataUserById = getUserInformation()
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );

  const shouldFetch = !!entityId && !!roles && !!applicationPermission;

  const { data: factoryData = [] } = useGetAllFactoryQuery(
    { entity_id: entityId, roles, applicationPermission },
    { skip: !shouldFetch }
  );

  return useMemo(
    () => ({
      factoryData,
    }),
    [factoryData]
  );
};
