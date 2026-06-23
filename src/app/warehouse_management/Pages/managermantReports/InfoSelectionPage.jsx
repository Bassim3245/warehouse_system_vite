import { useState, useCallback, memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, alpha } from "@mui/material/styles";

import ArrowBack from "@mui/icons-material/ArrowBack";
import Warehouse from "@mui/icons-material/Warehouse";
import Science from "@mui/icons-material/Science";
import Factory from "@mui/icons-material/Factory";
import Assessment from "@mui/icons-material/Assessment";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Info from "@mui/icons-material/Info";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  InformationMaterialImport,
  reportTypeOptions,
  warehouseReports,
} from "../../../../constants/reportConstants";
import DisplayInformationComponent from "./displayData";
import { getDataInventoryByCode } from "../../../../redux/Inventiry/InventoryAction";
import { useDispatch, useSelector } from "react-redux";
import { getUserInformation } from "../../../../utils/handelCookie";
import MaterialSearchSection from "./components/MaterialSearchSection";
import FinancialReportSection from "./components/FinancialReportSection";
import GeneralReportSection from "./components/GeneralReportSection";
import { CollapsibleSection, ReportTypeOption } from "../../../../style/reportStyle";
import useRenderInformation from "../../../../hooks/reportManagmant/warehouse/useRenderInformation";
import {
  handleInfoCheckboxChange,
  handleToggleSection,
  handleApplySelections,
} from "../../../../utils/reportUtils/reportHandlers";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import SectionCard from "./components/SectionCard";



