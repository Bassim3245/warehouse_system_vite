// hooks/usePermissions.js
import { useMemo } from "react";
import { getCompanyStructure } from "../utils/handelCookie";
export const usePermissionsStructure = (entityIdParam) => {
  const hierarchyConfig = getCompanyStructure();
  const {
    has_lab = false,
    has_factory = false,
    has_warehouse = false,
    allow_to_manage_all_lab = false,
    has_production_warehouse = false,
    has_main_warehouse = false,
    allow_show_data_l = false,
    has_branch_warehouse = false,
    has_internal_transfer = false,
  } = hierarchyConfig || {};
  return useMemo(
    () => ({
      has_lab,
      has_factory,
      has_warehouse,
      allow_to_manage_all_lab,
      has_production_warehouse,
      has_main_warehouse,
      allow_show_data_l,
      has_branch_warehouse,
      hierarchyConfig,
      has_internal_transfer,
    }),
    [
      has_lab,
      has_factory,
      has_warehouse,
      allow_to_manage_all_lab,
      has_production_warehouse,
      has_main_warehouse,
      allow_show_data_l,
      has_branch_warehouse,
      hierarchyConfig,
      has_internal_transfer,
    ]
  );
};
