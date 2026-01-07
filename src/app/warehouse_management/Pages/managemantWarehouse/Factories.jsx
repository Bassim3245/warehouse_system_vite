import  { useEffect, useMemo, useState } from "react";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {useTheme} from "@mui/material/styles";
import {
  DeleteItem,
  hasPermission,
  renderMenuItem,
} from "../../../../utils/Function";
import AddFactoriesForm from "./addFactoiesForm";
import DataCard from "../../../../components/reusableComponent/DataCard";
import { useTranslation } from "react-i18next";
import layoutStyle from "../../../../style/layoutStyle";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../../../utils/handelCookie";
import usePermissionUser from "../../../../hooks/usePermissionUser";
import { getAllFactory } from "../../../../redux/FactoriesState/FactoriesAction";
import useGenInformationUserByEntityId from "../../../../hooks/useGenInformationUserByEntityId";
const Factories = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // Memoize token to prevent unnecessary re-computations
  const token = useMemo(() => getToken(), []);
  const { factoryData } = useSelector((state) => state?.factory);
  const { wareHouseData } = useSelector((state) => state?.wareHouse);
  const { roles, applicationPermission, permissionData, dataUserById } =
    usePermissionUser();
  // States
  const { dataUsers } = useGenInformationUserByEntityId();
  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    dispatch(
      getAllFactory({
        entity_id: dataUserById?.entity_id,
        roles,
        applicationPermission,
      })
    );
  }, [dataUserById?.entity_id, dispatch, refreshKey]);
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
          wareHouseData={wareHouseData}
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
      wareHouseData={wareHouseData}
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
      />
    </Box>
  );
};
export default Factories;