// ── Main Component ─────────────────────────────────────────────────────────
const InfoSelectionPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { InventoryData } = useSelector((state) => state.Inventory);
  const dataUserById = getUserInformation();

  const locationState = location.state || {};
  const {
    wareHouseData = [],
    labData = [],
    factoryData = [],
    selectedReportType: initialSelectedReportType = "general",
  } = locationState;

  const [selectedInfo, setSelectedInfo] = useState(
    locationState.selectedInfo || {
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
    }
  );

  const [expandedSections, setExpandedSections] = useState(
    locationState.expandedSections || {
      warehouses: true,
      labs: true,
      factories: true,
      materials: true,
      reportTypes: true,
    }
  );

  const [selectedReportType, setSelectedReportType] = useState(initialSelectedReportType);

  const [selectTypInfroamtion, setSelectTypInfroamtion] = useState({
    selectRadioMaterialInforamtionType: "general_info",
    selectWarehouse: null,
    material_code: null,
    searchKey: "",
  });

  const [InformationMaterial, setInformationMaterial] = useState(InformationMaterialImport);

  const onInfoCheckboxChange = useCallback(
    (category, itemId, itemlabel = null) => {
      handleInfoCheckboxChange(category, itemId, setSelectedInfo, itemlabel);
    },
    []
  );

  const onToggleSection = useCallback((section) => {
    handleToggleSection(section, setExpandedSections);
  }, []);

  const onApplySelections = async () => {
    const dummyCloseDialog = () => { };
    await handleApplySelections(selectedInfo, dummyCloseDialog, dataUserById);
  };

  const handleGoBack = () => navigate(-1);

  const { renderWarehouses, renderLabs, renderFactories } = useRenderInformation({
    selectedInfo,
    onInfoCheckboxChange,
    theme,
    t,
    labData,
    factoryData,
    wareHouseData,
  });

  const handleReportTypeChange = useCallback(
    (e) => onInfoCheckboxChange("selectReportType", e.target.value),
    [onInfoCheckboxChange]
  );

  const isGeneralReport = selectedInfo.selectReportType === "general";
  const isFinancialReport = selectedInfo.selectReportType === "financial_reports";
  const isMaterialSearch = selectedInfo.selectReportType === "material_search";
  const isExpensesReport = selectedInfo.selectReportType === "expenses_report_entity";

  const getDisplayInformationByCode = useCallback(() => {
    try {
      const dateFrom = selectedInfo.dateFrom ? dayjs(selectedInfo.dateFrom).format("YYYY-MM-DD") : "";
      const dateTo = selectedInfo.dateTo ? dayjs(selectedInfo.dateTo).format("YYYY-MM-DD") : "";
      const entityName = selectedInfo.entityName || "";
      const searchWarehouseId = selectedInfo.searchWarehouseId || "all";
      const materialSearchType = selectedInfo.materialSearchType;
      dispatch(
        getDataInventoryByCode({
          dateFrom,
          dateTo,
          entityName,
          searchWarehouseId,
          materialSearchType,
          selectTypInfroamtion,
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch, selectTypInfroamtion, selectedInfo]);

  return (
    <Box
      sx={{
        pb: 12,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* ── Page Header ── */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: theme.palette.background.paper,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Tooltip title={t("رجوع")}>
          <IconButton
            onClick={handleGoBack}
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 0.75,
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary" lineHeight={1.2}>
            {t("إعداد التقرير")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("اختر نوع التقرير وحدد الفترة الزمنية والخيارات المطلوبة")}
          </Typography>
        </Box>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 3 }}>
        {/* Step bar */}

        <SectionCard
          icon={<ArticleOutlinedIcon />}
          title={t("نوع التقرير")}
          subtitle={t("اختر النوع الذي يناسب احتياجاتك")}
          accentColor={theme.palette.primary.main}
          theme={theme}
        >
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={selectedInfo.selectReportType || "general"}
              onChange={handleReportTypeChange}
              sx={{ gap: 1.5 }}
            >
              {reportTypeOptions.map((option) => (
                <ReportTypeOption
                  key={option.value}
                  option={option}
                  selected={selectedReportType}
                  onChange={handleReportTypeChange}
                  theme={theme}
                  t={t}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Sub-sections per report type */}
          {isMaterialSearch && (
            <Box sx={{ mt: 2 }}>
              <MaterialSearchSection
                selectedInfo={selectedInfo}
                selectTypInfroamtion={selectTypInfroamtion}
                setSelectTypInfroamtion={setSelectTypInfroamtion}
                onInfoCheckboxChange={onInfoCheckboxChange}
                wareHouseData={wareHouseData}
              />
            </Box>
          )}

          {isFinancialReport && (
            <Box sx={{ mt: 2 }}>
              <FinancialReportSection
                selectedInfo={selectedInfo}
                onInfoCheckboxChange={onInfoCheckboxChange}
              />
            </Box>
          )}

          {isGeneralReport && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.06),
                border: `1px dashed ${alpha(theme.palette.info.main, 0.4)}`,
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: theme.palette.info.main, mt: 0.2, flexShrink: 0 }}
              />
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {t(
                  "سيتم إنشاء تقرير شامل لجميع البيانات المتاحة حسب الصلاحيات الممنوحة لك."
                )}
              </Typography>
            </Box>
          )}
        </SectionCard>

        {/* ── 2. Date Range ── */}
        <SectionCard
          icon={<CalendarToday />}
          title={t("الفترة الزمنية")}
          subtitle={t("حدد نطاق التواريخ للتقرير")}
          accentColor={theme.palette.secondary.main}
          theme={theme}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label={t("من تاريخ")}
                  value={selectedInfo.dateFrom ? dayjs(selectedInfo.dateFrom) : null}
                  onChange={(v) => onInfoCheckboxChange("dateFrom", v)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label={t("إلى تاريخ")}
                  value={selectedInfo.dateTo ? dayjs(selectedInfo.dateTo) : null}
                  onChange={(v) => onInfoCheckboxChange("dateTo", v)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </SectionCard>

        {/* ── 3. General Report extra options ── */}
        {isGeneralReport && (
          <GeneralReportSection
            selectedInfo={selectedInfo}
            onInfoCheckboxChange={onInfoCheckboxChange}
          />
        )}

        {/* ── 4. Warehouses / Labs / Factories ── */}
        {(isGeneralReport || isFinancialReport || isExpensesReport) && (
          <>
            <SectionCard
              icon={<Factory />}
              title={t("المصانع")}
              subtitle={t("اختر المصانع التي تريد تضمينها")}
              accentColor={theme.palette.secondary.main}
              theme={theme}
            >
              <CollapsibleSection
                title={t("المصانع")}
                icon={<Factory color="warning" />}
                color="warning"
                expanded={expandedSections.factories}
                onToggle={() => onToggleSection("factories")}
                theme={theme}
              >
                {renderFactories}
              </CollapsibleSection>
            </SectionCard>


            <SectionCard
              icon={<Science />}
              title={t("المعامل")}
              subtitle={t("اختر المعامل التي تريد تضمينها")}
              accentColor={theme.palette.secondary.main}
              theme={theme}
            >
              <CollapsibleSection
                title={t("المعامل")}
                icon={<Science color="success" />}
                color="success"
                expanded={expandedSections.labs}
                onToggle={() => onToggleSection("labs")}
                theme={theme}
              >
                {renderLabs}
              </CollapsibleSection>
            </SectionCard>

            <SectionCard
              icon={<Assessment />}
              title={t("المخازن")}
              subtitle={t("اختر المخازن التي تريد تضمينها")}
              accentColor={theme.palette.secondary.main}
              theme={theme}
            >
              <CollapsibleSection
                title={t("المخازن")}
                icon={<Warehouse color="info" />}
                color="info"
                expanded={expandedSections.warehouses}
                onToggle={() => onToggleSection("warehouses")}
                theme={theme}
              >
                {renderWarehouses}
              </CollapsibleSection>
            </SectionCard>
          </>

        )}

        {/* ── 5. Report Types checkboxes ── */}
        {isGeneralReport && (
          <Box sx={{ mt: 3 }}>
            <SectionCard
              icon={<Assessment />}
              title={t("أنواع التقارير")}
              subtitle={t("اختر أنواع البيانات التي تريد تضمينها")}
              accentColor={theme.palette.secondary.main}
              theme={theme}
            >
              <CollapsibleSection
                title={t("أنواع التقارير")}
                icon={<Assessment color="secondary" />}
                color="secondary"
                expanded={expandedSections.reportTypes}
                onToggle={() => onToggleSection("reportTypes")}
                theme={theme}
              >
                <Grid container spacing={0}>
                  {warehouseReports?.map((report) => (
                    <Grid item xs={12} sm={6} md={4} key={report?.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedInfo?.reportTypes.includes(report?.id)}
                            onChange={() =>
                              onInfoCheckboxChange("reportTypes", report?.id, report?.title)
                            }
                            sx={{
                              color: theme.palette.secondary.light,
                              "&.Mui-checked": { color: theme.palette.secondary.main },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.primary">
                            {report.title}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </CollapsibleSection>
            </SectionCard>
          </Box>
        )}

        {/* ── 6. Material Information checkboxes ── */}
        {isGeneralReport && (
          <Box sx={{ mt: 0 }}>
            <SectionCard
              icon={<InfoOutlinedIcon />}
              title={t("حقول التقرير")}
              subtitle={t("اختر المعلومات التي تظهر في التقرير")}
              accentColor={theme.palette.info.main}
              theme={theme}
            >
              <CollapsibleSection
                title={t("معلومات المواد")}
                icon={<Info color="info" />}
                color="info"
                expanded={expandedSections.materials}
                onToggle={() => onToggleSection("materials")}
                theme={theme}
              >
                <Grid container spacing={0}>
                  {InformationMaterial?.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item?.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedInfo?.materials?.includes(item?.value)}
                            onChange={() => onInfoCheckboxChange("materials", item?.value)}
                            sx={{
                              color: theme.palette.error.light,
                              "&.Mui-checked": { color: theme.palette.error.main },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" color="text.primary">
                            {item?.label}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </CollapsibleSection>
            </SectionCard>
          </Box>
        )}

        {/* ── 7. Notes ── */}
        <SectionCard
          icon={<EditNoteIcon />}
          title={t("ملاحظات")}
          subtitle={t("أضف أي تعليقات إضافية تريد إرفاقها بالتقرير")}
          accentColor={theme.palette.warning.main}
          theme={theme}
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={t("اكتب ملاحظاتك هنا...")}
            value={selectedInfo.notes || ""}
            onChange={(e) => onInfoCheckboxChange("notes", e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: "0.875rem",
              },
            }}
          />
        </SectionCard>
      </Box>

      {/* ── Sticky Bottom Bar ── */}
      <Box
        sx={{
          mx: { xs: 2, md: 4 },
          px: { xs: 2, md: 3 },
          py: 2,
          zIndex: 1000,
          background: theme.palette.background.paper,
          display: "flex",
          justifyContent: "flex-end", // Align to left in RTL
          alignItems: "center",
          gap: 2,
          position: "sticky",
          bottom: 16,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0px 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      >
        <Button
          onClick={handleGoBack}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            fontWeight: 600,
            "&:hover": {
              borderColor: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.text.secondary, 0.05),
            }
          }}
        >
          {t("إلغاء")}
        </Button>

        <DisplayInformationComponent
          includes={selectedInfo.includes}
          activeFactory={selectedInfo.activeFactory}
          ActiveLab={selectedInfo.ActiveLab}
          activeMaterial={selectedInfo.activeMaterial}
          activeWareHouse={selectedInfo.activeWareHouse}
          dataItem={InventoryData}
          reportType={selectedInfo.selectReportType}
          dataUserById={dataUserById}
          selectTypInfroamtion={selectTypInfroamtion}
        />

        {(isGeneralReport || isFinancialReport) && (
          <ButtonTheme
            onClick={onApplySelections}
            variant="contained"
            disableElevation
            startIcon={<CheckCircleOutlineIcon />}
          >
            {t("تطبيق الاختيارات")}
          </ButtonTheme>
        )}
        {(isMaterialSearch || isExpensesReport) && (
          <ButtonTheme
            onClick={getDisplayInformationByCode}
            variant="contained"
            disableElevation
            startIcon={<Assessment />}
          >
            {t("عرض التقرير")}
          </ButtonTheme>
        )}
      </Box>
    </Box>

  );
};

export default memo(InfoSelectionPage);