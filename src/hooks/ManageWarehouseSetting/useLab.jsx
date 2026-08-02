import { useMemo } from "react";
import useUserPermissions from "../genaral/useUserPermissions";
import { usePermissionsStructure } from "../useStructureCompany";
import useGetfactoryInformationByUserId from "./useGetfactoryInformationByUserId";
import {
  useGetAllLabQuery,
  useGetAllLabByFactoryIdQuery,
} from "../../redux/LaboriesState/LabApi";
import { getUserInformation } from "../../utils/handelCookie";

export const useLabManagement = () => {
  const dataUserById = getUserInformation();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const { roles, applicationPermission } = useUserPermissions();
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

  const factoryId = useMemo(
    () => dataUserFactory?.factory_id,
    [dataUserFactory?.factory_id]
  );
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );

  const shouldFetchByFactory = !!entityId && !!factoryId;
  const shouldFetchByEntity = !!entityId && !!roles && !!applicationPermission && !factoryId;

  const { data: labDataByFactory } = useGetAllLabByFactoryIdQuery(
    { entity_id: entityId, factory_id: factoryId },
    { skip: !shouldFetchByFactory }
  );

  const { data: labDataByEntity } = useGetAllLabQuery(
    { entity_id: entityId, roles, applicationPermission },
    { skip: !shouldFetchByEntity }
  );

  const labData = labDataByFactory || labDataByEntity || [];

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
