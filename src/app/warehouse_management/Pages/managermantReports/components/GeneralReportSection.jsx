import { memo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Title from "@mui/icons-material/Title";
import FileDownload from "@mui/icons-material/FileDownload";
import Description from "@mui/icons-material/Description";
import { useTranslation } from "react-i18next";
import { typeDocument } from "../../../../../constants/arrayFuction";

const GeneralReportSection = memo(({
    selectedInfo,
    onInfoCheckboxChange,
    documentType,
    onDocumentTypeChange,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <>
            {/* Report Information Section */}
            <Grid size={12}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${theme.palette.success.main}`,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        color="success.main"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        <Description sx={{ mr: 1, verticalAlign: "middle" }} />
                        {t("معلومات التقرير")}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label={t("عنوان التقرير")}
                                value={selectedInfo?.reportTitle || ""}
                                onChange={(e) =>
                                    onInfoCheckboxChange("reportTitle", e.target.value)
                                }
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <Title sx={{ mr: 1, color: "action.active" }} />
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>{t("صيغة التقرير")}</InputLabel>
                                <Select
                                    value={selectedInfo.reportFormat || "excel"}
                                    onChange={(e) =>
                                        onInfoCheckboxChange("reportFormat", e.target.value)
                                    }
                                    label={t("صيغة التقرير")}
                                    startAdornment={
                                        <FileDownload sx={{ mr: 1, color: "action.active" }} />
                                    }
                                >
                                    <MenuItem value="excel">{t("ملف Excel")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>{t("نوع المستند")}</InputLabel>
                                <Select
                                    value={documentType || ""}
                                    onChange={onDocumentTypeChange}
                                    label={t("نوع المستند")}
                                >
                                    {typeDocument?.map((docType) => (
                                        <MenuItem key={docType?.value} value={docType.value}>
                                            {t(docType?.label)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label={t("وصف التقرير")}
                                value={selectedInfo.reportDescription || ""}
                                onChange={(e) =>
                                    onInfoCheckboxChange("reportDescription", e.target.value)
                                }
                                variant="outlined"
                                sx={{ borderRadius: 2 }}
                                placeholder={t("أدخل وصفاً مختصراً للتقرير...")}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* General Report Note */}
            <Grid size={{ xs: 12 }}>
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
                        {t("سيتم إنشاء تقرير شامل لجميع البيانات المتاحة حسب الصلاحيات")}
                    </Typography>
                </Box>
            </Grid>
        </>
    );
});

export default GeneralReportSection;
