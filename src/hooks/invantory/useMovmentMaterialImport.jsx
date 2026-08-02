// import { useEffect, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { getAllLab } from "../../redux/LaboriesState/LabAction";
// import useUserPermissions from "../genaral/useUserPermissions";
// import { usePermissionsStructure } from "../useStructureCompany";
// import { getDataImportInventory } from "../../redux/Inventiry/InventoryAction";

// export const useMovementMaterialImport = () => {
//   const dispatch = useDispatch();
//   const { InventoryData } = useSelector((state) => state?.Inventory);
//   const {
//     roles,
//     applicationPermission,
//     permissionData,
//     dataUserById,
//     dataUserLab,
//   } = useUserPermissions();
//   const {
//     has_lab,
//     has_factory,
//     has_warehouse,
//     allow_to_manage_all_lab,
//     has_production_warehouse,
//     has_main_warehouse,
//     allow_show_data_l,
//     hierarchyConfig,
//   } = usePermissionsStructure();
//   const entityId = useMemo(
//     () => dataUserById?.entity_id,
//     [dataUserById?.entity_id]
//   );
//   // Optimize factory, lab, and warehouse data fetching
//   const getDataImportInventory = useCallback(async () => {
//     dispatch(
//       getDataImportInventory({
//         year: document?.year,
//         entity_id: entityId,
//         factory_id: dataUserFactory?.factory_id,
//         lab_id: dataUserLab?.lab_id,
//         document_type: document?.document_type,
//       })
//     );
//   }, [params.id, applicationPermission?.warehouseSystem?._id, token]);
//   useEffect(() => {
//     getDataImportInventory();
//   }, [getDataImportInventory]);

//   return useMemo(
//     () => ({
//       labData,
//       has_lab,
//       has_factory,
//       has_warehouse,
//       allow_to_manage_all_lab,
//       has_production_warehouse,
//       has_main_warehouse,
//       allow_show_data_l,
//       hierarchyConfig,
//     }),
//     [
//       labData,
//       has_lab,
//       has_factory,
//       has_warehouse,
//       allow_to_manage_all_lab,
//       has_production_warehouse,
//       has_main_warehouse,
//       allow_show_data_l,
//       hierarchyConfig,
//     ]
//   );
// };
