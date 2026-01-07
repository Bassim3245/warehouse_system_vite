import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import "dayjs/locale/ar";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { toast } from "react-toastify";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { Warehouse } from "lucide-react";
import { createMonthlyLock } from "../../../../redux/MonthLockState/monthLock";

export default function MonthlyLockForm({
    wareHouseData = {},
    dispatch = () => { },
    userInformation = {},

}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState(dayjs().year()); // السنة الحالية
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // الشهر الحالي (1-12)
    const [warehosueId, setWaerhouseId] = useState("");
    const getPeriodText = () => {
        return `السنة: ${selectedYear} - الشهر: ${selectedMonth}`;
    };
    const handleSubmit = useCallback(async () => {
        if (!selectedYear || !selectedMonth) {
            toast.error("يرجى تحديد السنة والشهر");
            return;
        }
        if (selectedMonth < 1 || selectedMonth > 12) {
            toast.error("الشهر يجب أن يكون بين 1 و 12");
            return;
        }
        const formData = new FormData();
        formData.append("entity_id", userInformation?.entity_id);
        formData.append("year", selectedYear);
        formData.append("month", selectedMonth);
        formData.append("warehouse_id", warehosueId);
        dispatch(createMonthlyLock(formData));
    },
        [
            selectedYear,
            selectedMonth,
            warehosueId,
            userInformation?.entity_id,
            dispatch,
        ]
    );

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (!loading) setOpen(false);
    };

    const styleListRtl = {
        "& .css-1q1r3r9-MuiTypography-root": {
            textAlign: "right",
        },
    };
    const handleWarehouseChange = useCallback(
        (event, newValue) => {
            const newId = newValue?.id || "";
            setWaerhouseId(newId);

        },
        []
    );

    const memoWarehouseOptions = useMemo(
        () => wareHouseData || [],
        [wareHouseData]
    );

    const selectedWarehouse = useMemo(
        () => memoWarehouseOptions.find((w) => w.id === warehosueId) || null,
        [memoWarehouseOptions, warehosueId]
    );





    const FormContent = () => (
        <Box>
            <Box sx={{ p: 2 }} dir="rtl">
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="subtitle1" color="primary.main">
                        اختيار الفترة الزمنية للأرشفة
                    </Typography>
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <DatePicker
                                label="اختر السنة"
                                views={["year"]}
                                value={dayjs().year(selectedYear)}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        setSelectedYear(newValue.year());
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: "small",
                                    },
                                }}
                                format="YYYY"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="number"
                                label="اختر الشهر (1-12)"
                                value={selectedMonth}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= 12) {
                                        setSelectedMonth(value);
                                    }
                                }}
                                inputProps={{ min: 1, max: 12 }}
                                size="small"
                                helperText="أدخل رقم الشهر من 1 إلى 12"
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Autocomplete
                                fullWidth
                                options={memoWarehouseOptions}
                                getOptionLabel={(option) => option?.name || ""}
                                value={selectedWarehouse}
                                onChange={handleWarehouseChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="تصفية حسب المخزن"
                                        placeholder="اختر مخزن للتصفية أو اتركه فارغاً لعرض الكل..."
                                        sx={{ borderRadius: 2 }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <Box
                                        key={option.id}
                                        component="li"
                                        {...props}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            p: 1,
                                        }}
                                    >
                                        <Warehouse sx={{ color: "primary.main", fontSize: 18 }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                                {option.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {option.location} - {option.user_name}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={option.status}
                                            color={option.status === "ممتلئ" ? "error" : "success"}
                                            size="small"
                                        />
                                    </Box>
                                )}
                                noOptionsText="لا توجد مخازن"
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        border: "1px dashed",
                        borderColor: "primary.300",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <DateRangeIcon fontSize="small" color="primary" />
                        <Typography variant="caption" color="text.secondary">
                            الفترة المحددة: <strong>{getPeriodText()}</strong>
                        </Typography>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );

    const FormActions = () => (
        <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
                onClick={handleClose}
                variant="outlined"
                disabled={loading}
                size="small"
            >
                {t("close")}
            </Button>
            <ButtonTheme
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={
                    loading ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : (
                        <FolderSpecialIcon />
                    )
                }
                size="small"
            >
                جاري الأرشفة...
            </ButtonTheme>
        </Stack>
    );

    return (
        <div>
            <Tooltip title="إكمال الجرد الشهري وأرشفة المستندات المكتملة">
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpen}
                    startIcon={<ArchiveIcon />}
                    size="medium"
                    sx={{ boxShadow: 1, "&:hover": { boxShadow: 3 } }}
                >
                    أرشفة نهائية
                </Button>
            </Tooltip>
            <PopupForm
                title="إكمال الجرد الشهري وأرشفة المستندات"
                open={open}
                onClose={handleClose}
                setOpen={setOpen}
                icon={<ArchiveIcon color="success" />}
                width="50%"
                content={<FormContent />}
                footer={<FormActions />}
            />
        </div>
    );
}