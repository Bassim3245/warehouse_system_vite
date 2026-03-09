import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import dayjs from "dayjs";
import "dayjs/locale/ar";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { toast } from "react-toastify";
import { createMonthlyLock } from "../../../../redux/MonthLockState/monthLock";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken } from "../../../../utils/handelCookie";
import { useDispatch } from "react-redux";
import Step1Content from "./step1";
import Step2Content from "./step2";
import Step3Content from "./step3";

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



    const FormContent = () => (
        <Box dir="rtl">
            {/* Stepper */}
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    pt: 2,
                    pb: 3,
                    direction: "ltr",   // keep MUI stepper LTR internally so step numbers are correct
                    "& .MuiStepLabel-label": {
                        fontFamily: "Cairo, sans-serif",
                        fontSize: "13px",
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            {activeStep === 0 && <Step1Content selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} getPeriodText={getPeriodText} />}
            {activeStep === 1 && <Step2Content getPeriodText={getPeriodText} fetchingDocs={fetchingDocs} incompleteDocs={incompleteDocs} completedDocs={completedDocs} />}
            {activeStep === 2 && <Step3Content selectedWarehouse={selectedWarehouse} handleWarehouseChange={handleWarehouseChange} memoWarehouseOptions={memoWarehouseOptions} getPeriodText={getPeriodText} completedDocs={completedDocs} />}
        </Box>
    );

    const FormActions = () => (
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ width: '100%', gap: 1 }}>
            <Box>
                {activeStep > 0 && (
                    <Button
                        onClick={handleBack}
                        variant="outlined"
                        size="small"
                        startIcon={<ArrowBackIcon />}
                        disabled={loading || fetchingDocs}
                    >
                        السابق
                    </Button>
                )}
            </Box>
            <Stack direction="row" spacing={1} sx={{ gap: 1 }}>
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
                        disabled={fetchingDocs || (activeStep === 1 && incompleteDocs.length > 0) || (activeStep === 1 && completedDocs.length === 0)}
                        startIcon={fetchingDocs ? <CircularProgress size={16} color="inherit" /> : <ArrowForwardIcon />}
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
                <ButtonTheme
                    onClick={handleOpen}
                    startIcon={<ArchiveIcon />}
                >
                    أرشفة نهائية
                </ButtonTheme>
            </Tooltip>
            <PopupForm
                title="إكمال الجرد الشهري وأرشفة المستندات"
                open={open}
                onClose={handleClose}
                setOpen={setOpen}
                icon={<ArchiveIcon />}
                width="100%"
                content={<FormContent />}
                footer={<FormActions />}
            />
        </div>
    );
}