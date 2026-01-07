import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "../../../hooks/useApi.jsx";
import usePermissionUser from "../../../hooks/usePermissionUser";
import useManagementUsersList from "../../../hooks/useManagementUsersList.jsx";
import { Box } from "@mui/material";
import Header from "../../../components/reusableComponent/HeaderComponent.jsx";
import UserMangeForm from "./UserManageForm.jsx";
import FilterDataUser from "../../../components/filter/filterUser";
import UseFullScreen from "../../../hooks/useFullScreen.jsx";
import { Loader } from "lucide-react";
import RefreshButtonData from "../../../components/reusableComponent/RefreshButton.jsx";
import layoutStyle from "../../../style/layoutStyle";
import GridTemplate from "../../../components/reusableComponent/GridTemplet.jsx";

function UserManagementAllUsers() {
  const { t } = useTranslation();

  /** ------------------- STATES ------------------- */
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataUser, setDataUser] = useState([]);
  const [deleteItem, setDelete] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  /** ------------------- PERMISSION HOOK ------------------- */
  const {
    roles,
    applicationPermission,
    rtl,
    Ministries,
    Entities,
    permissionData,
  } = usePermissionUser();

  /** ------------------- API ------------------- */
  const { loading: apiLoading, fetchData } = useApi();

  /** ------------------- FETCH USERS ------------------- */

  const fetchDataByProjectId = useCallback(async () => {
    try {
      await fetchData({
        endpoint: "/api/getDataUserManage",
        method: "GET",
        params: {
          page,
          limit,
          checkPermissionUser: roles?.show_all_data_users?._id,
          applicationPermission: applicationPermission?.materialObsolete?._id,
        },
        onSuccess: (data) => {
          setDataUser(data?.response || []);
          setTotalPages(data?.pagination?.totalPages || 0);
          setTotalItems(data?.pagination?.totalItems || 0);
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [
    fetchData,
    page,
    limit,
    roles?.show_all_data_users?._id,
    applicationPermission?.materialObsolete?._id,
  ]);

  useEffect(() => {
    fetchDataByProjectId();
  }, [fetchDataByProjectId, refreshButton, deleteItem, page, limit]);

  /** ------------------- USER LIST HOOK ------------------- */

  const {
    DataGovernorate,
    DataJobTitle,
    dataGroup,
    setFilterDataUser,
    userColumns,
    rows,
    DataApplicationPermission,
  } = useManagementUsersList({
    dataUser,
    setRefreshButton,
    setDelete,
    pathLink: "Permission",
    Ministries,
    Entities,
    roles,
    applicationPermission,
    rtl,
    permissionData,
  });

  /** ------------------- RENDER ------------------- */

  return (
    <div>
      {apiLoading && <Loader />}
      <Box dir={rtl?.dir} sx={{ ...layoutStyle }}>

        {/* Header */}
        <Box sx={{ display: "flex" }}>
          <Header
            title={t("userManager.Authorized personnel information management")}
            dir={rtl?.dir}
          />
        </Box>

        {/* Top Controls */}
        <Box sx={{ mb: 1, display: "flex", gap: "5px" }}>
          <UserMangeForm
            editInfo={false}
            Entities={Entities}
            Ministries={Ministries}
            DataGovernorate={DataGovernorate}
            DataJobTitle={DataJobTitle}
            dataGroup={dataGroup}
            setRefreshButton={setRefreshButton}
            DataApplicationPermission={DataApplicationPermission}
            applicationPermission={applicationPermission}
            roles={roles}
          />

          <FilterDataUser
            setFilterDataUser={setFilterDataUser}
            page={page}
            limit={limit}
            totalItems={totalItems}
            totalPages={totalPages}
            setRefreshButton={setRefreshButton}
          />

          <UseFullScreen
            setRefreshButton={setRefreshButton}
            refreshing={refreshButton}
          />
        </Box>

        {/* Table */}
        <GridTemplate
          rows={rows}
          columns={userColumns}
          setPage={setPage}
          page={page}
          limit={limit}
          setLimit={setLimit}
          totalItems={totalItems}
          totalPages={totalPages}
          btn={<RefreshButtonData onClick={setRefreshButton} />}
        />
      </Box>
    </div>
  );
}

export default UserManagementAllUsers;
