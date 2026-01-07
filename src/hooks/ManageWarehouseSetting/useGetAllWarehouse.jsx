// ===== REACT HOOKS =====
import { useCallback, useEffect, useMemo, useState } from "react";

// ===== REDUX HOOKS =====
import { useDispatch, useSelector } from "react-redux";

// ===== CUSTOM HOOKS =====
import usePermissionUser from "../usePermissionUser";

// ===== REDUX ACTIONS =====
import {
  getAllWarehouse,
  getWarehouseByLabId,
  getAllWarehouseByFactoryAndLab,
  getWarehouseDataByUserId,
} from "../../redux/wharHosueState/WareHouseAction";

// ===== UTILS =====
import { getCompanyStructure } from "../../utils/handelCookie";
import useGetfactoryInformationByUserId from "./useGetfactoryInformationByUserId";

/**
 * هوك مخصص لجلب جميع بيانات المخازن
 * يدير عملية جلب المخازن بناءً على صلاحيات المستخدم ونوع المجموعة
 * @returns {Object} بيانات المخازن وحالة التحميل ووظائف التحديث
 */
const useGetAllWarehouse = () => {
  // ===== REDUX SETUP =====
  const dispatch = useDispatch();
  const { wareHouseData, loading } = useSelector((state) => state?.wareHouse);

  // ===== PERMISSION HOOKS =====
  const { roles, applicationPermission, dataUserById, dataUserLab } =
    usePermissionUser();
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  // ===== STATE MANAGEMENT =====
  const [refreshKey, setRefreshKey] = useState(false);
  // ===== MEMOIZED VALUES =====
  /**
   * معرف الكيان المستخرج من بيانات المستخدم
   */
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );

  /**
   * معرف المستخدم
   */
  const userId = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);

  /**
   * معرف المعمل
   */
  const labId = useMemo(() => dataUserLab?.lab_id, [dataUserLab?.lab_id]);

  /**
   * معرف المصنع
   */
  const factoryId = useMemo(
    () => dataUserFactory?.factory_id,
    [dataUserFactory?.factory_id]
  );

  /**
   * إعدادات التسلسل الهرمي للشركة
   */
  const hierarchyConfig = useMemo(() => getCompanyStructure(), []);

  // ===== PERMISSION CONFIGURATION =====
  const {
    has_lab = false,
    has_factory = false,
    has_warehouse = false,
    has_production_warehouse = false,
    has_main_warehouse = false,
    has_branch_warehouse = false,
  } = hierarchyConfig || {};

  // ===== WAREHOUSE DATA FETCHING LOGIC =====
  /**
   * دالة جلب بيانات المخازن بناءً على صلاحيات المستخدم
   * تحدد نوع المخزن المطلوب جلبه حسب مجموعة المستخدم
   */
  const dispatchWarehouseData = useCallback(() => {
    // التحقق من وجود البيانات المطلوبة
    if (!entityId || !roles || !applicationPermission) {
      return;
    }

    try {
      // ===== SWITCH STATEMENT BASED ON USER ROLE =====
      const userRole = dataUserById?.group_name;
      console.log("userRole", userRole);
      switch (userRole) {
        case "Admin":
          // المدير العام - يمكنه الوصول لجميع المخازن
          if (has_warehouse && has_factory && has_lab) {
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "",
                roles,
                applicationPermission,
              })
            );
          }
          if (has_warehouse && !has_factory && has_lab) {
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "",
                roles,
                applicationPermission,
              })
            );
          }
          if (has_warehouse && has_factory && !has_lab) {
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "",
                roles,
                applicationPermission,
              })
            );
          }
          if (has_warehouse && !has_factory && !has_lab) {
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "",
                roles,
                applicationPermission,
              })
            );
          }
          break;

        case "lab user":
          if (has_lab && labId) {
            if (has_branch_warehouse) {
              dispatch(
                getWarehouseByLabId({
                  entity_id: entityId,
                  lab_id: labId,
                  warehouseType: "branch",
                })
              );
            }
          }
          break;

        case "Factory user":
          if (has_factory && factoryId) {
            dispatch(
              getAllWarehouseByFactoryAndLab({
                entity_id: entityId,
                factory_id: factoryId,
                lab_id: null,
                warehouseType: "main",
              })
            );
          }
          break;
        case "warehouse_Manager":
          if (has_warehouse) {
            if (userId) {
              dispatch(getWarehouseDataByUserId(userId));
            }
          }
          break;
        case "production_manager":
          if (has_production_warehouse) {
            if (has_factory && factoryId) {
              dispatch(
                getAllWarehouseByFactoryAndLab({
                  entity_id: entityId,
                  factory_id: factoryId,
                  lab_id: null,
                })
              );
            } else {
              dispatch(
                getAllWarehouse({
                  entity_id: entityId,
                  warehouse_type: "production",
                  roles,
                  applicationPermission,
                })
              );
            }
          }
          break;

        case "warehouse_main_manger":
          // مدير المخزن الرئيسي - يحتاج للمخازن الرئيسية
          if (has_main_warehouse) {
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "main",
                roles,
                applicationPermission,
              })
            );
          }
          break;

        default:
          if (has_factory && has_lab && has_warehouse) {
            // إذا كان لديه جميع الصلاحيات، يفضل المعمل أولاً
            if (labId) {
              dispatch(
                getWarehouseByLabId({
                  entity_id: entityId,
                  lab_id: labId,
                  warehouseType: "intermediate",
                })
              );
            } else if (factoryId) {
              dispatch(
                getAllWarehouseByFactoryAndLab({
                  entity_id: entityId,
                  factory_id: factoryId,
                  lab_id: null,
                })
              );
            }
          } else if (has_factory && factoryId) {
            dispatch(
              getAllWarehouseByFactoryAndLab({
                entity_id: entityId,
                factory_id: factoryId,
                lab_id: null,
              })
            );
          } else if (has_lab && labId) {
            dispatch(
              getWarehouseByLabId({
                entity_id: entityId,
                lab_id: labId,
                warehouseType: "intermediate",
              })
            );
          } else {
            // الحالة الافتراضية العامة
            dispatch(
              getAllWarehouse({
                entity_id: entityId,
                warehouse_type: "",
                roles,
                applicationPermission,
              })
            );
          }
          break;
      }
    } catch (error) {
      console.error("خطأ في جلب بيانات المخازن:", error);
    }
  }, [
    dispatch,
    entityId,
    labId,
    factoryId,
    roles,
    applicationPermission,
    dataUserById?.group_name,
    has_factory,
    has_lab,
    has_warehouse,
    refreshKey,
    has_branch_warehouse,
    has_main_warehouse,
    has_production_warehouse,
    userId,
  ]);

  // ===== EFFECTS =====
  /**
   * تأثير لجلب بيانات المخازن عند تغيير المعاملات
   */
  useEffect(() => {
    dispatchWarehouseData();
  }, [dispatchWarehouseData]);

  // ===== RETURN VALUES =====
  return {
    wareHouseData: wareHouseData || [],
    loading,
    setRefreshKey,
    refreshKey,
    entityId,
    userId,
    labId,
    factoryId,
    hierarchyConfig,
  };
};

export default useGetAllWarehouse;
