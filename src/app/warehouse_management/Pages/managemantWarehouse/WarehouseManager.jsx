import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { useApi } from "../../../../hooks/useApi";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";

import DataCard from "../../../../components/reusableComponent/DataCard";
import WarehouseModel from "./FormInsertWherHouse";

import useGetAllWarehouse from "../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { useLabManagement } from "../../../../hooks/ManageWarehouseSetting/useLab";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import {
  DeleteItem,
  renderMenuItem,
  hasPermission,
} from "../../../../utils/Function";
import { getToken } from "../../../../utils/handelCookie";
import layoutStyle from "../../../../style/layoutStyle";
import useGetfactoryInformationByUserId from "../../../../hooks/ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { usePermissionsStructure } from "../../../../hooks/useStructureCompany";
import useUserData from "../../../../hooks/genaral/useUserData";

const WarehouseMange = () => {
  // ===== HOOKS =====
  const { t } = useTranslation();
  const theme = useTheme();
  const { delete: del } = useApi();

  const {
    roles,
    applicationPermission,
    permissionData,

  } = useUserPermissions();
  const { dataUserById, dataUserLab } = useUserData();
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [warehouseToDelete, setWarehouseToDelete] = useState(null);

  const handleOpenDeleteAll = (warehouse_id) => {
    setWarehouseToDelete(warehouse_id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteAllEntityData = async () => {
    try {
      const response = await del(`/api/warehouse/deleteAllByWarehouseId?warehouse_id=${warehouseToDelete}`);
      if (response) {
        toast.success("تم حذف جميع بيانات المستودع بنجاح");
        setDeleteConfirmOpen(false);
        setRefreshKey((prev) => !prev);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

        {/* زر حذف كافة البيانات - متاح فقط لمالك النظام */}
        {/* {dataUserById?.group_name === "systemOwner" && ( */}
        {/* <>
            <Divider sx={{ my: 1 }} />
            {renderMenuItem(
              "delete_all",
              () => handleOpenDeleteAll(item.id),
              DeleteIcon,
              "حذف شامل لكافة البيانات",
              { color: "error.main" }
            )}
          </> */}
        {/* )} */}
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
          { key: "Laboratory_name", label: "المعمل" },

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
        baseFields.push(
          { key: "warehouse_type", label: "نوع المخزن" },
          { key: "code", label: "رمز المخزن" }

        );

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
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} dir="rtl">
        <DialogTitle sx={{ textAlign: "right", fontWeight: "bold", color: "error.main" }}>
          تحذير: حذف شامل لكافة البيانات
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300, mt: 1 }}>
          <Typography variant="body1" gutterBottom>
            هل أنت متأكد من رغبتك في حذف <strong>جميع البيانات التشغيلية</strong> المتعلقة بهذا المستودع؟
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: "bold" }}>
            سيتم حذف (المواد، المستندات، الوارد، الصادر) لهذا المستودع بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">إلغاء</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAllEntityData}
          >
            تأكيد الحذف الشامل
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WarehouseMange;
