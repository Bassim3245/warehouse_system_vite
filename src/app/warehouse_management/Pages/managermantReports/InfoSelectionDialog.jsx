import {  useState, useCallback, memo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import CheckBox from "@mui/icons-material/CheckBox";
import Warehouse from "@mui/icons-material/Warehouse";
import Science from "@mui/icons-material/Science";
import Factory from "@mui/icons-material/Factory";

import Assessment from "@mui/icons-material/Assessment";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Description from "@mui/icons-material/Description";
import Info from "@mui/icons-material/Info";

import { useTranslation } from "react-i18next";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  InformationMaterialImport,
  reportTypeOptions,
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

// Memoized CheckboxItem component


const InfoSelectionDialog = ({
  open,
  onClose,
  selectedInfo,
  onInfoCheckboxChange,
  expandedSections,
  onToggleSection,
  onApplySelections,
  wareHouseData,
  labData,
  factoryData,
  warehouseReports,
  selectedReportType,
}) => {
  const { InventoryData } = useSelector((state) => state.Inventory);
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  // const { has_warehouse, has_lab, has_factory } = usePermissionsStructure();
  const dataUserById = getUserInformation()

  const [selectTypInfroamtion, setSelectTypInfroamtion] = useState({
    selectRadioMaterialInforamtionType: "general_info",
    selectWarehouse: null,
    material_code: null,
    searchKey: "",
  });

  const [InformationMaterial, setInformationMaterial] = useState(
    InformationMaterialImport
  );

  const { renderWarehouses, renderLabs, renderFactories } = useRenderInformation({
    selectedInfo,
    onInfoCheckboxChange,
    theme,
    t,
    labData,
    factoryData,
    wareHouseData
  })
  const handleReportTypeChange = useCallback(
    (e) => {
      onInfoCheckboxChange("selectReportType", e.target.value);
    },
    [onInfoCheckboxChange]
  );
  const isGeneralReport = selectedInfo.selectReportType === "general";
  const isFinancialReport =
    selectedInfo.selectReportType === "financial_reports";
  const isMaterialSearch = selectedInfo.selectReportType === "material_search";
  const isExpensesReport = selectedInfo.selectReportType === "expenses_report_entity";

  const getDisplayInformationByCode = useCallback(() => {
    try {
      const dateFrom = selectedInfo.dateFrom ? selectedInfo.dateFrom.format("YYYY-MM-DD") : "";
      const dateTo = selectedInfo.dateTo ? selectedInfo.dateTo.format("YYYY-MM-DD") : "";
      const entityName = selectedInfo.entityName || "";
      const searchWarehouseId = selectedInfo.searchWarehouseId || "all";
      const materialSearchType = selectedInfo.materialSearchType;

      dispatch(getDataInventoryByCode({
        dateFrom,
        dateTo,
        entityName,
        searchWarehouseId,
        materialSearchType,
        selectTypInfroamtion
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch, selectTypInfroamtion, selectedInfo]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          maxHeight: "100vh",
          width: "100vw",
          maxWidth: "none",
          margin: "auto",
        },
      }}
      BackdropProps={{
        style: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(3px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CheckBox />
        {t("اختيار المعلومات المطلوبة")}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }} >
        <Grid container spacing={3}>
          {/* Report Type Selection Section */}
          <Grid size={12}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.success.main}`,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                color="success.main"
                fontWeight="bold"
                sx={{ mb: 3, display: "flex", alignItems: "center" }}
              >
                <Description sx={{ mr: 1 }} />
                {t("اختيار نوع التقرير")}
              </Typography>

              <Grid container spacing={3}>
                <Grid size={12}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: "bold",
                        mb: 2,
                      }}
                    >
                      {t("نوع التقرير")}
                    </FormLabel>
                    <RadioGroup
                      value={selectedInfo.selectReportType || "general"}
                      onChange={handleReportTypeChange}
                      sx={{ gap: 2 }}
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
                </Grid>

                {/* Material Search Section */}
                {isMaterialSearch && (
                  <MaterialSearchSection
                    selectedInfo={selectedInfo}
                    selectTypInfroamtion={selectTypInfroamtion}
                    setSelectTypInfroamtion={setSelectTypInfroamtion}
                    onInfoCheckboxChange={onInfoCheckboxChange}
                    wareHouseData={wareHouseData}
                  />
                )}

                {isFinancialReport && (
                  <FinancialReportSection
                    selectedInfo={selectedInfo}
                    onInfoCheckboxChange={onInfoCheckboxChange}
                  />
                )}

                {isGeneralReport && (
                  <Grid size={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.primary.light + "10",
                        border: `1px dashed ${theme.palette.primary.main}`,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        {t("ملاحظة:")}{" "}
                        {t(
                          "سيتم إنشاء تقرير شامل لجميع البيانات المتاحة حسب الصلاحيات"
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
          {/* Date Range Section - Available for all report types */}
          <Grid size={12}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                color="primary.main"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                <CalendarToday sx={{ mr: 1, verticalAlign: "middle" }} />
                {t("فترة التقرير")}
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <Grid container spacing={2}>
                  <Grid size={12} md={6} >
                    <DatePicker
                      label={t("من تاريخ")}
                      value={selectedInfo.dateFrom}
                      onChange={(newValue) =>
                        onInfoCheckboxChange("dateFrom", newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12} md={6} >
                    <DatePicker
                      label={t("إلى تاريخ")}

                      value={selectedInfo.dateTo}
                      onChange={(newValue) =>
                        onInfoCheckboxChange("dateTo", newValue)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          sx={{ borderRadius: 2 }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Paper>
          </Grid>
          {/* Rest of the sections for general reports */}
          {isGeneralReport && (
            <GeneralReportSection
              selectedInfo={selectedInfo}
              onInfoCheckboxChange={onInfoCheckboxChange}
            />
          )}
        </Grid>

        {/* Second Grid Container for Sections */}
        <Grid container spacing={3}>
          {/* Warehouses, Labs, Factories for General, Financial, and Expenses Reports */}
          {(isGeneralReport || isFinancialReport || isExpensesReport) && (
            <>
              <Grid size={{ xs: 12, md: 8, lg: 4 }}>
                <CollapsibleSection
                  title={t("المخازن المتاحة")}
                  icon={<Warehouse color="info" />}
                  color="info"
                  expanded={expandedSections.warehouses}
                  onToggle={() => onToggleSection("warehouses")}
                  theme={theme}
                >
                  {renderWarehouses}
                </CollapsibleSection>
              </Grid>

              <Grid size={{ xs: 12, md: 8, lg: 4 }}>
                <CollapsibleSection
                  title={t("المعامل المتاحة")}
                  icon={<Science color="success" />}
                  color="success"
                  expanded={expandedSections.labs}
                  onToggle={() => onToggleSection("labs")}
                  theme={theme}
                >
                  {renderLabs}
                </CollapsibleSection>
              </Grid>

              <Grid size={{ xs: 12, md: 8, lg: 4 }}>
                <CollapsibleSection
                  title={t("المصانع المتاحة")}
                  icon={<Factory color="warning" />}
                  color="warning"
                  expanded={expandedSections.factories}
                  onToggle={() => onToggleSection("factories")}
                  theme={theme}
                >
                  {renderFactories}
                </CollapsibleSection>
              </Grid>
            </>
          )}

          {/* Report Types Section */}
          {isGeneralReport && (
            <Grid size={{ xs: 12}}>
              <CollapsibleSection
                title={t("أنواع التقارير")}
                icon={<Assessment color="secondary" />}
                color="secondary"
                expanded={expandedSections.reportTypes}
                onToggle={() => onToggleSection("reportTypes")}
                theme={theme}
              >
                {warehouseReports?.map((report) => (
                  <FormControlLabel
                    key={report?.id}
                    control={
                      <Checkbox
                        checked={selectedInfo?.reportTypes.includes(report?.id)}
                        onChange={() =>
                          onInfoCheckboxChange(
                            "reportTypes",
                            report?.id,
                            report?.title
                          )
                        }
                        sx={{
                          color: theme.palette.secondary.light,
                          "&.Mui-checked": {
                            color: theme.palette.secondary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">{report.title}</Typography>
                    }
                  />
                ))}
              </CollapsibleSection>
            </Grid>
          )}



          {/* Material Information Section */}
          {isGeneralReport && (
            <Grid size={{ xs: 12 }}>
              <CollapsibleSection
                title={t("معلومات التقرير")}
                icon={<Info color="info" />}
                color="info"
                expanded={expandedSections.materials}
                onToggle={() => onToggleSection("materials")}
                theme={theme}
              >
                {InformationMaterial?.map((item) => (
                  <FormControlLabel
                    key={item?.value}
                    control={
                      <Checkbox
                        checked={selectedInfo?.materials?.includes(item?.value)}
                        onChange={() =>
                          onInfoCheckboxChange("materials", item?.value)
                        }
                        sx={{
                          color: theme.palette.error.light,
                          "&.Mui-checked": { color: theme.palette.error.main },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1">{item?.label}</Typography>
                    }
                  />
                ))}
              </CollapsibleSection>
            </Grid>
          )}

          {/* Notes Section */}
          <Grid size={{ xs: 12}}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: `4px solid ${theme.palette.warning.main}`,
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                color="warning.main"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                <Description sx={{ mr: 1, verticalAlign: "middle" }} />
                {t("ملاحظات إضافية")}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t("ملاحظات")}
                value={selectedInfo.notes || ""}
                onChange={(e) => onInfoCheckboxChange("notes", e.target.value)}
                variant="outlined"
                sx={{ borderRadius: 2 }}
                placeholder={t(
                  "أضف أي ملاحظات أو تعليقات إضافية حول التقرير..."
                )}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
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
          <Button
            onClick={onApplySelections}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            {t("تطبيق الاختيارات")}
          </Button>
        )}

        {(isMaterialSearch || isExpensesReport) && (
          <Button
            onClick={getDisplayInformationByCode}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            {t("عرض التقرير")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default memo(InfoSelectionDialog);
