import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BackendUrl } from "../redux/api/axios";
import { getToken } from "../utils/handelCookie";
import { hasPermission } from "../utils/Function";
import {
  getAllWarehouse,
  getWarehouseByLabId,
} from "../redux/wharHosueState/WareHouseAction";
import { getDataUserWithWareHouseDataById } from "../redux/getDataProjectById/getActions";
import usePermissionUser from "./usePermissionUser";
import { useWarehouseBaseTheRoleAndPermission } from "./useWarehouseBaseTheRoleAndPermission";

export const useReportLogic = () => {
  const { wareHouseData, labData, factoryData } =
    useWarehouseBaseTheRoleAndPermission();

  // Simple state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModel, setShowReportModel] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState("general");

  const dispatch = useDispatch();
  const token = getToken();

  const {
    permissionData,
    roles,
    applicationPermission,
    dataUserById,
    dataUserLab,
  } = usePermissionUser();

  // Memoize initial selectedInfo to prevent recreation on every render
  const initialSelectedInfo = useMemo(
    () => ({
      reportTitle: "",
      reportDescription: "",
      reportFormat: "display",
      reportStatus: "generated",
      typeDocument: "",
      warehouses: [],
      labs: [],
      factories: [],
      reportTypes: [],
      materials: [],
      dateFrom: null,
      dateTo: null,
      notes: "",
      entity_id: dataUserById?.entity_id || "",
      material_code: "",
      selectReportType: "general",
    }),
    [dataUserById?.entity_id]
  );

  const [selectedInfo, setSelectedInfo] = useState(initialSelectedInfo);

  // Update selectedInfo when entity_id changes
  useEffect(() => {
    setSelectedInfo((prev) => ({
      ...prev,
      entity_id: dataUserById?.entity_id || "",
    }));
  }, [dataUserById?.entity_id]);

  // Memoize expanded sections initial state
  const [expandedSections, setExpandedSections] = useState({
    warehouses: true,
    labs: true,
    factories: true,
    materials: true,
    reportTypes: true,
  });

  // Memoize permission check
  const hasAllReportPermission = useMemo(
    () =>
      hasPermission(
        roles?.get_all_report_for_factory_lab_warehouse?._id,
        permissionData
      ),
    [roles?.get_all_report_for_factory_lab_warehouse?._id, permissionData]
  );



  useEffect(() => {
    const entity_id = dataUserById?.entity_id;
    const user_id = dataUserById?.user_id;
    const lab_id = dataUserLab?.lab_id;

    if (!user_id || !entity_id) return;

    // Fetch user warehouse data
    dispatch(
      getDataUserWithWareHouseDataById({
        user_id,
        entity_id,
      })
    );

    // Fetch warehouse data based on permissions
    if (hasAllReportPermission) {
      dispatch(getAllWarehouse({ entity_id, roles, applicationPermission }));
    } else if (lab_id) {
      dispatch(getWarehouseByLabId({ entity_id, lab_id }));
    }
  }, [
    dispatch,
    dataUserById?.entity_id,
    dataUserById?.user_id,
    dataUserLab?.lab_id,
    refresh,
    hasAllReportPermission,
    roles,
    applicationPermission,
  ]);

  // Memoize return object to prevent recreation
  return useMemo(
    () => ({
      // State
      selectedCategory,
      setSelectedCategory,
      selectedReport,
      setSelectedReport,
      showReportModel,
      setShowReportModel,
      showInfoDialog,
      setShowInfoDialog,
      timeRange,
      setTimeRange,
      loading,
      setLoading,
      refresh,
      setRefresh,
      labData,
      factoryData,
      permissionData,
      wareHouseData,
      selectedInfo,
      setSelectedInfo,
      expandedSections,
      setExpandedSections,
      dataUserById,
      dataUserLab,
      roles,
      token,
      applicationPermission,
      selectedReportType,
      setSelectedReportType,
      hasAllReportPermission,
    }),
    [
      selectedCategory,
      selectedReport,
      showReportModel,
      showInfoDialog,
      timeRange,
      loading,
      refresh,
      labData,
      factoryData,
      permissionData,
      wareHouseData,
      selectedInfo,
      expandedSections,
      dataUserById,
      dataUserLab,
      roles,
      token,
      applicationPermission,
      selectedReportType,
      hasAllReportPermission,
    ]
  );
};
