import { memo } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Warehouse from "@mui/icons-material/Warehouse";
import QrCode from "@mui/icons-material/QrCode";
import Info from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";
import { Assessment } from "@mui/icons-material";

const MaterialSearchSection = memo(({
    selectedInfo,
    selectTypInfroamtion,
    setSelectTypInfroamtion,
    wareHouseData,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Grid size={{ xs: 12, md: 8, lg: 4 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.light + "10",
                    border: `2px solid ${theme.palette.primary.main}`,
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ mb: 3, display: "flex", alignItems: "center" }}
                >
                    <QrCode sx={{ mr: 1 }} />
                    {t("البحث عن مادة")}
                </Typography>

                <Grid container spacing={3}>

                    {
                        selectTypInfroamtion.selectRadioMaterialInforamtionType !== "expenses_report_entity" &&
                        <>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t("اختر المخزن")}</InputLabel>
                                    <Select
                                        value={selectTypInfroamtion.selectWarehouse || "all"}
                                        onChange={(e) =>
                                            setSelectTypInfroamtion({
                                                ...selectTypInfroamtion,
                                                selectWarehouse: e.target.value,
                                            })
                                        }
                                        label={t("اختر المخزن")}
                                        startAdornment={
                                            <Warehouse sx={{ mr: 1, color: "action.active" }} />
                                        }
                                    >
                                        <MenuItem value="all">
                                            {t("جميع المخازن")}
                                        </MenuItem>
                                        {wareHouseData?.map((warehouse) => (
                                            <MenuItem key={warehouse?.id} value={warehouse?.id}>
                                                {warehouse?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Material Code Input */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label={t("رمز المادة")}
                                    value={selectTypInfroamtion.material_code || ""}
                                    onChange={(e) =>
                                        setSelectTypInfroamtion({
                                            ...selectTypInfroamtion,
                                            material_code: e.target.value,
                                        })
                                    }
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                    placeholder={t("أدخل رمز المادة او اسم المادة للبحث...")}
                                    InputProps={{
                                        startAdornment: (
                                            <QrCode sx={{ mr: 1, color: "action.active" }} />
                                        ),
                                    }}
                                    helperText={t("أدخل رمز المادة او اسم المادة المراد البحث عنه")}
                                />
                            </Grid>
                        </>
                    }
                    {/* Warehouse Selector */}

                    {
                        selectTypInfroamtion.selectRadioMaterialInforamtionType === "expenses_report_entity" && (
                            <Grid item xs={12}>

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
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            fullWidth
                                            label={t("اسم الجهة (اختياري)")}
                                            value={selectTypInfroamtion.searchKey || ""}
                                            onChange={(e) =>
                                                setSelectTypInfroamtion({
                                                    ...selectTypInfroamtion,
                                                    searchKey: e.target.value,
                                                })
                                            }
                                            variant="outlined"
                                            sx={{ borderRadius: 2 }}
                                            placeholder={t("أدخل اسم الجهة أو اتركه فارغاً لعرض جميع الجهات...")}
                                            helperText={t("إذا تركت هذا الحقل فارغاً، سيتم عرض مصروفات جميع الجهات")}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                        )
                    }
                    {/* Search Type Selection */}
                    <Grid size={{ xs: 12}}>
                        <FormControl component="fieldset" fullWidth>
                            <FormLabel
                                component="legend"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: "bold",
                                    mb: 2,
                                }}
                            >
                                {t("نوع البحث")}
                            </FormLabel>
                            <RadioGroup
                                value={selectTypInfroamtion.selectRadioMaterialInforamtionType}
                                onChange={(e) =>
                                    setSelectTypInfroamtion({
                                        ...selectTypInfroamtion,
                                        selectRadioMaterialInforamtionType: e.target.value,
                                    })
                                }
                                sx={{ gap: 1 }}
                            >
                                <Paper
                                    elevation={selectTypInfroamtion.selectRadioMaterialInforamtionType ? 3 : 1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border:
                                            selectTypInfroamtion.selectRadioMaterialInforamtionType
                                                ? `2px solid ${theme.palette.info.main}`
                                                : "1px solid transparent",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            borderColor: theme.palette.info.main,
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        value="expenses_report_entity"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: theme.palette.info.main,
                                                    "&.Mui-checked": {
                                                        color: theme.palette.info.main,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Warehouse sx={{ color: theme.palette.info.main }} />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        تقرير مصروفات جهات معينة
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        تقرير مصروفات جهات معينة
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        sx={{ margin: 0, width: "100%" }}
                                    />
                                </Paper>

                                <Paper
                                    elevation={selectedInfo.materialSearchType === "general_info" ? 3 : 1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border:
                                            selectedInfo.materialSearchType === "general_info"
                                                ? `2px solid ${theme.palette.success.main}`
                                                : "1px solid transparent",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            borderColor: theme.palette.success.main,
                                        },
                                    }}
                                >
                                    <FormControlLabel
                                        value="general_info"
                                        control={
                                            <Radio
                                                sx={{
                                                    color: theme.palette.success.main,
                                                    "&.Mui-checked": {
                                                        color: theme.palette.success.main,
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Info sx={{ color: theme.palette.success.main }} />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {t("معلومات عامة عن المادة")}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {t("عرض المعلومات التفصيلية والعامة عن المادة")}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        sx={{ margin: 0, width: "100%" }}
                                    />
                                </Paper>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
});

export default MaterialSearchSection;
