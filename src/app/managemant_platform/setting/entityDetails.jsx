import { useCallback, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../../../redux/api/axiosConfig";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loader from "../../../components/reusableComponent/Loader";
import {
  CompanyStructureSelector,
  getHierarchyConfig,
} from "../../../redux/CompanyStructure/CompanyStructureSlice";
import { getCompanyStructureEntityId } from "../../../redux/CompanyStructure/CompanyStructureAction";
import { useDispatch, useSelector } from "react-redux";
import GlobalSettingsSection from "./component/globalSettingsSection";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InvoiceTemplateDesigner from "../../customerManagePlatform/InvoiceTemplateDesigner/InvoiceTemplateDesigner";
import DocumentFieldSettings from "../../customerManagePlatform/documentFiledSetting/DocumentFieldSettings";

const EntityDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { isLoading } = useSelector(CompanyStructureSelector);
  const hierarchyConfigByEntityId = useSelector(getHierarchyConfig);

  /** -----------------------------------------
   *  Memoized Configurations (Performance Boost)
   * ---------------------------------------- */
  const globalSettingsConfig = useMemo(
    () => [
      { key: "useFactory", label: "تفعيل نظام المصانع", hierarchyKey: "has_factory" },
      { key: "useLab", label: "تفعيل نظام المعامل", hierarchyKey: "has_lab" },
      { key: "useWarehouse", label: "تفعيل نظام المخازن", hierarchyKey: "has_warehouse" },
      { key: "allowShowInformationBetweenLab", label: "سماح للمعلومات للظهور بقية المعامل", hierarchyKey: "allow_show_data_l" },
      { key: "hasMainWarehouse", label: "تفعيل نظام المخازن الرئيسية", hierarchyKey: "has_main_warehouse" },
      { key: "useProductionWarehouse", label: "تفعيل نظام المخازن الانتاج التام", hierarchyKey: "has_production_warehouse" },
      { key: "allow_to_manage_all_lab", label: "تفعيل ادارة المعامل الموحدة", hierarchyKey: "allow_to_manage_all_lab" },
      { key: "Internal_Issue_activation", label: "تفعيل الصرف الداخلي", hierarchyKey: "Internal_Issue_activation" },
      { key: "has_branch_warehouse", label: "تفعيل المخازن الفرعية", hierarchyKey: "has_branch_warehouse" },
      { key: "has_internal_transfer", label: "تفعيل التحويل الداخلي", hierarchyKey: "has_internal_transfer" },
    ],
    []
  );

  const [globalSettings, setGlobalSettings] = useState({
    useFactory: false,
    useLab: false,
    useWarehouse: false,
    allowShowInformationBetweenLab: false,
    hasMainWarehouse: false,
    useProductionWarehouse: false,
    allow_to_manage_all_lab: false,
    Internal_Issue_activation: false,
    has_branch_warehouse: false,
    has_internal_transfer: false,
    entity_id: id,
  });


  /** -----------------------------------------
   *  Load Entity Structure
   * ---------------------------------------- */
  const fetchEntityConfig = useCallback(() => {
    dispatch(getCompanyStructureEntityId(id));
  }, [dispatch, id]);

  useEffect(() => {
    fetchEntityConfig();
  }, [fetchEntityConfig]);

  /** -----------------------------------------
   *  Sync Global Settings with API Result
   * ---------------------------------------- */
  useEffect(() => {
    if (!hierarchyConfigByEntityId) return;

    setGlobalSettings((prev) => {
      const updated = { ...prev };

      globalSettingsConfig.forEach(({ key, hierarchyKey }) => {
        updated[key] = hierarchyConfigByEntityId[hierarchyKey] ?? false;
      });

      updated.entity_id = hierarchyConfigByEntityId.comp_entity_id;
      return updated;
    });
  }, [hierarchyConfigByEntityId, globalSettingsConfig]);

  /** -----------------------------------------
   *  Handlers
   * ---------------------------------------- */
  const handleGlobalSettingChange = useCallback((key, value) => {
    setGlobalSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await axiosInstance.post("/api/companyToggle", globalSettings);
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "حدث خطأ");
    }
  }, [globalSettings]);



  /** -----------------------------------------
   *  UI
   * ---------------------------------------- */
  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }} dir="rtl">
      {isLoading && <Loader />}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          الإعدادات الديناميكية
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          إدارة الإعدادات العامة وصلاحيات الوصول بين الشركات
        </Typography>
      </Paper>

      {/* Global Settings */}
      <GlobalSettingsSection
        settings={globalSettings}
        settingsConfig={globalSettingsConfig}
        onSettingChange={handleGlobalSettingChange}
        onSubmit={handleSubmit}
      />

      <InvoiceTemplateDesigner entity_id={id} />
      <DocumentFieldSettings entity_id={id} />
    </Box>
  );
};

export default EntityDetails;
