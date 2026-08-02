import { useCallback, useEffect, useState } from "react";
import { getUserInformation } from "../../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import { useApi } from "../../../hooks/useApi";
import useManagementUsersList from "../../../hooks/useManagementUsersList";
import Box from "@mui/material/Box";
import FilterDataUser from "../../../components/filter/filterUser";
import Header from "../../../components/reusableComponent/HeaderComponent";
import layoutStyle from "../../../style/layoutStyle";
import Loader from "../../../components/reusableComponent/Loader";
import EntityCreateUser from "./entityCreateUser";
import UseFullScreen from "../../../hooks/useFullScreen";
import RefreshButtonData from "../../../components/reusableComponent/RefreshButton";
import GridTemplate from "../../../components/reusableComponent/GridTemplet.jsx";
import useUserPermissions from "../../../hooks/genaral/useUserPermissions";
import useLanguageRtl from "../../../hooks/genaral/useLanguageRtl.jsx";
import useMinistries from "../../../hooks/genaral/useMinistries.jsx";
import useEntities from "../../../hooks/genaral/useEntities.jsx";

function UserManagementFromEntities() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataUser, setDataUser] = useState([]);
  const [deleteItem, setDelete] = useState([]); // Updated to match expected type (Array)
  const [totalPages, setTotalPages] = useState(0); // Set initial value to 0 for consistency
  const [totalItems, setTotalItems] = useState(0); // Set initial value to 0 for consistency
  const [refreshButton, setRefreshButton] = useState(false);
  const {
    roles,
    applicationPermission,

    permissionData,
  } = useUserPermissions();
  const { rtl } = useLanguageRtl();
  const { Ministries } = useMinistries();
  const { Entities } = useEntities();
  const dataUserById = getUserInformation();
  const { t } = useTranslation();
  const { loading: apiLoading, fetchData } = useApi(); // Using the new API hook
  const fetchDataByProjectId = useCallback(async () => {
    try {
      const response = await fetchData({
        endpoint: "/api/getDataUserManageByIdEntities",
        method: "GET",
        params: {
          page,
          limit,
          id: dataUserById.entity_id,
          checkPermissionUser: roles?.management_user_from_entity?._id,
          applicationPermission: applicationPermission?.materialObsolete?._id,
        },
        onSuccess: (data) => {
          setDataUser(data?.response);
          setTotalPages(data?.pagination?.totalPages);
          setTotalItems(data?.pagination?.totalItems);
        },
        onError: (err) => {
          console.error("Error in fetchDataByProjectId:", err);
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  }, [
    fetchData,
    page,
    limit,
    roles?.management_user_from_entity?._id,
    applicationPermission?.materialObsolete?._id,
    dataUserById?.entity_id
  ]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [
    page,
    limit,
    roles?.management_user_from_entity?._id,
    applicationPermission?.materialObsolete?._id,
    refreshButton,
    fetchDataByProjectId
  ]);
  const {
    DataGovernorate,
    DataJobTitle,
    dataGroup,
    setFilterDataUser,
    entityUserColumns,
    rows,
  } = useManagementUsersList({
    dataUser,
    setRefreshButton,
    setDelete,
    pathLink: "/UserManagementFromEntities",
    Ministries,
    Entities,
    roles,
    applicationPermission,
    rtl,
    permissionData,
    dataUserById,
  });
  return (
    <div>
      <>
        {apiLoading && <Loader />}
        <Box dir={rtl?.dir} sx={{ ...layoutStyle }}>
          <Box sx={{ display: "flex" }}>
            <Header
              title={
                t("userManager.user management") +
                " " +
                dataUserById?.Entities_name
              }
              dir={rtl?.dir}
              typeHeader={"h6"}
            />
          </Box>

          <Box sx={{ mb: 1, display: "flex", gap: "5px" }}>
            <EntityCreateUser
              editInfo={false}
              DataGovernorate={DataGovernorate}
              DataJobTitle={DataJobTitle}
              dataGroup={dataGroup}
              setRefreshButton={setRefreshButton}
              roles={roles}
              rtl={rtl}
              dataUserById={dataUserById}
              applicationPermission={applicationPermission}
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
          <GridTemplate
            rows={rows}
            columns={entityUserColumns}
            setPage={setPage}
            page={page}
            limit={limit}
            setLimit={setLimit}
            totalItems={totalItems}
            totalPages={totalPages}
            btn={
              <RefreshButtonData
                onClick={() => setRefreshButton(!refreshButton)}
              />
            }
          />
        </Box>
      </>

      {/* <ManagementUsers
        dataUser={dataUser}
        totalPages={totalPages}
        totalItems={totalItems}
        setDelete={setDelete}
        page={page}
        setPage={setPage} // Ensure setPage is passed for pagination
        limit={limit}
        setLimit={setLimit}
        allUser={false}
        setRefreshButton={setRefreshButton}
        pathLink={"SetPermissionFromEntities"}
        loading={apiLoading} // Optionally pass loading state to child
        title={`${t("userManager.user management")} ${dataUserById?.Entities_name
          }`}
        dataUserById={dataUserById}
        roleUser={roles?.management_user_from_entity?._id}
        applicationPermission={applicationPermission?.materialObsolete?._id}
      /> */}
    </div>
  );
}

export default UserManagementFromEntities;
