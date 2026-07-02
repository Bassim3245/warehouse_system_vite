import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ArchiveIcon from "@mui/icons-material/Archive";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/ar";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { toast } from "react-toastify";
import {  createMonthlyLockLive } from "../../../../redux/MonthLockState/monthLock";
import { useDispatch } from "react-redux";
import { useMonthlyClose } from "../../../../hooks/useMonthlyClose";
import useGetAllWarehouse from "../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { getUserInformation } from "../../../../utils/handelCookie";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import Step1Content from "./step1";
import Step2Content from "./step2";
import Step3Content from "./step3";

// Step labels - 3 خطوات
const steps = ["اختيار الفترة", "مراجعة السجلات", "تأكيد الأرشفة"];

export default function MonthlyLockForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInformation = getUserInformation();
    const { wareHouseData } = useGetAllWarehouse();
    const [loading, setLoading] = useState(false);

    // Stepper state
    const [activeStep, setActiveStep] = useState(0);

    // Form data
    const [selectedYear, setSelectedYear] = useState(dayjs().year());
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
    const [warehosueId, setWaerhouseId] = useState("");

    // Hook for monthly close logic
    const { isFetching: fetchingDocs, docs, materialSnapshots, fetchStep2Data } = useMonthlyClose();
    const { completed: completedDocs, incomplete: incompleteDocs } = docs;

    // Fetch documents for selected period
    const fetchDocuments = useCallback(async () => {
        await fetchStep2Data(userInformation?.entity_id, selectedYear, selectedMonth, warehosueId);
    }, [userInformation?.entity_id, selectedYear, selectedMonth, warehosueId, fetchStep2Data]);

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
            dispatch(createMonthlyLockLive(formData));
            navigate(-1);
        } catch (error) {
            toast.error("فشل في الأرشفة");
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth, warehosueId, userInformation?.entity_id, dispatch]);

    const handleClose = () => {
        navigate(-1);
    };

    const handleNext = async () => {
        // When moving from step 0 to step 1, fetch documents
        if (activeStep === 0) {
            if (!warehosueId) {
                toast.error("يرجى تحديد المخزن أولاً");
                return;
            }
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
            <Box sx={{ minHeight: "300px" }}>
                {activeStep === 0 && <Step1Content
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    getPeriodText={getPeriodText}
                    selectedWarehouse={selectedWarehouse}
                    handleWarehouseChange={handleWarehouseChange}
                    memoWarehouseOptions={memoWarehouseOptions}
                />}
                {activeStep === 1 && <Step2Content getPeriodText={getPeriodText} fetchingDocs={fetchingDocs} incompleteDocs={incompleteDocs} completedDocs={completedDocs} materialSnapshots={materialSnapshots} />}
                {activeStep === 2 && <Step3Content selectedWarehouse={selectedWarehouse} getPeriodText={getPeriodText} completedDocs={completedDocs} />}
            </Box>
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
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Header
                title="إكمال الجرد الشهري وأرشفة المستندات"
                icon={<ArchiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
            />

            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <FormContent />
                <Divider sx={{ my: 4 }} />
                <FormActions />
            </Paper>
        </Container>
    );
}