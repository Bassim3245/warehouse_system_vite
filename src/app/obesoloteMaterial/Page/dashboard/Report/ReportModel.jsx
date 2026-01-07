import { useState } from "react";
import {useTheme} from "@mui/material/styles";import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";

import Button from "@mui/material/Button";
import Download from "@mui/icons-material/Download";
import Description from "@mui/icons-material/Description";
import Close from "@mui/icons-material/Close";
import DateRange from "@mui/icons-material/DateRange";

import { useTranslation } from "react-i18next";
import PopupForm from "../../../../../components/reusableComponent/PopupForm";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../../../../../redux/api/axios";
import { getToken } from "../../../../../utils/handelCookie";
import { BottomRoot } from "../../../../../style/ButtomStyle";
import CustomDatePicker from "../../../../../components/reusableComponent/CustomDatePicker";
import Loader from "../../../../../components/reusableComponent/Loader";
import DisplayInformationComponent from "./displayData";
import { green, pink, blue } from "@mui/material/colors";
import "./style.css";
import {
  exportData,
  exportData2,
  InformationSelectMaterial,
  InformationSelectUser,
  options,
  ReportCheckboxGroup,
} from "../../../../../constants/ReportData";

export default function ReportModel({ reportEntity, entity_id, user_id }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setIsActive] = useState([]); // Active checkboxes
  const [activeUser, setIsActiveUser] = useState([]); // Active checkboxes
  const [activeMaterial, setIsActiveMaterial] = useState([]); // Active checkboxes
  const [selectDate, setSelectDate] = useState({ from: null, to: null });
  const [reportFormat, setReportFormat] = useState("pdf");
  const [checked, setChecked] = useState([true, false]);
  const token = getToken();
  const [userData, setUserData] = useState([]);
  const [includes, setIncludes] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [materialData, seTMaterialsData] = useState([]);
  const [informationUser, setInformationUser] = useState([]);
  const [informationMaterial, setInformationMaterial] = useState([]);
  const [mainClassesDataAndSubClass, setMainClassesDataAndSubClass] = useState(
    []
  );
  const [materialOfDataWithinGivenData, setMaterialOfDataWithinGivenData] =
    useState([]);
  const [materialsBookedData, setMaterialsBookedData] = useState([]);
  const [dateFrom, setdateFrom] = useState("");
  const [dateTo, setdateTo] = useState("");

  let dataExport;
  switch (reportEntity) {
    case true:
      dataExport = exportData2;
      break;
    case false:
      dataExport = exportData;
      break;
    default:
      dataExport = [];
      break;
  }

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleCheckboxChange = (id) => () => {
    setIsActive((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
  };

  const handleCheckboxChangeUser = (id) => () => {
    setIsActiveUser((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
  };

  const handleCheckboxChangeMaterial = (id) => () => {
    setIsActiveMaterial((prevState) => {
      return prevState.includes(id)
        ? prevState.filter((itemId) => itemId !== id)
        : [...prevState, id];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (active.length === 0) {
      toast.error(t("يجب أختيار تقرير واحد على الاقل"));
      return;
    }
    setLoading(true);
    try {
      const selectedReports = exportData
        .filter((item) => active.includes(item?.id))
        .map((item) => item.value);
      const selectedDataUser = InformationSelectUser?.filter((item) =>
        activeUser.includes(item?.id)
      ).map((item) => item.value);
      const selectedDataMaterial = InformationSelectMaterial?.filter((item) =>
        activeMaterial.includes(item?.id)
      ).map((item) => item?.value);
      const requestData = {
        reports: selectedReports,
        dataUser: selectedDataUser,
        dataMaterial: selectedDataMaterial,
        format: reportFormat,
        ifEntity: reportEntity,
        user_id,
        entity_id,
      };

      // Add date range if applicable
      if (selectDate?.from && selectDate?.to) {
        requestData.dateFrom = selectDate.from;
        requestData.dateTo = selectDate.to;
      }
      // If the format is to display data
      if (reportFormat === "displayData") {
        const reports = selectedReports.join(",");
        // API call to fetch report data
        const response = await axios.get(
          `${BackendUrl}/api/getDataINforamaitionReport`,
          {
            params: {
              selectedReports: reports,
              ifEntity: reportEntity,
              dateFrom: selectDate.from,
              dateTo: selectDate.to,
              entity_id: entity_id,
              dataUser: selectedDataUser,
              dataMaterial: selectedDataMaterial,
            },
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response?.data) {
          // Store fetched data in corresponding states
          setUserData(response?.data?.usersData || []);
          setMinistries(response?.data?.ministriesData || []);
          seTMaterialsData(response?.data?.materialsData || []);
          setMainClassesDataAndSubClass(response?.data?.mainClassesData || []);
          setMaterialOfDataWithinGivenData(
            response?.data?.materialOfDataWithinGivenData || []
          );
          setMaterialsBookedData(response?.data?.materialsBookedData || []);
          setIncludes(reports || []);
          setInformationMaterial(selectedDataMaterial || []);
          setInformationUser(selectedDataUser || []);
          setdateFrom(response.data.dateForm || []);
          setdateTo(response.data.dateTo || []);

          // toast.success(t("D!"));
        } else {
          toast.error(t("Failed to fetch report data."));
        }
      } else {
        // File download logic
        const endpoint = `${BackendUrl}/api/exportData`;
        const response = await axios.post(endpoint, requestData, {
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        });

        if (response?.data) {
          const fileType =
            reportFormat === "pdf"
              ? "application/pdf"
              : reportFormat === "word"
                ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                : "application/vnd.ms-excel";
          const fileExtension =
            reportFormat === "pdf"
              ? ".pdf"
              : reportFormat === "word"
                ? ".docx"
                : ".xlsx";
          const blob = new Blob([response.data], { type: fileType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${new Date().toISOString()}${fileExtension}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          toast.success(t("Report downloaded successfully!"));
        } else {
          toast.error(t("Failed to generate report."));
        }
      }
    } catch (error) {
      toast.error(t("An error occurred while processing the report."));
    } finally {
      setLoading(false);
    }
  };

  const hasData =
    includes.length > 0 ||
    userData.length > 0 ||
    ministries.length > 0 ||
    materialData.length > 0 ||
    mainClassesDataAndSubClass.length > 0 ||
    materialsBookedData.length > 0 ||
    materialOfDataWithinGivenData.length > 0;

  const renderFormContent = () => (
    <Box component="form" sx={{ p: 3 }}>
      <Grid container spacing={3} dir="rtl">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              {t("نوع التقرير")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl component="fieldset">
              <RadioGroup
                aria-labelledby="report-format-radio-buttons-group-label"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option?.value}
                    value={option?.value}
                    control={
                      <Radio
                        sx={{
                          color: blue[400],
                          '&.Mui-checked': {
                            color: blue[600],
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1">{option?.label}</Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              borderLeft: `4px solid ${theme.palette.secondary.main}`
            }}
          >
            <Typography variant="h6" color="secondary" gutterBottom fontWeight="bold">
              {t("محتوى التقرير")}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormGroup>
              {dataExport?.map((item) => (
                <FormControlLabel
                  key={item?.id}
                  control={
                    <Checkbox
                      checked={active?.includes(item?.id)}
                      onChange={handleCheckboxChange(item?.id)}
                      sx={{
                        color: theme.palette.secondary.light,
                        '&.Mui-checked': {
                          color: theme.palette.secondary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1">{item.label}</Typography>
                  }
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        {(active?.includes("1") || active?.includes("3") || active.includes("5")) && (
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                borderLeft: `4px solid ${theme.palette.info.main}`
              }}
            >
              <Typography variant="h6" color="info.main" gutterBottom fontWeight="bold">
                {t("تفاصيل إضافية")}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {active?.includes("1") && (
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(pink[50], 0.3),
                      }}
                    >
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {t("معلومات المستخدم")}
                      </Typography>
                      <ReportCheckboxGroup
                        items={InformationSelectUser}
                        activeItems={activeUser}
                        handleChange={handleCheckboxChangeUser}
                        handleChange1={handleChange1}
                        checked={checked}
                        setChecked={setChecked}
                        color={pink}
                      />
                    </Paper>
                  </Grid>
                )}

                {(active?.includes("3") || active.includes("5")) && (
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(green[50], 0.3),
                      }}
                    >
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {t("معلومات المواد")}
                      </Typography>
                      <ReportCheckboxGroup
                        items={InformationSelectMaterial}
                        activeItems={activeMaterial}
                        handleChange={handleCheckboxChangeMaterial}
                        handleChange1={handleChange1}
                        checked={checked}
                        setChecked={setChecked}
                        color={green}
                      />
                    </Paper>
                  </Grid>
                )}

                {active?.includes("5") && (
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: alpha(blue[50], 0.3),
                      }}
                    >
                      <Typography variant="subtitle1" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateRange sx={{ mr: 1 }} fontSize="small" />
                        {t("نطاق التاريخ")}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ mb: 3 }}>
                          <CustomDatePicker
                            label="من"
                            value={selectDate.from}
                            setValue={(date) =>
                              setSelectDate((prev) => ({ ...prev, from: date }))
                            }
                          />
                        </Box>
                        <Box>
                          <CustomDatePicker
                            label="الى"
                            value={selectDate.to}
                            setValue={(date) =>
                              setSelectDate((prev) => ({ ...prev, to: date }))
                            }
                          />
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const renderFormActions = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: 2,
        p: 2,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
      }}
    >
      <Tooltip title={t("تنزيل التقارير")} arrow>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 'bold',
            borderRadius: 2,
            px: 3,
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Download fontSize="small" />
          {t("تنزيل التقارير")}
        </Button>
      </Tooltip>

      {hasData && (
        <DisplayInformationComponent
          includes={includes}
          usersData={userData}
          ministriesData={ministries}
          materialsData={materialData}
          mainClassesData={mainClassesDataAndSubClass}
          materialsBookedData={materialsBookedData}
          materialOfDataWithinGivenData={materialOfDataWithinGivenData}
          informationMaterial={informationMaterial}
          informationUser={informationUser}
          dateForm={dateFrom}
          dateTo={dateTo}
        />
      )}

      <Tooltip title={t("close")} arrow>
        <BottomRoot
          onClick={() => setOpen(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: 2,
            px: 3,
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.light, 0.1),
              color: theme.palette.error.main
            }
          }}
        >
          <Close fontSize="small" />
          {t("close")}
        </BottomRoot>
      </Tooltip>
    </Box>
  );

  return (
    <div>
      {loading && <Loader />}
      <Tooltip title={t("التقرير")} arrow placement="top">
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 'bold',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }
          }}
        >
          <Description fontSize="small" />
          {t("التقرير")}
        </Button>
      </Tooltip>

      <PopupForm
        title={
          <Typography variant="h5" fontWeight="bold" color="primary">
            {t("dashboard.DownloadReport")}
          </Typography>
        }
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
