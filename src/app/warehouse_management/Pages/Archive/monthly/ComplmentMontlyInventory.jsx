import { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import DateRange from "@mui/icons-material/DateRange";
import ArchiveIcon from "@mui/icons-material/Archive";
import Description from "@mui/icons-material/Description";
import FolderSpecial from "@mui/icons-material/FolderSpecial";

import dayjs from "dayjs";
import PopupForm from "../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../components/reusableComponent/CustomDatePicker";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../../redux/api/axios";
import { getToken } from "../../../../../utils/handelCookie";
import { toast } from "react-toastify";

export default function MonthlyInventory({
  setRefreshButton,
  documentMaterials,
  dataUserById,
}) {
  const { t } = useTranslation();
  // Main states
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [_, setArchiveStatus] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [enableArchiving, setEnableArchiving] = useState(true);
  // Get completed documents for archiving
  const documentsToArchive =
    documentMaterials?.filter((item) => item.is_complete === 1) || [];

  // Get selected period text
  const getPeriodText = () => {
    return `من ${startDate.format("DD/MM/YYYY")} إلى ${endDate.format(
      "DD/MM/YYYY"
    )}`;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setArchiveStatus(null);

    try {
      const periodData = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      };

      const filteredDocumentMaterials = documentMaterials
        ?.filter((item) => item.is_complete === 1)
        ?.map((item) => ({
          id: item.id,
          is_complete: item.is_complete,
        }));

      const formData = new FormData();
      formData.append("periodData", JSON.stringify(periodData));
      formData.append("entity_id", dataUserById.entity_id);
      formData.append(
        "document_materials",
        JSON.stringify(filteredDocumentMaterials)
      );

      if (enableArchiving) {
        formData.append("enableArchiving", JSON.stringify(enableArchiving));
      }

      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/archiveMonthlyDocuments`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        }
      );
      toast.success(response?.data?.message);
      setRefreshButton((prev) => !prev);
    } catch (error) {
      toast.error(error?.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Dialog handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setStartDate(dayjs().startOf("month"));
    setEndDate(dayjs().endOf("month"));
    setEnableArchiving(true);
    setArchiveStatus(null);
  };

  const renderDateRangeSelector = () => (
    <Grid container spacing={2} sx={{ mt: 1 }} dir="ltr">
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDatePicker
          haswidth={true}
          label="من تاريخ"
          format="DD/MM/YYYY"
          placeholder="من تاريخ"
          customWidth="100%"
          required={true}
          value={startDate}
          setValue={setStartDate}
          maxDate={endDate}
          borderColor="inherit"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomDatePicker
          haswidth={true}
          label="إلى تاريخ"
          format="DD/MM/YYYY"
          placeholder="إلى تاريخ"
          customWidth="100%"
          required={true}
          value={endDate}
          setValue={setEndDate}
          minDate={startDate}
          borderColor="inherit"
        />
      </Grid>
    </Grid>
  );

  const renderArchiveOptions = () => (
    <Box sx={{ mt: 2 }}>
      {enableArchiving && documentsToArchive.length > 0 && (
        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ mb: 1, p: 1, bgcolor: "background.paper", borderRadius: 1, border: "1px dashed", borderColor: "primary.300" }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DateRange fontSize="small" color="primary" />
              <Typography variant="caption" color="text.secondary">
                الفترة المحددة: <strong>{getPeriodText()}</strong>
              </Typography>
            </Stack>
          </Box>
          <Grid container spacing={1}>
            {documentsToArchive.slice(0, 5).map((doc, index) => (
              <Grid item key={doc?.id || index}>
                <Chip
                  icon={<Description fontSize="small" />}
                  label={doc?.name || `مستند ${index + 1}`}
                  size="small"
                  variant="outlined"
                />
              </Grid>
            ))}
            {documentsToArchive.length > 5 && (
              <Grid item>
                <Chip
                  label={`+${documentsToArchive.length - 5} أخرى`}
                  size="small"
                  variant="outlined"
                />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );

  const renderFormContent = () => (
    <Box dir={"rtl"}>
      {renderDateRangeSelector()}
      {renderArchiveOptions()}
    </Box>
  );

  const renderFormActions = () => (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      <Button onClick={handleClose} variant="outlined" disabled={loading} size="small">
        {t("close")}
      </Button>
      <ButtonTheme
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={loading || documentsToArchive.length === 0}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <FolderSpecial />}
        size="small"
      >
        {loading
          ? "جاري الأرشفة..."
          : `تأكيد الأرشفة (${documentsToArchive.length} مستند)`}
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
        >
          إكمال وأرشفة
        </Button>
      </Tooltip>
      <PopupForm
        title="إكمال الجرد الشهري وأرشفة المستندات"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        icon={<ArchiveIcon color="success" />}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
