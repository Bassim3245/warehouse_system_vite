import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

// Material UI Components
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Fade,
  IconButton,
  MenuItem,
  Paper,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Zoom,
  alpha,
  useTheme,
} from "@mui/material";

// Material UI Icons
import {
  Add,
  CalendarToday,
  Category,
  CheckCircle,
  Description,
  FormatListNumbered,
  Info,
  Inventory,
  Label,
  ModeEditOutlined,
} from "@mui/icons-material";
import { GridCloseIcon } from "@mui/x-data-grid";

// Custom Components
import CustomTextField from "../../../../components/reusableComponent/CustomTextField";
import CustomeSelectField from "../../../../components/reusableComponent/CustomeSelectField";
import CustomDatePicker from "../../../../components/reusableComponent/CustomDatePicker";
import FileUploadComponent from "../../../../components/reusableComponent/FileUplodComponent";
import { BackendUrl } from "../../../../redux/api/axios";
import {
  ButtonTheme,
  BorderLinearProgress,
} from "../../../../style/ButtomStyle";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import "../style.css";

// Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FromIsDeleted({
  label,
  DataProject,
  setRefreshButton,
  token,
  dataUserById,
  Ministries,
  Entities,
  stateMaterial,
  rtl,
  dataMainClass,
  dataSubClass,
  dataUnitMeasuring,
}) {
  const theme = useTheme();
  const [filterDatSuClass, setFltter] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [nameMartials, setNameMartials] = useState(""),
    [status_martials, setStatus_martials] = useState(""),
    [measuring_unit, setMeasuring_unit] = useState(""),
    [fileName, setFileName] = useState([]),
    [Entities_id, setEntities_id] = useState(""),
    [ministry_id, setMinister_id] = useState(""),
    [Quantity, setQuantity] = useState(""),
    [price_materials, setPrice_martials] = useState(""),
    [main_class, setMain_class] = useState(""),
    [sub_class, setSub_class] = useState(""),
    [description, setDescription] = useState(""),
    [typMartials, setTypMartials] = useState(""),
    [purchaseDate, setPurchaseDate] = useState(dayjs()),
    [removeFile, setRemoveFile] = useState([]);
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Material types array
  const typeMaterilAarry = useMemo(
    () => ["مادة راكدة", "مادة بطيئة الحركة"],
    []
  );
  useEffect(() => {
    let inputs = [
      nameMartials,
      status_martials,
      measuring_unit,
      fileName,
      main_class,
      sub_class,
      price_materials,
      Quantity,
      typMartials,
    ];
    let nonEmptyCount = inputs.reduce((count, input) => {
      return count + (input ? 1 : 0);
    }, 0);

    setValue(nonEmptyCount * 11.11);
  }, [
    nameMartials,
    status_martials,
    measuring_unit,
    Entities_id,
    fileName,
    ministry_id,
    main_class,
    sub_class,
    price_materials,
    Quantity,
    typMartials,
  ]);
  const handleEditFunction = (dateString) => {
    // Convert the received date string to a Day.js object
    const parsedDate = dayjs(dateString);

    // Check if it's a valid date before setting the state
    if (parsedDate.isValid()) {
      setPurchaseDate(parsedDate);
    } else {
      console.log("sdfdsfdsfds==>failed");
    }
  };

  useEffect(() => {
    if (label === "EditData") {
      setNameMartials(DataProject?.name_material);
      setStatus_martials(DataProject?.status_material);
      setMeasuring_unit(DataProject?.measuring_unit);
      setFileName(DataProject?.images);
      // setOldFileName(DataProject?.images);
      setEntities_id(DataProject?.Entities_id);
      setQuantity(DataProject?.Quantity);
      setPrice_martials(DataProject?.price_material);
      setDescription(DataProject?.description);
      // setPurchaseDate(tempDate?(new Date(tempDate)):null);
      handleEditFunction(DataProject?.puchase_date);
      if (Ministries?.length && DataProject?.ministry_id) {
        let findItem = Ministries?.find(
          (item) => item?.id === DataProject?.ministry_id
        );
        if (findItem) setMinister_id(findItem);
      }
      if (Entities?.length && DataProject?.Entities_id) {
        let findItem = Entities?.find(
          (item) => item?.id === DataProject?.Entities_id
        );
        if (findItem) setEntities_id(findItem);
      }
      if (dataMainClass?.length && DataProject?.mainClass_id) {
        let findItem = dataMainClass?.find(
          (item) => item?.mainClass_id === DataProject?.mainClass_id
        );
        if (findItem) setMain_class(findItem);
      }
      if (dataSubClass?.length && DataProject?.subClass_id) {
        let findItem = dataSubClass?.find(
          (item) => item?.subClass_id === DataProject?.subClass_id
        );
        if (findItem) setSub_class(findItem);
      }
      if (stateMaterial?.length && DataProject?.status_id) {
        let findItem = stateMaterial?.find(
          (item) => item?.id === DataProject?.status_id
        );
        if (findItem) setStatus_martials(findItem);
      }
      if (dataUnitMeasuring?.length && DataProject?.measuring_unit_id > 0) {
        let findItem = dataUnitMeasuring?.find(
          (item) => item?.unit_id === DataProject?.measuring_unit_id
        );
        if (findItem) setMeasuring_unit(findItem);
      }
      if (typeMaterilAarry?.length && DataProject?.typ_material > 0) {
        let findItem = typeMaterilAarry?.find(
          (item) => item === DataProject?.typ_material
        );
        if (findItem) typMartials(findItem);
      }
      if (typeMaterilAarry?.length && DataProject?.typ_material) {
        let findItem = typeMaterilAarry?.find(
          (item) => item === DataProject?.typ_material
        );
        if (findItem) setTypMartials(findItem); // Use setTypMartials to update the selected value
      }
    }
  }, [
    DataProject,
    Entities,
    Ministries,
    dataMainClass,
    dataSubClass,
    dataUnitMeasuring,
    label,
    stateMaterial,
    typeMaterilAarry,
    typMartials,
  ]);
  const HandleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("nameMartials", nameMartials);
      formData.append("status_martials", status_martials?.id);
      formData.append("measuring_unit", measuring_unit?.unit_id);
      formData.append("ministry_id", dataUserById?.minister_id);
      formData.append("Entities_id", dataUserById?.entity_id);
      // formData.append("price_material", price_materials);
      formData.append("Quantity", Quantity);
      formData.append("sub_class", sub_class?.subClass_id || "");
      formData.append("main_class", main_class?.mainClass_id || "");
      formData.append("user_id", dataUserById?.user_id);
      formData.append("typMartials", typMartials);
      formData.append("description", description);
      formData.append("purchaseDate", purchaseDate);
      fileName.forEach((file) => {
        formData.append("files", file);
      });
      const response = await axios.post(
        `${BackendUrl}/api/stagnantMartialsRegister`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `${token}`,
          },
        }
      );
      if (response) {
        toast.success(response?.data?.message);
        setQuantity("");
        setEntities_id("");
        setMain_class("");
        setNameMartials("");
        setPrice_martials("");
        setStatus_martials("");
        setSub_class("");
        setMeasuring_unit("");
        setMinister_id("");
        setTypMartials(" ");
        setFileName([]);
        setDescription("");
        setOpen(false);
        setRefreshButton((prv) => !prv);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("nameMartials", nameMartials);
      formData.append("status_martials", status_martials?.id);
      formData.append("removeFile", JSON.stringify(removeFile));
      fileName.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("measuring_unit", measuring_unit?.unit_id);
      formData.append("ministry_id", dataUserById?.minister_id);
      formData.append("Entities_id", dataUserById?.entity_id);
      // formData.append("price_material", price_materials);
      formData.append("Quantity", Quantity);
      formData.append("typMartials", typMartials);
      formData.append("sub_class", sub_class?.subClass_id || "");
      formData.append("main_class", main_class?.mainClass_id || "");
      formData.append("FileName", DataProject?.fileName || "");
      formData.append("description", description);
      formData.append("id", DataProject?.stagnant_id);
      const response = await axios.post(
        `${BackendUrl}/api/stagnantMaterialsEdit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );
      if (response) {
        setRefreshButton((prv) => !prv);
        toast.success(response?.data?.message);
        setOpen(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        // toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const dataFilter = dataSubClass?.filter((item) => {
      return item?.mainClass_id === main_class?.mainClass_id;
    });
    setFltter(dataFilter);
  }, [main_class, dataMainClass, dataSubClass]);

  return (
    <React.Fragment>
      {label === "EditData" ? (
        <MenuItem onClick={handleClickOpen} disableRipple>
          <ModeEditOutlined
            sx={{ color: theme.palette.primary.main, fontSize: "20px", mr: 1 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            تعديل
          </Typography>
        </MenuItem>
      ) : (
        <Zoom in={true}>
          <ButtonTheme
            onClick={handleClickOpen}
            disableRipple
            sx={{
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Add sx={{ mr: 1 }} /> {t("Stagnant.enterNewMaterial")}
          </ButtonTheme>
        </Zoom>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            bgcolor:
              theme.palette.mode === "dark"
                ? theme?.palette?.primary?.lightblack
                : theme?.palette?.primary?.paperColor,
            backgroundImage:
              theme.palette.mode === "dark"
                ? "linear-gradient(rgba(26, 32, 48, 0.8), rgba(26, 32, 48, 0.8))"
                : "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8))",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0, 0, 0, 0.5)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AppBar
            sx={{
              position: "relative",
              background: `linear-gradient(90deg, ${
                theme.palette.primary.main
              } 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              mb: 2,
            }}
            elevation={3}
          >
            <Toolbar>
              <Tooltip title="إغلاق">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                  sx={{
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "rotate(90deg)" },
                  }}
                >
                  <GridCloseIcon />
                </IconButton>
              </Tooltip>
              <Typography
                sx={{
                  ml: 2,
                  flex: 1,
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                variant="h6"
                component="div"
              >
                {label === "EditData"
                  ? "تعديل معلومات المادة"
                  : "أدخال معلومات مادة جديدة"}
              </Typography>
              {label === "EditData" ? (
                <Button
                  autoFocus
                  color="inherit"
                  onClick={handleEdit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircle />
                    )
                  }
                  sx={{
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  حفظ التعديل
                </Button>
              ) : (
                <Button
                  autoFocus
                  color="inherit"
                  onClick={HandleSubmit}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CheckCircle />
                    )
                  }
                  sx={{
                    borderRadius: "8px",
                    px: 2,
                    py: 1,
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  حفظ
                </Button>
              )}
            </Toolbar>
          </AppBar>
          <div style={{ top: "30px", position: "relative" }} dir={rtl?.dir}>
            <Fade in={true} timeout={800}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  mt: "10px",
                  gap: "20px",
                  px: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <Paper
                  elevation={4}
                  className="boxContainerReportForm p-4 mt-2 mobileWidth"
                  sx={{
                    background: `${
                      theme.palette.mode === "dark"
                        ? theme?.palette?.primary?.lightblack
                        : theme?.palette?.primary?.paperColor
                    } 0% 0% no-repeat padding-box !important`,
                    borderRadius: "16px",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                        : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: "1200px",
                    position: "relative",
                    "&:hover": {
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 12px 40px rgba(0, 0, 0, 0.4)"
                          : "0 12px 40px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Header
                    title={
                      label === "EditData"
                        ? "تعديل معلومات المادة"
                        : "أدخال معلومات مادة جديدة"
                    }
                    dir={rtl?.dir}
                  />

                  <Box sx={{ position: "relative", mb: 3, mt: 2 }}>
                    <BorderLinearProgress
                      variant="determinate"
                      value={value}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          backgroundImage: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Info fontSize="small" />
                        {`${Math.round(value)}% مكتمل`}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3, opacity: 0.6 }} />

                  <Box
                    className="mobilDisplay"
                    sx={{
                      mb: "20px",
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      justifyContent: "center",
                      alignItems: { xs: "stretch", md: "flex-start" },
                      width: "100%",
                      maxWidth: "100%",
                      gap: 3,
                    }}
                  >
                    <Box sx={{ width: "100%", flex: 1 }}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                            <div>
                              <CustomeSelectField
                                label={"أختيار الصنف  الرئيسي "}
                                haswidth={true}
                                value={main_class}
                                hasMultipleLine={true}
                                customPadding={"0px"}
                                list={dataMainClass ? dataMainClass : []}
                                customGetOptionLabel={(option) =>
                                  option?.main_Class_name || ""
                                }
                                multiple={false}
                                required
                                readOnly={false}
                                onChange={(e, newValue) => {
                                  setMain_class(newValue);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setMain_class("");
                                }}
                                startIcon={<Category fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "150ms" }}>
                            <div>
                              <CustomeSelectField
                                label={"أختيار الصنف الخاص بالرئيسي "}
                                haswidth={true}
                                value={sub_class}
                                hasMultipleLine={true}
                                customPadding={"0px"}
                                list={filterDatSuClass ? filterDatSuClass : []}
                                customGetOptionLabel={(option) =>
                                  option?.sub_class_name || ""
                                }
                                multiple={false}
                                required
                                readOnly={false}
                                onChange={(e, newValue) => {
                                  setSub_class(newValue);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setSub_class("");
                                }}
                                startIcon={
                                  <FormatListNumbered fontSize="small" />
                                }
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                            <div>
                              <CustomeSelectField
                                label={"اختيار نوع المادة"}
                                haswidth={true}
                                value={typMartials || ""}
                                hasMultipleLine={true}
                                customPadding={"0px"}
                                list={typeMaterilAarry}
                                customGetOptionLabel={(option) => option || ""}
                                multiple={false}
                                required
                                readOnly={false}
                                onChange={(e, newValue) => {
                                  setTypMartials(newValue);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setTypMartials("");
                                }}
                                startIcon={<Inventory fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "250ms" }}>
                            <div>
                              <CustomTextField
                                label={"أسم المادة حسب الادخال الرسمي"}
                                haswidth={true}
                                value={nameMartials}
                                hasMultipleLine={false}
                                paddingHorizontal={"0px"}
                                required
                                readOnly={false}
                                onChange={(e) => {
                                  setNameMartials(e.target.value);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setNameMartials("");
                                }}
                                startIcon={<Label fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>
                      </Stack>
                    </Box>

                    <Box sx={{ width: "100%", flex: 1 }}>
                      <Stack spacing={2.5}>
                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "300ms" }}>
                            <div>
                              <CustomTextField
                                label={"الكمية"}
                                haswidth={true}
                                value={Quantity}
                                hasMultipleLine={false}
                                paddingHorizontal={"0px"}
                                readOnly={false}
                                onChange={(e) => {
                                  setQuantity(e.target.value);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setQuantity("");
                                }}
                                type="number"
                                startIcon={
                                  <FormatListNumbered fontSize="small" />
                                }
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "350ms" }}>
                            <div>
                              <CustomeSelectField
                                label={"أختيار وحدة المادة"}
                                haswidth={true}
                                value={measuring_unit}
                                hasMultipleLine={true}
                                customPadding={"0px"}
                                list={
                                  dataUnitMeasuring ? dataUnitMeasuring : []
                                }
                                customGetOptionLabel={(option) =>
                                  option?.measuring_unit || ""
                                }
                                multiple={false}
                                required
                                readOnly={false}
                                onChange={(e, newValue) => {
                                  setMeasuring_unit(newValue);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setMeasuring_unit("");
                                }}
                                startIcon={<Inventory fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box>
                          <Zoom in={true} style={{ transitionDelay: "400ms" }}>
                            <div>
                              <CustomeSelectField
                                label={"أختيار  حالة المادة"}
                                haswidth={true}
                                value={status_martials}
                                hasMultipleLine={true}
                                customPadding={"0px"}
                                list={stateMaterial ? stateMaterial : []}
                                customGetOptionLabel={(option) =>
                                  option?.state_name || ""
                                }
                                multiple={false}
                                required
                                readOnly={false}
                                onChange={(e, newValue) => {
                                  setStatus_martials(newValue);
                                  setFormTouched(true);
                                }}
                                onClearClick={() => {
                                  setStatus_martials("");
                                }}
                                startIcon={<Info fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>

                        <Box dir="ltr">
                          <Zoom in={true} style={{ transitionDelay: "450ms" }}>
                            <div>
                              <CustomDatePicker
                                haswidth={true}
                                label={"تاريخ شرائها"}
                                format="YYYY/MM/DD"
                                placeholder="تاريخ الشراء"
                                customWidth="100%"
                                customPadding="0px"
                                paddingHorizontal={"0px"}
                                required={true}
                                value={purchaseDate ? purchaseDate : null}
                                CustomFontSize="12px"
                                borderPosition="right"
                                is_dateTime={false}
                                error={false}
                                textError={""}
                                setValue={(date) => {
                                  setPurchaseDate(date);
                                  setFormTouched(true);
                                }}
                                is_Time={false}
                                minDate={null}
                                maxDate={null}
                                startIcon={<CalendarToday fontSize="small" />}
                              />
                            </div>
                          </Zoom>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>

                  <Box sx={{ width: "100%", mb: "15px" }}>
                    <Zoom in={true} style={{ transitionDelay: "500ms" }}>
                      <div>
                        <CustomTextField
                          label={"ملاحظات حول المادة "}
                          haswidth={true}
                          value={description}
                          hasMultipleLine={true}
                          paddingHorizontal={"0px"}
                          readOnly={false}
                          onChange={(e) => {
                            setDescription(e.target.value);
                            setFormTouched(true);
                          }}
                          onClearClick={() => {
                            setDescription("");
                          }}
                          startIcon={<Description fontSize="small" />}
                          rows={4}
                        />
                      </div>
                    </Zoom>
                  </Box>

                  <Zoom in={true} style={{ transitionDelay: "550ms" }}>
                    {label === "EditData" ? (
                      <ButtonTheme
                        sx={{
                          width: "100%",
                          mt: 2,
                          py: 1.5,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                        onClick={handleEdit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <CheckCircle />
                        )}
                        حفظ التعديل
                      </ButtonTheme>
                    ) : (
                      <ButtonTheme
                        sx={{
                          width: "100%",
                          mt: 2,
                          py: 1.5,
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                        onClick={HandleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <CheckCircle />
                        )}
                        حفظ المعلومات
                      </ButtonTheme>
                    )}
                  </Zoom>
                </Paper>

                <Fade in={true} timeout={1000}>
                  <div
                    className="container"
                    style={{ width: "100%", maxWidth: "1200px" }}
                  >
                    {label === "EditData" ? (
                      <div style={{ position: "relative" }}>
                        <FileUploadComponent
                          fileName={fileName || DataProject?.fileName}
                          setFileName={setFileName}
                          removeFile={removeFile}
                          setRemoveFile={setRemoveFile}
                          label="edit"
                        />
                      </div>
                    ) : (
                      <FileUploadComponent
                        setFileName={setFileName}
                        fileName={fileName}
                        removeFile={removeFile}
                        setRemoveFile={setRemoveFile}
                        label="upload"
                      />
                    )}
                  </div>
                </Fade>
              </Box>
            </Fade>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
export default FromIsDeleted;
