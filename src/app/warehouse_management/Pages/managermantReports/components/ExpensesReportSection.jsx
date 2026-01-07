import { memo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Assessment from "@mui/icons-material/Assessment";
import { useTranslation } from "react-i18next";

const ExpensesReportSection = memo(({
    material_code,
    onMaterialCodeChange,
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
                    backgroundColor: theme.palette.info.light + "10",
                    border: `2px solid ${theme.palette.info.main}`,
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    color="info.main"
                    fontWeight="bold"
                    sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                    <Assessment sx={{ mr: 1 }} />
                    {t("تقرير مصروفات الجهات")}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label={t("اسم الجهة (اختياري)")}
                            value={material_code || ""}
                            onChange={onMaterialCodeChange}
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                            placeholder={t("أدخل اسم الجهة أو اتركه فارغاً لعرض جميع الجهات...")}
                            helperText={t("إذا تركت هذا الحقل فارغاً، سيتم عرض مصروفات جميع الجهات")}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
});

export default ExpensesReportSection;
