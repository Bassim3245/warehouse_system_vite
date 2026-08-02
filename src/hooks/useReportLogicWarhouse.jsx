import { useState, useEffect, useMemo } from "react";
import { getToken } from "../utils/handelCookie";
import { hasPermission } from "../utils/Function";
import useUserPermissions from "./genaral/useUserPermissions";
import { useWarehouseBaseTheRoleAndPermission } from "./useWarehouseBaseTheRoleAndPermission";
import useUserData from "./genaral/useUserData";

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

  const token = getToken();

  const {
    permissionData,
    roles,
    applicationPermission,
  } = useUserPermissions();
  const { dataUserById, dataUserLab } = useUserData();
  
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
      selectedReportType,
      setSelectedReportType,
      selectedInfo,
      setSelectedInfo,
      expandedSections,
      setExpandedSections,
      hasAllReportPermission,
      // Data
      wareHouseData,
      labData,
      factoryData,
      dataUserLab,
      dataUserById,
      token,
      roles,
      applicationPermission,
      permissionData,
    }),
    [
      selectedCategory,
      selectedReport,
      showReportModel,
      showInfoDialog,
      timeRange,
      loading,
      refresh,
      selectedReportType,
      selectedInfo,
      expandedSections,
      hasAllReportPermission,
      wareHouseData,
      labData,
      factoryData,
      dataUserLab,
      dataUserById,
      token,
      roles,
      applicationPermission,
      permissionData,
    ]
  );
};
