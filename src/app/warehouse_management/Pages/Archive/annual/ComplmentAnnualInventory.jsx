import React, { useState } from "react";
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

import dayjs from "dayjs";
import PopupForm from "../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../components/reusableComponent/CustomDatePicker";
import { ButtonTheme } from "../../../../../style/ButtomStyle";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import { BackendUrl } from "../../../../../redux/api/axios";
import { getToken } from "../../../../../utils/handelCookie";
import { toast } from "react-toastify";

export default function AnnualInventoryModel({
  documentArchiveMonthly,
  setRefreshButton,
  dataUserById,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(dayjs().month(0).startOf("month")); // January 1st
  const [endDate, setEndDate] = useState(dayjs().month(11).endOf("month")); // December 31st

  const [enableArchiving, setEnableArchiving] = useState(true);

  const getPeriodText = () => {
    return `من ${startDate.format("DD/MM/YYYY")} إلى ${endDate.format(
      "DD/MM/YYYY"
    )}`;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      toast.error("يرجى تحديد الفترة الزمنية");
      return;
    }
    if (startDate.isAfter(endDate)) {
      toast.error("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      return;
    }
    setLoading(true);
    try {
      const periodData = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      };
      const filteredDocumentMaterials = documentArchiveMonthly.map((item) => ({
        id: item.id,
        is_complete: item.is_complete,
        documentNumber: item.document_number,
      }));
      const formData = new FormData();
      formData.append("entity_id", dataUserById?.entity_id);
      formData.append("periodData", JSON.stringify(periodData));
      formData.append(
        "document_materials",
        JSON.stringify(filteredDocumentMaterials)
      );
      formData.append("enableArchiving", enableArchiving);
      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/archive-annual-documents`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        }
      );

      toast.success(response?.data?.message || "تمت الأرشفة بنجاح");
      setRefreshButton((prev) => !prev);
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) setOpen(false);
  };
  const styleListRtl = {
    "& .css-1q1r3r9-MuiTypography-root": {
      textAlign: "right",
    },
  };
  const ConfirmationSection = () => (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={1}
      sx={{ direction: "rtl", textAlign: "right" }} // جعل الاتجاه عربي
    >
      <WarningIcon color="error" sx={{ mt: 0.5 }} />
      <Box>
        <Typography
          variant="subtitle2"
          color="error.main"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "inherit" }} // حل مشكلة الخط
        >
          تأكيد الأرشفة النهائية
        </Typography>
        <DialogContentText variant="body2" sx={{ fontFamily: "inherit" }}>
          سيتم أرشفة <strong>{documentArchiveMonthly.length}</strong> مستند
          للفترة من <strong>{startDate.format("DD/MM/YYYY")}</strong> إلى{" "}
          <strong>{endDate.format("DD/MM/YYYY")}</strong>.
        </DialogContentText>
        <List dense sx={{ direction: "rtl" }}>
          {" "}
          {/* جعل اللستة RTL */}
          <ListItem>
            <ListItemIcon sx={{ minWidth: "32px" }}>
              {" "}
              {/* تقليل المسافة بين الأيقونة والنص */}
              <CheckCircleIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText
              sx={{
                ...styleListRtl,
              }}
              primary="سيتم نقل البيانات إلى الأرشيف السنوي"
              primaryTypographyProps={{
                variant: "caption",
                sx: { fontFamily: "inherit" },
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <ArchiveIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText
              sx={{
                ...styleListRtl,
              }}
              primary="سيتم حفظ المستندات المكتملة بشكل دائم"
              primaryTypographyProps={{
                variant: "caption",
                sx: { fontFamily: "inherit" },
              }}
            />
          </ListItem>
          <ListItem
            sx={{
              textAlign: "right",
            }}
          >
            <ListItemIcon sx={{ minWidth: "32px" }}>
              <WarningIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText
              sx={{
                ...styleListRtl,
              }}
              primary="لن تتمكن من تعديل البيانات المؤرشفة بعد ذلك"
              primaryTypographyProps={{
                variant: "caption",
                color: "error.main",
                sx: { fontFamily: "inherit" },
              }}
            />
          </ListItem>
        </List>
      </Box>
    </Stack>
  );

  const FormContent = () => (
    <Box>
      <Box sx={{ p: 2 }} dir={"rtl"}>
        {" "}
        {/* تقليص البادينغ */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="subtitle1" color="primary.main">
            {" "}
            {/* حجم أصغر */}
            اختيار الفترة الزمنية للأرشفة
          </Typography>
        </Stack>
        <Grid container spacing={1}>
          {" "}
          {/* تقليل المسافات */}
          <Grid item xs={12} sm={6} dir={"ltr"}>
            <CustomDatePicker
              haswidth
              label="من تاريخ"
              format="DD/MM/YYYY"
              value={startDate}
              setValue={setStartDate}
              maxDate={endDate}
            />
          </Grid>
          <Grid item xs={12} sm={6} dir="ltr">
            <CustomDatePicker
              haswidth
              label="إلى تاريخ"
              format="DD/MM/YYYY"
              value={endDate}
              setValue={setEndDate}
              minDate={startDate}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 1,
            p: 1,
            bgcolor: "background.paper",
            borderRadius: 1,
            border: "1px dashed",
            borderColor: "primary.300",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <DateRangeIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              {" "}
              {/* حجم أصغر */}
              الفترة المحددة: <strong>{getPeriodText()}</strong>
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ mt: 2 }}>{ConfirmationSection()}</Box>
      </Box>
    </Box>
  );
  const FormActions = () => (
    <Stack direction="row" spacing={1} justifyContent="flex-end">
      {" "}
      {/* تقليل spacing */}
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
        disabled={loading || documentArchiveMonthly.length === 0}
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <FolderSpecialIcon />
          )
        }
        size="small"
      >
        {loading
          ? "جاري الأرشفة..."
          : `تأكيد الأرشفة (${documentArchiveMonthly.length} مستند)`}
      </ButtonTheme>
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
        icon={<ArchiveIcon color="success" />}
        width="50%"
        content={<FormContent />}
        footer={<FormActions />}
      />
    </div>
  );
}
