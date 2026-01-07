import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import {useTheme} from "@mui/material/styles";import DeleteOutlined from "@mui/icons-material/DeleteOutlined";

import DataCard from "../../../../components/reusableComponent/DataCard";
import WarehouseModel from "./FormInsertWherHouse";

import useGetAllWarehouse from "../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { useLabManagement } from "../../../../hooks/ManageWarehouseSetting/useLab";
import usePermissionUser from "../../../../hooks/usePermissionUser";
import {
  DeleteItem,
  renderMenuItem,
  hasPermission,
} from "../../../../utils/Function";
import { getToken } from "../../../../utils/handelCookie";
import layoutStyle from "../../../../style/layoutStyle";
import useGetfactoryInformationByUserId from "../../../../hooks/ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { usePermissionsStructure } from "../../../../hooks/useStructureCompany";

const WarehouseMange = () => {
  // ===== HOOKS =====
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    roles,
    applicationPermission,
    permissionData,
    dataUserById,
    dataUserLab,
  } = usePermissionUser();

  const {
    wareHouseData,
    loading: loadingWarehouse,
    refreshKey,
    setRefreshKey,
  } = useGetAllWarehouse();

  // ===== LAB MANAGEMENT HOOKS =====
  const {
    has_lab,
    has_factory,
    has_warehouse,
    allow_to_manage_all_lab,
    hierarchyConfig,
    has_branch_warehouse,
    has_production_warehouse,
    has_main_warehouse,
  } = usePermissionsStructure();
  const { labData } = useLabManagement();
  const { dataUserFactory } = useGetfactoryInformationByUserId();

  // ===== STATE MANAGEMENT =====
  const [anchorEl, setAnchorEl] = useState(null);

  const token = useMemo(() => getToken(), []);

  // ===== PERMISSION CALCULATIONS =====
  /**
   * التحقق من صلاحية إضافة المخازن
   * يتطلب صلاحية إضافة المتجر وإما صلاحية إدراج مخزن الشركة أو المصنع
   */
  const hasAddPermission = useMemo(() => {
    return hasPermission(roles?.add_store?._id, permissionData);
  }, [roles, permissionData]);

  /**
   * التحقق من صلاحية حذف المخازن
   */
  const hasDeletePermission = useMemo(() => {
    return hasPermission(roles?.add_store?._id, permissionData);
  }, [roles?.add_store?._id, permissionData]);

  const hierarchyState = useMemo(() => {
    // التحقق من الحالة الثالثة: مصنع + معمل + مخزن (أولوية للمعمل)
    if (has_factory && has_lab && has_warehouse) {
      return "factory_lab_warehouse";
    }

    // التحقق من الحالة الأولى: مصنع + معمل (عرض معلومات النموذج)
    if (has_factory && has_lab && !has_warehouse) {
      return "factory_lab";
    }

    // التحقق من الحالة الثانية: مصنع + مخزن (عرض معلومات المخزن)
    if (!has_factory && has_lab && has_warehouse) {
      return "lab_warehouse";
    }
    if (has_factory && !has_lab && has_warehouse) {
      return "factory_warehouse";
    }
    if (!has_factory && !has_lab && has_warehouse) {
      return "warehouse";
    }

    // لا توجد صلاحيات صالحة
    return "no_permission";
  }, [has_factory, has_lab, has_warehouse]);

  /**
   * تحديد ما إذا كان يجب عرض النموذج بناءً على حالة التسلسل الهرمي والصلاحيات
   */
  const shouldShowModel = useMemo(() => {
    return hierarchyState !== "no_permission" && hasAddPermission;
  }, [hierarchyState, hasAddPermission]);

  /**
   * الحصول على عنوان الحالة الحالية للتسلسل الهرمي
   */
  const getHierarchyStateTitle = useMemo(() => {
    switch (hierarchyState) {
      case "factory_lab":
        return "إدارة المخازن - نموذج المصنع والمعمل";
      case "factory_warehouse":
        return "إدارة المخازن - نموذج المصنع والمخزن";
      case "factory_lab_warehouse":
        return "إدارة المخازن - نموذج شامل (أولوية المعمل)";
      default:
        return "إدارة المخازن";
    }
  }, [hierarchyState]);

  /**
   * معالج أزرار الإجراءات لكل عنصر مخزن
   * @param {Object} item - بيانات المخزن
   * @returns {JSX.Element} أزرار الإجراءات
   */
  const renderActionButtons = (item) => {
    if (!item?.id) return null;

    return (
      <>
        {/* زر الحذف */}
        {hasDeletePermission &&
          renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                item?.id,
                setRefreshKey,
                setAnchorEl,
                token,
                "warehouse/deleteWareHouseById",
                roles?.add_store?._id,
                applicationPermission?.warehouseSystem?._id
              ),
            DeleteOutlined,
            "حذف"
          )}

        {/* زر التعديل */}
        {shouldShowModel && (
          <WarehouseModel
            editMode={true}
            token={token}
            refreshButton={refreshKey}
            setRefreshButton={setRefreshKey}
            dataUserById={dataUserById}
            labData={labData}
            dataUserLab={dataUserLab}
            wareHouseData={item}
            hierarchyConfig={hierarchyConfig}
            has_lab={has_lab}
            has_factory={has_factory}
            has_warehouse={has_warehouse}
            allow_to_manage_all_lab={allow_to_manage_all_lab}
            has_production_warehouse={has_production_warehouse}
            has_main_warehouse={has_main_warehouse}
            hierarchyState={hierarchyState}
            dataUserFactory={dataUserFactory}
            has_branch_warehouse={has_branch_warehouse}
            roles={roles}
            permissionData={permissionData}
          />
        )}
      </>
    );
  };

  // ===== CONFIGURATION =====
  /**
   * الحقول الإضافية المعروضة في البطاقة بناءً على حالة التسلسل الهرمي
   */
  const extraFields = useMemo(() => {
    const baseFields = [];

    switch (hierarchyState) {
      case "factory_lab": // State 1: Show model information
        baseFields.push(
          { key: "Factories_name", label: "المصنع" },
          { key: "Laboratory_name", label: "المعمل" }
        );
        break;

      case "factory_warehouse": // State 2: Show warehouse information
        baseFields.push(
          { key: "Factories_name", label: "المصنع" },
          { key: "warehouse_type", label: "نوع المخزن" }
        );
        break;

      case "factory_lab_warehouse": // State 3: Show lab information (prioritize lab)
        baseFields.push(
          { key: "Laboratory_name", label: "المعمل" },
          { key: "Factories_name", label: "المصنع" },
          { key: "warehouse_type", label: "نوع المخزن" }
        );
        break;

      default: // No permission state
        baseFields.push({ key: "warehouse_type", label: "نوع المخزن" });
        break;
    }

    return baseFields;
  }, [hierarchyState]);

  /**
   * زر إضافة مخزن جديد بناءً على حالة التسلسل الهرمي
   */
  const addButton = shouldShowModel ? (
    <WarehouseModel
      dataUserById={dataUserById}
      token={token}
      setRefreshButton={setRefreshKey}
      editMode={false}
      labData={labData}
      dataUserLab={dataUserLab}
      has_lab={has_lab}
      has_factory={has_factory}
      has_warehouse={has_warehouse}
      allow_to_manage_all_lab={allow_to_manage_all_lab}
      has_production_warehouse={has_production_warehouse}
      has_main_warehouse={has_main_warehouse}
      hierarchyState={hierarchyState}
      dataUserFactory={dataUserFactory}
      has_branch_warehouse={has_branch_warehouse}
      roles={roles}
      permissionData={permissionData}
    />
  ) : null;

  // ===== RENDER =====
  return (
    <Box sx={{ ...layoutStyle, mt: 2 }}>
      <DataCard
        data={wareHouseData || []}
        title={getHierarchyStateTitle}
        loading={loadingWarehouse}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        addButton={addButton}
        actionButtons={renderActionButtons}
        statusField="status"
        nameField="name"
        secondaryField="user_name"
        locationField="location"
        dateField="created_at"
        warehouse_typeField="warehouse_type"
        extraFields={extraFields}
        t={t}
        theme={theme}
        hasAddPermission={shouldShowModel}
        hierarchyState={hierarchyState}
        has_lab={has_lab}
        has_factory={has_factory}
        has_warehouse={has_warehouse}
        has_branch_warehouse={has_branch_warehouse}
      />
    </Box>
  );
};

export default WarehouseMange;
