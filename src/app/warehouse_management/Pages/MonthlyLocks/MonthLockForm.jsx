import  { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { useDispatch } from "react-redux";

// Step labels - 3 خطوات
const steps = ["اختيار الفترة", "مراجعة السجلات", "تأكيد الأرشفة"];

export default function MonthlyLockForm({
    wareHouseData = {},
    userInformation = {},
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingDocs, setFetchingDocs] = useState(false);
    const dispatch = useDispatch();

    // Stepper state
    const [activeStep, setActiveStep] = useState(0);

    // Form data
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [warehosueId, setWaerhouseId] = useState("");

    // Documents data
    const [completedDocs, setCompletedDocs] = useState([]);
    const [incompleteDocs, setIncompleteDocs] = useState([]);

    // Fetch documents for selected period
    const fetchDocuments = useCallback(async () => {
        if (!userInformation?.entity_id) return;

        setFetchingDocs(true);
        try {
            const response = await axiosInstance.get(
                `${BackendUrl}/api/warehouse/getDocumentToCheckInformation?entityId=${userInformation.entity_id}&year=${selectedYear}&month=${selectedMonth}`,
                { headers: { authorization: getToken() } }
            );
            const docs = response?.data?.data || [];

            // Separate completed and incomplete based on is_fully_completed
            const completed = docs.filter(doc => doc.is_fully_completed === 1);
            const incomplete = docs.filter(doc => doc.is_fully_completed === 0);

            setCompletedDocs(completed);
            setIncompleteDocs(incomplete);
        } catch (error) {
            console.error("Error fetching documents:", error);
            toast.error("فشل في جلب المستندات");
        } finally {
            setFetchingDocs(false);
        }
    }, [userInformation?.entity_id, selectedYear, selectedMonth]);

    const getPeriodText = () => {
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return `${monthNames[selectedMonth - 1]} ${selectedYear}`;
    };

    const handleSubmit = useCallback(async () => {
        if (!warehosueId) {
            toast.error("يرجى تحديد المخزن");
            return;
        }
        if (!selectedYear || !selectedMonth) {
            toast.error("يرجى تحديد السنة والشهر");
            return;
        }
        if (selectedMonth < 1 || selectedMonth > 12) {
            toast.error("الشهر يجب أن يكون بين 1 و 12");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("entity_id", userInformation?.entity_id);
            formData.append("year", selectedYear);
            formData.append("month", selectedMonth);
            formData.append("warehouse_id", warehosueId);
            dispatch(createMonthlyLock(formData));
            handleClose();
        } catch (error) {
            toast.error("فشل في الأرشفة");
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth, warehosueId, userInformation?.entity_id, dispatch]);

    const handleOpen = () => {
        setOpen(true);
        setActiveStep(0);
        setCompletedDocs([]);
        setIncompleteDocs([]);
    };

    const handleClose = () => {
        if (!loading) {
            setOpen(false);
            setActiveStep(0);
            setCompletedDocs([]);
            setIncompleteDocs([]);
        }
    };

    const handleNext = async () => {
        // When moving from step 0 to step 1, fetch documents
        if (activeStep === 0) {
            await fetchDocuments();
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleWarehouseChange = useCallback((event, newValue) => {
        const newId = newValue?.id || "";
        setWaerhouseId(newId);
    }, []);

    const memoWarehouseOptions = useMemo(
        () => wareHouseData || [],
        [wareHouseData]
    );

    const selectedWarehouse = useMemo(
        () => memoWarehouseOptions.find((w) => w.id === warehosueId) || null,
        [memoWarehouseOptions, warehosueId]
    );

    // ============================================
    // الخطوة 1: اختيار الفترة (السنة والشهر)
    // ============================================
    const Step1Content = () => (
        <Box sx={{ p: 2 }} >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <CalendarMonthIcon color="primary" />
                <Typography variant="h6" color="text.primary">
                    اختر الفترة الزمنية للأرشفة
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
                </Grid>
            </LocalizationProvider>

            {/* Selected Period Preview */}
            <Paper
                variant="outlined"
                sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'primary.50',
                    borderColor: 'primary.200',
                    textAlign: 'center'
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                    <DateRangeIcon color="primary" />
                    <Typography variant="subtitle1" color="primary.main" fontWeight={600}>
                        الفترة المحددة: {getPeriodText()}
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    اضغط "التالي" لعرض السجلات لهذه الفترة
                </Typography>
            </Paper>
        </Box>
    );

    // ============================================
    // الخطوة 2: مراجعة السجلات (المكتملة وغير المكتملة)
    // ============================================
    const Step2Content = () => (
        <Box sx={{ p: 2 }} dir="rtl">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <AssignmentIcon color="info" />
                <Typography variant="h6" color="text.primary">
                    مراجعة السجلات للفترة: {getPeriodText()}
                </Typography>
            </Stack>

            {fetchingDocs ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>جاري جلب السجلات...</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* Incomplete Documents Warning */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        {incompleteDocs.length > 0 ? (
                            <Alert severity="warning" sx={{ height: '100%' }}>
                                <AlertTitle>
                                    ⚠️ مستندات غير مكتملة ({incompleteDocs.length})
                                </AlertTitle>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    هذه المستندات لن تُؤرشف وستنتقل للشهر القادم:
                                </Typography>
                                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {incompleteDocs.map((doc) => (
                                        <ListItem key={doc.document_id} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <DescriptionIcon fontSize="small" color="warning" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${doc.document_type === 'out' ? 'صادر' : doc.document_type === 'in' ? 'وارد' : doc.document_type === 'internal_consumption' ? 'استهلاك داخلي' : 'مستند'} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} - ${doc.warehouse_name} (${doc.incomplete_inventory_count} مادة غير مكتملة)`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Alert>
                        ) : (
                            <Alert severity="success" sx={{ height: '100%' }}>
                                <AlertTitle>✅ لا توجد مستندات غير مكتملة</AlertTitle>
                                <Typography variant="body2">
                                    جميع المستندات لهذه الفترة مكتملة ويمكن أرشفتها.
                                </Typography>
                            </Alert>
                        )}
                    </Grid>

                    {/* Completed Documents */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%', bgcolor: 'success.50' }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <CheckCircleIcon color="success" />
                                <Typography variant="subtitle1" fontWeight={600} color="success.dark">
                                    المستندات المكتملة ({completedDocs.length})
                                </Typography>
                            </Stack>
                            {completedDocs.length > 0 ? (
                                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {completedDocs.map((doc) => (
                                        <ListItem key={doc.document_id} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <CheckCircleIcon fontSize="small" color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${doc.document_type === 'out' ? 'صادر' : doc.document_type === 'in' ? 'وارد' : doc.document_type === 'internal_consumption' ? 'استهلاك داخلي' : 'مستند'} #${doc.document_number}`}
                                                secondary={`${dayjs(doc.document_date).format('YYYY/MM/DD')} - ${doc.warehouse_name}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    لا توجد مستندات مكتملة لهذه الفترة.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );

    // ============================================
    // الخطوة 3: تأكيد الأرشفة
    // ============================================
    const Step3Content = () => (
        <Box sx={{ p: 2 }} dir="rtl">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <ArchiveIcon color="success" />
                <Typography variant="h6" color="text.primary">
                    تأكيد الأرشفة النهائية
                </Typography>
            </Stack>

            {/* Warehouse Selection */}
            <Grid container spacing={2}>
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
                                label="اختر المخزن (اختياري)"
                                placeholder="اختر مخزن للتصفية أو اتركه فارغ لأرشفة الكل..."
                                size="small"
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box
                                key={option.id}
                                component="li"
                                {...props}
                                sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}
                            >
                                <Warehouse sx={{ color: "primary.main", fontSize: 18 }} />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                        {option.name}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        noOptionsText="لا توجد مخازن"
                    />
                </Grid>
            </Grid>

            {/* Summary */}
            <Divider sx={{ my: 3 }} />

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    bgcolor: 'grey.50',
                    border: '2px solid',
                    borderColor: 'primary.200'
                }}
            >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    📊 ملخص الأرشفة
                </Typography>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                            <CalendarMonthIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">الفترة</Typography>
                            <Typography variant="subtitle1" fontWeight={600}>{getPeriodText()}</Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">سيتم أرشفته</Typography>
                            <Typography variant="h5" fontWeight={600} color="success.main">
                                {completedDocs.length}
                            </Typography>
                            <Typography variant="caption">مستند مكتمل</Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.50' }}>
                            <WarningAmberIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">سينتقل للشهر القادم</Typography>
                            <Typography variant="h5" fontWeight={600} color="warning.main">
                                {incompleteDocs.length}
                            </Typography>
                            <Typography variant="caption">مستند غير مكتمل</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                {incompleteDocs.length > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        المستندات غير المكتملة لن تُؤرشف وستبقى متاحة للتعديل في الشهر القادم.
                    </Alert>
                )}
            </Paper>
        </Box>
    );

    const FormContent = () => (
        <Box sx={{ minHeight: 400 }}>
            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ pt: 2, pb: 3 }}>
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            {activeStep === 0 && <Step1Content />}
            {activeStep === 1 && <Step2Content />}
            {activeStep === 2 && <Step3Content />}
        </Box>
    );

    const FormActions = () => (
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ width: '100%' }}>
            <Box>
                {activeStep > 0 && (
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowForwardIcon />}
                        disabled={loading || fetchingDocs}
                    >
                        السابق
                    </Button>
                )}
            </Box>
            <Stack direction="row" spacing={1}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    disabled={loading}
                    size="small"
                    color="inherit"
                >
                    {t("close")}
                </Button>

                {activeStep < 2 ? (
                    <ButtonTheme
                        variant="contained"
                        onClick={handleNext}
                        disabled={fetchingDocs}
                        endIcon={fetchingDocs ? <CircularProgress size={16} color="inherit" /> : <ArrowBackIcon />}
                        size="small"
                    >
                        {activeStep === 0 ? "عرض السجلات" : "التالي"}
                    </ButtonTheme>
                ) : (
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
                        {loading ? "جاري الأرشفة..." : "أرشفة نهائية"}
                    </ButtonTheme>
                )}
            </Stack>
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
                width="100%"
                height="100%"
                isFullScreen={true}
                fullheight={true}
                content={<FormContent />}
                footer={<FormActions />}
            />
        </div>
    );
}