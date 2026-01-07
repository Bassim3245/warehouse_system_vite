import { memo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useTheme } from "@mui/material/styles";
import Assessment from "@mui/icons-material/Assessment";
import { useTranslation } from "react-i18next";
const FinancialReportSection = memo(({
    selectedInfo,
    onInfoCheckboxChange,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <Grid size={{ xs: 12 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.success.light + "10",
                    border: `2px solid ${theme.palette.success.main}`,
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    color="success.main"
                    fontWeight="bold"
                    sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                    <Assessment sx={{ mr: 1 }} />
                    {t("التقارير المالية - نظام خزين")}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("نوع التقرير المالي")}</InputLabel>
                            <Select
                                value={selectedInfo.financialReportType || ""}
                                onChange={(e) =>
                                    onInfoCheckboxChange("financialReportType", e.target.value)
                                }
                                label={t("نوع التقرير المالي")}
                            >
                                <MenuItem value="inventory_value">
                                    {t("قيمة المخزون")}
                                </MenuItem>
                                <MenuItem value="cost_analysis">
                                    {t("تحليل التكاليف")}
                                </MenuItem>
                                <MenuItem value="purchase_reports">
                                    {t("تقارير المشتريات")}
                                </MenuItem>
                                <MenuItem value="sales_reports">
                                    {t("تقارير المبيعات")}
                                </MenuItem>
                                <MenuItem value="profit_loss">
                                    {t("الأرباح والخسائر")}
                                </MenuItem>
                                <MenuItem value="budget_analysis">
                                    {t("تحليل الميزانية")}
                                </MenuItem>
                                <MenuItem value="cash_flow">
                                    {t("التدفق النقدي")}
                                </MenuItem>
                                <MenuItem value="financial_summary">
                                    {t("الملخص المالي الشامل")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("العملة")}</InputLabel>
                            <Select
                                value={selectedInfo.currency || "IQD"}
                                onChange={(e) =>
                                    onInfoCheckboxChange("currency", e.target.value)
                                }
                                label={t("العملة")}
                            >
                                <MenuItem value="IQD">
                                    {t("دينار عراقي (IQD)")}
                                </MenuItem>
                                <MenuItem value="USD">
                                    {t("دولار أمريكي (USD)")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("الفترة المالية")}</InputLabel>
                            <Select
                                value={selectedInfo.financialPeriod || ""}
                                onChange={(e) =>
                                    onInfoCheckboxChange("financialPeriod", e.target.value)
                                }
                                label={t("الفترة المالية")}
                            >
                                <MenuItem value="daily">{t("يومي")}</MenuItem>
                                <MenuItem value="weekly">{t("أسبوعي")}</MenuItem>
                                <MenuItem value="monthly">{t("شهري")}</MenuItem>
                                <MenuItem value="quarterly">{t("ربع سنوي")}</MenuItem>
                                <MenuItem value="yearly">{t("سنوي")}</MenuItem>
                                <MenuItem value="custom">{t("فترة مخصصة")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>{t("مستوى التفصيل")}</InputLabel>
                            <Select
                                value={selectedInfo.detailLevel || "summary"}
                                onChange={(e) =>
                                    onInfoCheckboxChange("detailLevel", e.target.value)
                                }
                                label={t("مستوى التفصيل")}
                            >
                                <MenuItem value="summary">{t("ملخص")}</MenuItem>
                                <MenuItem value="detailed">{t("تفصيلي")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
});

export default FinancialReportSection;
