import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  ArrowBack,
  Search,
  CheckCircle,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

import { BackendUrl } from "../../../../redux/api/axios";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { getToken } from "../../../../utils/handelCookie";
import {
  BottomRoot,
  ColorLink,
  ButtonClearState,
} from "../../../../style/ButtomStyle";
import RefreshButtonData from "../../../../components/reusableComponent/RefreshButton";
import Loader from "../../../../components/reusableComponent/Loader";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";

const Permission = (props) => {
  const { id } = useParams();
  const GroupId = props?.GroupId || "";
  const theme = useTheme();
  const { t } = useTranslation();
  const { rtl } = useSelector((state) => state?.language);
  const { roles, applicationPermission } = useSelector(
    (state) => state.RolesData
  );

  // State Management
  const [permissionData, setPermissionData] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [dataRoleAndPermission, setDataRoleAndPermission] = useState({});
  const [dataRoleAndPermissionGroup, setDataRoleAndPermissionGroup] = useState(
    {}
  );
  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // API Calls
  const getDataPermission = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${BackendUrl}/api/getAllPermissions`,
        {
          params: {
            checkPermissionUser: roles?.management_permission?._id,
            applicationPermission:
              applicationPermission?.materialObsolete?._id,
          },
          headers: {
            authorization: getToken(),
          },
        }
      );
      setPermissionData(response?.data || []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error(t("Failed to fetch permissions"));
      setPermissionData([]);
    } finally {
      setLoading(false);
    }
  }, [
    roles?.management_permission?._id,
    applicationPermission?.materialObsolete?._id,
    t,
  ]);

  const getDataPermissionAndRole = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${BackendUrl}/api/getDataRoleIdAndPermission`,
        {
          params: { id },
          headers: {
            authorization: getToken(),
          },
        }
      );

      const responseData = response?.data?.response;
      setDataRoleAndPermission(responseData || {});

      try {
        const permissionIds = JSON.parse(
          responseData?.permission_id || "[]"
        );
        setSelectionModel(Array.isArray(permissionIds) ? permissionIds : []);
      } catch (parseError) {
        console.error("Error parsing permission_id:", parseError);
        setSelectionModel([]);
      }
    } catch (error) {
      console.error("Error fetching role and permission data:", error);
      toast.error(t("Failed to fetch role permissions"));
      setSelectionModel([]);
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  const getDataPermissionAndRoleGroup = useCallback(async () => {
    if (!GroupId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${BackendUrl}/api/getDataRoleIdAndPermissionIduseGrouID/${GroupId}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      const responseData = response?.data?.response;
      setDataRoleAndPermissionGroup(responseData || {});

      try {
        const permissionIds = JSON.parse(
          responseData?.permission_id || "[]"
        );
        setSelectionModel(Array.isArray(permissionIds) ? permissionIds : []);
      } catch (parseError) {
        console.error("Error parsing permission_id:", parseError);
        setSelectionModel([]);
      }
    } catch (error) {
      console.error("Error fetching group role and permission data:", error);
      toast.error(t("Failed to fetch group permissions"));
      setSelectionModel([]);
    } finally {
      setLoading(false);
    }
  }, [GroupId, t]);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      await getDataPermission();

      if (props?.label === "setPermissionToGroup") {
        await getDataPermissionAndRoleGroup();
      } else {
        await getDataPermissionAndRole();
      }
    };

    fetchData();
  }, [
    getDataPermission,
    getDataPermissionAndRole,
    getDataPermissionAndRoleGroup,
    props?.label,
    refreshButton,
  ]);

  // Filter permissions based on search
  const filteredPermissions = permissionData.filter((item) =>
    item?.permission_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleCheckboxChange = (permissionId) => {
    setSelectionModel((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectionModel([]);
    } else {
      const allIds = filteredPermissions.map((item) => item?.id || item?._id);
      setSelectionModel(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSetDataPermission = async () => {
    if (!selectionModel || selectionModel.length === 0) {
      toast.warning(t("Please select at least one permission"));
      return;
    }

    try {
      setLoading(true);
      const roleIdPermission = dataRoleAndPermission?.permissions_group_id;

      const response = await axiosInstance.post(
        `${BackendUrl}/api/setPermissionAndRole`,
        {
          selectionModel,
          userId: id,
          roleIdPermission,
        },
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      toast.success(
        response?.data?.message || t("Permissions saved successfully")
      );
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error(
        error?.response?.data?.message || t("Failed to save permissions")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetPermissionGroup = async () => {
    if (!selectionModel || selectionModel.length === 0) {
      toast.warning(t("Please select at least one permission"));
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success ms-3",
        cancelButton: "btn btn-danger",
        popup: "custom-swal-popup",
      },
      buttonsStyling: false,
    });

    try {
      const result = await swalWithBootstrapButtons.fire({
        title: "هل أنت متأكد من التحديث؟",
        text: "سوف يتم إعادة ضبط جميع المستخدمين الذين يملكون هذه الصفة بما فيهم المستخدمين الذين تم منحهم صلاحيات إضافية!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "موافق",
        cancelButtonText: "لا، تراجع!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        setLoading(true);
        const roleIdPermissionGroup =
          dataRoleAndPermissionGroup?.group_id || null;

        await axiosInstance.post(
          `${BackendUrl}/api/setPermissionAndRoleToEachGroup`,
          {
            selectionModel,
            GroupId,
            roleIdPermissionGroup,
          },
          {
            headers: {
              authorization: getToken(),
            },
          }
        );

        swalWithBootstrapButtons.fire({
          title: "تم التحديث!",
          text: "تم تحديث المجموعة بنجاح",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "تم التراجع",
          text: "لم يتم إجراء أي تغييرات",
          icon: "info",
        });
      }
    } catch (error) {
      console.error("Error updating group permissions:", error);
      toast.error(
        error?.response?.data?.message ||
        t("Failed to update group permissions")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ marginLeft: "20px", marginRight: "20px" }}>
      {loading && <Loader />}

      <div dir={rtl?.dir}>
        <HeaderCenter
          title={
            props?.label === "setPermissionToGroup"
              ? t("titlePermissionGroup")
              : t("titlePermission")
          }
          typeHeader={"h4"}
        />
      </div>

      <div className="d-flex gap-4 justify-content-between mb-2">
        <BottomRoot onClick={() => window.history.back()}>
          <ArrowBack />
          {t("layout.Back")}
        </BottomRoot>

        {props?.label === "setPermissionToGroup" ? (
          <ButtonClearState onClick={handleSetPermissionGroup}>
            {t("saveChange")}
          </ButtonClearState>
        ) : (
          <ColorLink onClick={handleSetDataPermission}>
            {t("saveChange")}
          </ColorLink>
        )}

        <RefreshButtonData setRefreshButton={setRefreshButton} />
      </div>

      {/* Search and Select All */}
      <Paper sx={{ p: 3, mb: 3 }} dir={rtl?.dir}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              placeholder={t("Search permissions...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<CheckCircle />}
                  />
                }
                label={t("Select All")}
              />
              <Chip
                label={`${t("Selected")}: ${selectionModel.length} / ${filteredPermissions.length}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Permissions Cards */}
      <Grid container spacing={2}>
        {filteredPermissions.map((item, index) => {
          const permissionId = item?.id || item?._id;
          const isSelected = selectionModel.includes(permissionId);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={permissionId}>
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderLeft: 4,
                  borderColor: isSelected ? "primary.main" : "transparent",
                  backgroundColor: isSelected
                    ? theme.palette.mode === "dark"
                      ? "rgba(25, 118, 210, 0.08)"
                      : "rgba(25, 118, 210, 0.04)"
                    : "background.paper",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => handleCheckboxChange(permissionId)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(permissionId)}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<CheckCircle />}
                      sx={{ mt: -1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        #{index + 1}
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {item?.permission_name || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {!loading && filteredPermissions.length === 0 && (
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm
              ? t("No permissions found")
              : t("No permissions available")}
          </Typography>
          {searchTerm && (
            <Typography variant="body2" color="text.secondary">
              {t("Try adjusting your search")}
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Permission;