import { useCallback, useEffect, useMemo, useState } from "react";
import { usePermissionsStructure } from "./useStructureCompany";
import useGetfactoryInformationByUserId from "./ManageWarehouseSetting/useGetfactoryInformationByUserId";
import useGetAllWarehouse from "./ManageWarehouseSetting/useGetAllWarehouse";
import usePermissionUser from "./usePermissionUser";

export default function useGetDataId() {
  const { wareHouseData } = useGetAllWarehouse();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const [labId, setLabId] = useState(null);
  const [factoryId, setFactoryId] = useState(null);
  const { has_lab, has_factory, has_warehouse } = usePermissionsStructure();
  const { dataUserById, dataUserLab } = usePermissionUser();
  const initialId = useCallback(() => {
    let nextFactory = null;
    let nextLab = null;
    if (has_warehouse && has_factory && has_lab) {
      nextLab = dataUserLab?.lab_id || dataUserById?.user_id;
      nextFactory = dataUserLab?.factory_id || dataUserById?.user_id;
    }
    if (has_warehouse && has_factory) {
      if (has_lab && dataUserLab?.factory_id) {
        nextFactory = dataUserLab.factory_id;
      } else if (!has_lab) {
        nextFactory =
          dataUserById?.group_name === "warehouse_Manager"
            ? wareHouseData[0]?.factory_id || dataUserFactory?.factory_id
            : dataUserFactory?.factory_id;
      }
    }

    if (has_lab) {
      nextLab =
        dataUserById?.group_name === "warehouse_Manager"
          ? wareHouseData[0]?.laboratory_id || dataUserLab?.lab_id
          : dataUserLab?.lab_id;
    }

    setFactoryId(nextFactory);
    setLabId(nextLab);
  }, [has_lab,
    has_factory,
    has_warehouse,
    dataUserLab?.factory_id,
    dataUserLab?.lab_id,
    dataUserFactory?.factory_id,
    dataUserById?.group_name,
    dataUserById?.user_id,
    wareHouseData])
  useEffect(() => {
    initialId()
  }, [initialId]);

  return useMemo(() => ({ labId, factoryId }), [labId, factoryId]);
}
