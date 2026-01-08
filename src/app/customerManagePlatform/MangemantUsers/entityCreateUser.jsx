// Core imports
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

// MUI Components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import ModeEditOutlined from "@mui/icons-material/ModeEditOutlined";
import Person from "@mui/icons-material/Person";
import Phone from "@mui/icons-material/Phone";
import Work from "@mui/icons-material/Work";
import SaveIcon from "@mui/icons-material/Save";
import { GridCloseIcon } from "@mui/x-data-grid";

// Custom Components
import CustomeSelectField from "../../../components/reusableComponent/CustomeSelectField";
import CustomTextField from "../../../components/reusableComponent/CustomTextField";
import Header from "../../../components/reusableComponent/HeaderComponent";
import Loader from "../../../components/reusableComponent/Loader";

// Utils and Config
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "../../../utils/handelCookie";
import { ButtonTheme } from "../../../style/ButtomStyle";
import { useWarehouseBaseTheRoleAndPermission } from "../../../hooks/useWarehouseBaseTheRoleAndPermission";
import { usePermissionsStructure } from "../../../hooks/useStructureCompany";
import { Autocomplete, TextField } from "@mui/material";

// Constants
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SELECT_WAREHOUSE_TYPES = [
  { label: "مخزن رئيسي", value: "main" },
  { label: "مخزن إنتاجي", value: "production" },
];

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  password: "",
  phone: "",
  roleId: "",
  address_id: "",
  jopTitle: "",
  lab_id: "",
  factory_id: "",
  warehouseType: "",
  isMainWarehouseUser: false,
  isEntityRegisterUser: true,
};

