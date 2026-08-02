import  Box  from "@mui/material/Box";
import Header from "../../../components/reusableComponent/HeaderComponent.jsx";
import GridTemplate from "../../../components/reusableComponent/GridTemplet.jsx";
import UserMangeForm from "./UserManageForm.jsx";
import Loader from "../../../components/reusableComponent/Loader.jsx";
import RefreshButtonData from "../../../components/reusableComponent/RefreshButton.jsx";
import FilterDataUser from "../../../components/filter/filterUser.js";
import UseFullScreen from "../../../hooks/useFullScreen.js";
import useManagementUsersList from "../../../hooks/useManagementUsersList.js";
import layoutStyle from "../../../style/layoutStyle.js";


const ManagementUsers = ({
  dataUser,
  totalItems,
  setRefreshButton,
  setDelete,
  pathLink,
  totalPages,
  allUser,
  page,
  limit,
  setPage,
  setLimit,
  loading,
  title,
  refreshing,
}) => {
  // Use the custom hook to get all the logic and state
  const {
    // State
    DataGovernorate,
    DataJobTitle,
    dataGroup,
    open,
    setOpen,
    setFilterDataUser,
    DataApplicationPermission,

    // Permission data
    Ministries,
    Entities,
    roles,
    applicationPermission,
    rtl,

    // Functions

    // Table data
    userColumns,
    rows,

  } = useManagementUsersList({
    dataUser,
    setRefreshButton,
    setDelete,
    pathLink,
    allUser,
  });
  return (
    <>
      {loading && <Loader />}
      <Box
        dir={rtl?.dir}
        sx={{ ...layoutStyle }}
      >
        <Box sx={{ display: "flex" }}>
          <Header title={title} dir={rtl?.dir} />
        </Box>
        <Box sx={{ mb: 1, display: "flex", gap: "5px" }}>
          <UserMangeForm
            editInfo={false}
            DataUsers={null}
            allUser={allUser}
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
            setOpen={setOpen}
            open={open}
            setFilterDataUser={setFilterDataUser}
            page={page}
            limit={limit}
            totalItems={totalItems}
            totalPages={totalPages}
            setRefreshButton={setRefreshButton}
          />
          <UseFullScreen
            setRefreshButton={setRefreshButton}
            refreshing={refreshing}
          />
        </Box>
        <Box sx={{ overflowX: "auto", minWidth: "999px" }}>
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
      </Box>
    </>
  );
};

export default ManagementUsers;
