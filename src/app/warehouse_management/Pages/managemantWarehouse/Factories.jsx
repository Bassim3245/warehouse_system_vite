import { useMemo, useState } from "react";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import {
  DeleteItem,
  hasPermission,
  renderMenuItem,
} from "../../../../utils/Function";
import AddFactoriesForm from "./addFactoiesForm";
import DataCard from "../../../../components/reusableComponent/DataCard";
import { useTranslation } from "react-i18next";
import layoutStyle from "../../../../style/layoutStyle";
import { getToken, getUserInformation } from "../../../../utils/handelCookie";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import useGenInformationUserByEntityId from "../../../../hooks/useGenInformationUserByEntityId";
import { useFactoryManagement } from "../../../../hooks/ManageWarehouseSetting/useFactory";

const Factories = () => {
  const { t } = useTranslation();
  const token = useMemo(() => getToken(), []);

  const { factoryData } = useFactoryManagement();
  const { roles, applicationPermission, permissionData } =
    useUserPermissions();
  const dataUserById = getUserInformation()
  const { dataUsers } = useGenInformationUserByEntityId();

  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderActionButtons = (item) => {
    if (!hasPermission(roles?.add_factory?._id, permissionData)) return null;
    return (
      <>
        {renderMenuItem(
          "delete",
          () =>
            DeleteItem(
              item.id,
              setRefreshKey,
              setAnchorEl,
              token,
              "warehouse/deleteFactoriesById",
              roles?.add_factory?._id,
              applicationPermission?.warehouseSystem?._id
            ),
          DeleteOutlined,
          "حذف"
        )}
        <Divider sx={{ my: 0.5 }} />
        <AddFactoriesForm
          editMode={true}
          dataUserById={dataUserById}
          token={token}
          setRefreshButton={setRefreshKey}
          refreshButton={refreshKey}
          factoryData={item}
          dataUsers={dataUsers}
        />
      </>
    );
  };

  const addButton = hasPermission(roles?.add_factory?._id, permissionData) ? (
    <AddFactoriesForm
      editMode={false}
      dataUserById={dataUserById}
      token={token}
      setRefreshButton={setRefreshKey}
      refreshButton={refreshKey}
      dataUsers={dataUsers}
    />
  ) : null;

  return (
    <Box sx={{ ...layoutStyle, mt: 2 }}>
      <DataCard
        data={factoryData}
        title="أضافة المصانع"
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        addButton={addButton}
        actionButtons={renderActionButtons}
        statusField="status"
        nameField="Factories_name"
        secondaryField="user_name"
        locationField="location"
        dateField="created_at"
        t={t}
        theme={theme}
        hasAddPermission={hasPermission(
          roles?.add_factory?._id,
          permissionData
        )}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};
export default Factories;