function EntityCreateUser({
  editInfo,
  DataUsers,
  setRefreshButton,
  DataGovernorate,
  DataJobTitle,
  dataGroup,
  roles,
  rtl = "rtl",
  dataUserById,
  applicationPermission,
}) {
  const { t } = useTranslation("");
  const theme = useTheme();
  const token = useMemo(() => getToken(), []);

  // State Management
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [active, setIsActive] = useState([
    applicationPermission?.warehouseSystem?._id,
  ]);

  const { labData, factoryData } = useWarehouseBaseTheRoleAndPermission();
  const { has_lab, has_factory, has_main_warehouse } =
    usePermissionsStructure();

  // Memoized helper function
  const findItemById = useCallback((list, id, key = "id") => {
    return list?.find((item) => item[key] === id) || "";
  }, []);

  // Initialize form data when editing
  useEffect(() => {
    if (!editInfo || !DataUsers) return;

    const newFormData = {
      name: DataUsers.user_name || "",
      email: DataUsers.email || "",
      password: "",
      phone: DataUsers.phone_number || "",
      roleId: DataUsers.group_id || "",
      address_id: DataUsers.address_id || "",
      // Find job title object by id, or use the string value if not found
      jopTitle: DataJobTitle?.find(j => j.id === DataUsers.job_title_id)
        || DataUsers.job_title_name
        || "",
      lab_id: DataUsers.lab_id || "",
      factory_id: DataUsers.factory_id || "",
      warehouseType: DataUsers.warehouse_type,
      isMainWarehouseUser: DataUsers.is_main_warehouse_user || false,
      isEntityRegisterUser: true,
    };

    setFormData(newFormData);

    if (DataUsers.application_permission) {
      setIsActive(DataUsers.application_permission);
    }
  }, [
    editInfo,
    DataUsers,
    dataGroup,
    DataGovernorate,
    DataJobTitle,
    labData,
    factoryData,
    findItemById,
  ]);

  // Handlers
  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const jobTitleValue =
      typeof formData.jopTitle === "string"
        ? formData.jopTitle.trim()
        : formData.jopTitle?.id;

    if (!jobTitleValue) {
      toast.error("Please select or enter a job title");
      return false;
    }

    return true;
  }, [formData.jopTitle, formData.warehouseType, editInfo]);

  const buildFormData = useCallback(() => {
    const data = new FormData();
    const jobTitleValue =
      typeof formData.jopTitle === "string"
        ? formData.jopTitle
        : formData.jopTitle?.id;

    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone", formData.phone);
    data.append("jopTitle", jobTitleValue);
    data.append("application_permission", JSON.stringify(active));
    data.append("isEntityRegisterUser", formData.isEntityRegisterUser);

    // Add lab_id if applicable
    if (!formData.isMainWarehouseUser && has_lab && formData.lab_id) {
      data.append("lab_id", formData.lab_id);
    }

    // Add factory_id if applicable
    if (
      !formData.isMainWarehouseUser &&
      has_factory &&
      formData.factory_id
    ) {
      data.append("factory_id", formData.factory_id);
    }

    // Add warehouse type if applicable
    if (formData.warehouseType && has_main_warehouse) {
      data.append("warehouseType", formData.warehouseType);
    }

    return data;
  }, [formData, active, has_lab, has_factory, has_main_warehouse]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const data = buildFormData();
        data.append("ministries_id", dataUserById?.minister_id);
        data.append("entities_id", dataUserById?.entity_id);
        data.append("roleId", 13);
        data.append("address_id", dataUserById?.address_id);
        data.append("checkPermissionUser", roles?.show_all_data_users?._id);

        const response = await axios.post(
          `${BackendUrl}/api/registerUser`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
          }
        );

        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        setFormData(INITIAL_FORM_STATE);
        setIsActive([]);
        handleClose();
      } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [
      validateForm,
      buildFormData,
      dataUserById,
      roles,
      token,
      setRefreshButton,
      handleClose,
    ]
  );

  const handleEdit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = buildFormData();
      data.append("dataId", DataUsers?.user_id);

      const response = await axios.post(
        `${BackendUrl}/api/userManagementEditEntity`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      toast.success(response?.data?.message);
      setRefreshButton((prev) => !prev);
      handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    validateForm,
    buildFormData,
    DataUsers,
    token,
    setRefreshButton,
    handleClose,
  ]);

  // Memoized render components
  const renderTriggerButton = useMemo(() => {
    if (editInfo) {
      return (
        <MenuItem onClick={handleClickOpen} disableRipple>
          <ModeEditOutlined
            sx={{ color: theme.palette.primary.main, fontSize: "20px", mr: 1 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("edit")}
          </Typography>
        </MenuItem>
      );
    }

    return (
      <ButtonTheme onClick={handleClickOpen} disableRipple>
        <Add sx={{ mr: 1 }} /> {t("userManager.Add new user")}
      </ButtonTheme>
    );
  }, [editInfo, handleClickOpen, theme.palette.primary.main, t]);

  return (
    <React.Fragment>
      {isLoading && <Loader />}
      {renderTriggerButton}

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ p: 0 }}>
          <AppBar
            sx={{ position: "relative", bgcolor: theme.palette.primary.main }}
          >
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose}>
                <GridCloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                {editInfo
                  ? t("userManager.Edit user information")
                  : t("userManager.Add new user")}
              </Typography>
              <Button
                color="inherit"
                onClick={editInfo ? handleEdit : handleSubmit}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : editInfo ? (
                    <Edit />
                  ) : (
                    <SaveIcon />
                  )
                }
              >
                {t(editInfo ? "saveChange" : "save")}
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 3 }} dir={rtl?.dir}>
            <Header
              title={
                editInfo
                  ? t("userManager.Edit user information")
                  : t("userManager.Add new user")
              }
              dir={rtl?.dir}
            />

            <Box
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label={t("userManager.Username")}
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                required
              />

              <TextField
                label={t("userManager.Email")}
                value={formData.email}
                onChange={(e) => updateFormField("email", e.target.value)}
                required
              />

              <TextField
                label={t("userManager.Password")}
                value={formData.password}
                onChange={(e) => updateFormField("password", e.target.value)}
                required
                type="password"
              />

              <TextField
                label={t("userManager.Phone number")}
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 11) {
                    updateFormField("phone", value);
                  }
                }}
                required
                error={formData.phone.length > 0 && formData.phone.length !== 11}
                helperText={
                  formData.phone.length > 0 && formData.phone.length !== 11
                    ? `رقم الهاتف يجب أن يتكون من 11 رقم (${formData.phone.length}/11)`
                    : ''
                }
                inputProps={{
                  maxLength: 11
                }}
              />
              <Autocomplete
                freeSolo
                options={DataJobTitle || []}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.job_name || ""
                }
                value={formData.jopTitle || ""}
                onChange={(event, newValue) => {
                  // When selecting from dropdown (object) or clearing
                  updateFormField("jopTitle", newValue);
                }}
                onInputChange={(event, newInputValue, reason) => {
                  // When typing custom text (freeSolo)
                  if (reason === "input") {
                    updateFormField("jopTitle", newInputValue);
                  }
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!value) return false;
                  if (typeof value === "string") return option?.job_name === value;
                  return option?.id === value?.id;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("userManager.Job title")}
                    required
                    helperText="اختر من القائمة أو اكتب عنوان وظيفي جديد"
                  />
                )}
              />

              {has_main_warehouse ? (
                <TextField
                  fullWidth
                  select
                  label={t("اختر نوع المخزن")}
                  value={formData.warehouseType}
                  onChange={(e) =>
                    updateFormField("warehouseType", e.target.value)
                  }
                >
                  {SELECT_WAREHOUSE_TYPES?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {has_lab && !formData.isMainWarehouseUser ? (
                <TextField
                  fullWidth
                  select
                  label={t("اختر المعمل")}
                  value={formData.lab_id}
                  onChange={(e) =>
                    updateFormField("lab_id", e.target.value)
                  }
                >
                  {labData?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.Laboratory_name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              {has_factory && !formData.isMainWarehouseUser ? (
                <TextField
                  fullWidth
                  select
                  label={t("اختر المصنع")}
                  value={formData.factory_id}
                  onChange={(e) =>
                    updateFormField("factory_id", e.target.value)
                  }
                >
                  {factoryData?.map((option) => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option?.Factories_name}
                    </MenuItem>
                  ))}
                </TextField>
              ) : null}

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <ButtonTheme
                  onClick={editInfo ? handleEdit : handleSubmit}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} />
                    ) : editInfo ? (
                      <Edit />
                    ) : (
                      <SaveIcon />
                    )
                  }
                  sx={{ flex: 1 }}
                >
                  {t(editInfo ? "saveChange" : "save")}
                </ButtonTheme>

                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isLoading}
                  sx={{ flex: 1 }}
                >
                  {t("close")}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(EntityCreateUser);
