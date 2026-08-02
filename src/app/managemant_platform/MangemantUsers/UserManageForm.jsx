// Core imports
import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";

// MUI Components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
// Icons
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import ModeEditOutlined from "@mui/icons-material/ModeEditOutlined";
import Person from "@mui/icons-material/Person";

import { GridCloseIcon } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";

// Custom Components
import Header from "../../../components/reusableComponent/HeaderComponent";
import Loader from "../../../components/reusableComponent/Loader";

// Utils and Config
import { BackendUrl } from "../../../redux/api/axios";
import { getToken } from "../../../utils/handelCookie";
import { ButtonTheme } from "../../../style/ButtomStyle";
import useLanguageRtl from "../../../hooks/genaral/useLanguageRtl";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UserMangeForm({
  editInfo,
  DataUsers,
  setRefreshButton,
  Ministries,
  Entities,
  DataGovernorate,
  DataJobTitle,
  dataGroup,
  DataApplicationPermission,
}) {
  const { t } = useTranslation("");
  const theme = useTheme();
  const token = getToken();

  // Redux Selectors
  const { rtl } = useLanguageRtl();
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const { roles } = useSelector((state) => state.RolesData);

  // State Management
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [active, setIsActive] = useState([]);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [ministriesId, setMinistriesId] = useState("");
  const [entitiesId, setEntitiesId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [Address_id, setAddress_id] = useState("");
  const [jopTitle, setJopTitle] = useState("");

  useEffect(() => {
    if (editInfo) {

      setName(DataUsers?.user_name);
      setEmail(DataUsers?.email);
      setPhone(DataUsers?.phone_number);
      setMinistriesId(DataUsers?.ministry_id);
      setEntitiesId(DataUsers?.entity_id);
      setRoleId(DataUsers?.role_id);
      setAddress_id(DataUsers?.governorate_id);
      setJopTitle(DataUsers?.job_id);
      setPassword("");
      setIsActive(DataUsers?.permissions?.map((item) => item?.permission_id));

      if (DataUsers?.application_permission) {
        setIsActive(DataUsers?.application_permission);
      }
    }
  }, [editInfo, DataUsers, Ministries, Entities, dataGroup, DataGovernorate, DataJobTitle]);

  useEffect(() => {
    if (ministriesId) {
      const filteredData = Entities?.filter(
        (item) => item?.ministries_id === ministriesId
      );
      setFilterData(filteredData);
    }
  }, [ministriesId, Entities]);

  // Handlers
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCheckboxChange = (id) => () => {
    setIsActive((prev = []) => {
      return prev.includes(id) ? prev?.filter((item) => item !== id) : [...prev, id];
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("ministries_id", ministriesId);
      formData.append("entities_id", entitiesId);
      formData.append("roleId", roleId);
      formData.append("address_id", Address_id);
      formData.append("jopTitle", jopTitle);
      formData.append("application_permission", JSON.stringify(active));
      formData.append("checkPermissionUser", roles?.show_all_data_users?._id);

      const response = await axios.post(`${BackendUrl}/api/registerUser`, formData, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        resetForm();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("ministries_id", ministriesId);
      formData.append("entities_id", entitiesId);
      formData.append("roleId", roleId);
      formData.append("address_id", Address_id);
      formData.append("jopTitle", jopTitle);
      formData.append("application_permission", JSON.stringify(active));
      formData.append("dataId", DataUsers?.user_id);

      const response = await axios.post(
        `${BackendUrl}/api/userManagementEdit`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      if (response) {
        toast.success(response?.data?.message);
        setRefreshButton((prev) => !prev);
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setMinistriesId("");
    setEntitiesId("");
    setRoleId("");
    setAddress_id("");
    setJopTitle("");
    setIsActive([]);
  };

  return (
    <React.Fragment>
      {isLoading && <Loader />}

      {editInfo ? (
        <MenuItem onClick={handleClickOpen} disableRipple>
          <ModeEditOutlined sx={{ color: theme.palette.primary.main, fontSize: "20px", mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t("edit")}
          </Typography>
        </MenuItem>
      ) : (
        <ButtonTheme onClick={handleClickOpen} disableRipple>
          <Add sx={{ mr: 1 }} /> {t("userManager.Add new user")}
        </ButtonTheme>
      )}

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          // sx: {
          //   bgcolor: theme.palette.mode === "dark" ? maintheme.lightblack : maintheme.paperColor,
          // }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AppBar sx={{ position: "relative", bgcolor: maintheme?.iconColor }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose}>
                <GridCloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                {editInfo ? t("userManager.Edit user information") : t("userManager.Add new user")}
              </Typography>
              {editInfo ? (
                <Button
                  color="inherit"
                  onClick={handleEdit}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Edit />}
                >
                  {t("saveChange")}
                </Button>
              ) : (
                <Button
                  color="inherit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                >
                  {t("save")}
                </Button>
              )}
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 3 }} dir={rtl?.dir}>
            <Paper
              sx={{
                p: 3,
                bgcolor: theme.palette.mode === "dark" ? maintheme.lightblack : maintheme.paperColor,
                maxWidth: 1200,
                mx: "auto",
              }}
            >
              <Header
                title={editInfo ? t("userManager.Edit user information") : t("userManager.Add new user")}
                dir={rtl?.dir}
              />

              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Personal Information */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={t("userManager.Username")}
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label={t("userManager.Email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label={t("userManager.Password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      required={!editInfo}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label={t("userManager.Phone number")}
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          setPhone(value);
                        }
                      }}
                      required
                      error={phone.length > 0 && phone.length !== 11}
                      helperText={
                        phone.length > 0 && phone.length !== 11
                          ? `رقم الهاتف يجب أن يتكون من 11 رقم (${phone.length}/11)`
                          : ''
                      }
                      inputProps={{
                        maxLength: 11
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Organization Information */}
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label={t("userManager.Ministry name")}
                      value={ministriesId || ""}
                      onChange={(e) => {
                        setMinistriesId(e.target.value);
                      }}
                      required
                    >
                      {Ministries?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.ministries}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label={t("userManager.Entity name")}
                      value={entitiesId}
                      onChange={(e) => {
                        setEntitiesId(e.target.value);
                      }}
                      required
                    >
                      {filterData?.map((option) => (
                        <MenuItem key={option?.entities_id} value={option?.entities_id}>
                          {option?.Entities_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label={t("userManager.Choosing user role")}
                      value={roleId}
                      onChange={(e) => {
                        setRoleId(e.target.value);
                      }}
                      required
                    >
                      {dataGroup?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.group_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      select
                      label={t("userManager.Entity address")}
                      value={Address_id}
                      onChange={(e) => {
                        setAddress_id(e.target.value);
                      }}
                    >
                      {DataGovernorate?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.governorate_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      select
                      label={t("userManager.Job title")}
                      value={jopTitle}
                      onChange={(e) => {
                        setJopTitle(e.target.value);
                      }}
                    >
                      {DataJobTitle?.map((option) => (
                        <MenuItem key={option?.id} value={option?.id}>
                          {option?.job_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                {/* Application Permissions */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {t("userManager.Application permissions")}
                  </Typography>

                  <FormGroup>
                    <Grid container spacing={1}>
                      {DataApplicationPermission?.map((item) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item?.id}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={active?.includes(item?.id)}
                                onChange={handleCheckboxChange(item?.id)}
                              />
                            }
                            label={<Typography variant="body2">{item?.name_applications}</Typography>}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <ButtonTheme
                    variant="contained"
                    onClick={editInfo ? handleEdit : handleSubmit}
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : editInfo ? <Edit /> : <SaveIcon />}
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
            </Paper>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default UserMangeForm;