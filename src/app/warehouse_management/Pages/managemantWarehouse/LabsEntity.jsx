import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Monitor from "@mui/icons-material/Monitor";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import {
  DeleteItem,
  renderMenuItem,
  hasPermission,
} from "../../../../utils/Function";
import AddLabForm from "./addLabForm";
import { useNavigate } from "react-router-dom";
import DataCard from "../../../../components/reusableComponent/DataCard";
import { useTranslation } from "react-i18next";
import layoutStyle from "../../../../style/layoutStyle";
import { useLabManagement } from "../../../../hooks/ManageWarehouseSetting/useLab";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getToken } from "../../../../utils/handelCookie";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import { fetchDataUserEntityId } from "../../../../redux/userSlice/authActions";
import useGetfactoryInformationByUserId from "../../../../hooks/ManageWarehouseSetting/useGetfactoryInformationByUserId";
import { useFactoryManagement } from "../../../../hooks/ManageWarehouseSetting/useFactory";

const LabsEntity = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    has_lab,
    has_factory,
    has_warehouse,
    allow_to_manage_all_lab,
    has_production_warehouse,
    has_main_warehouse,
    allow_show_data_l,
    labData,
  } = useLabManagement();

  const { factoryData } = useFactoryManagement();

  const dispatch = useDispatch();
  const theme = useTheme();
  const token = useMemo(() => getToken(), []);

  const { dataUsers } = useSelector((state) => state.user || {});
  const {
    roles,
    applicationPermission,
    permissionData,
    dataUserById,
  } = useUserPermissions();
  const [loading, setLoading] = useState(false);
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

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const entityId = useMemo(
    () => dataUserById?.entity_id,
    [dataUserById?.entity_id]
  );
  const factoryId = useMemo(
    () => dataUserFactory?.factory_id,
    [dataUserFactory?.factory_id]
  );

  const dispatchFactoryLabWarehouseData = useCallback(() => {
    if (!entityId) return;
    dispatch(fetchDataUserEntityId(entityId));
  }, [entityId, dispatch]);

  useEffect(() => {
    dispatchFactoryLabWarehouseData();
  }, [dispatchFactoryLabWarehouseData]);

  const renderActionButtons = (item) => {
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
              "warehouse/deleteLaboratoriesById",
              roles?.add_lab?._id,
              applicationPermission.warehouseSystem._id
            ),
          DeleteOutlined,
          "حذف"
        )}
        <Divider sx={{ my: 0.5 }} />
        {hasPermission(roles?.add_lab?._id, permissionData) && (
          <AddLabForm
            editMode={true}
            factoryData={factoryData}
            factory_id={factoryId}
            labData={item}
            dataUserFactor={dataUserFactory}
            setRefreshButton={setRefreshKey}
            has_lab={has_lab}
            has_factory={has_factory}
            has_warehouse={has_warehouse}
            allow_to_manage_all_lab={allow_to_manage_all_lab}
            has_production_warehouse={has_production_warehouse}
            has_main_warehouse={has_main_warehouse}
            allow_show_data_l={allow_show_data_l}
            dataUsers={dataUsers}
          />
        )}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            navigate(
              `follow-up-labs?lab_id=${item.id}&factory_id=${factoryId}`
            );
          }}
        >
          <Monitor /> الاطلاع على المخازن
        </MenuItem>
      </>
    );
  };

  const extraFields = [
    { key: "specialization", label: "التخصص" },
    { key: "warehouse_count", label: "عدد المخازن المتوفرة" },
  ];

  const addButton = hasPermission(roles?.add_lab?._id, permissionData) && (
    <AddLabForm
      editMode={false}
      factoryData={factoryData}
      labData={labData}
      dataUserById={dataUserById}
      refreshKey={refreshKey}
      setRefreshButton={setRefreshKey}
      dataUsers={dataUsers}
      dataUserFactor={dataUserFactory}
      has_lab={has_lab}
      has_factory={has_factory}
      has_warehouse={has_warehouse}
      allow_to_manage_all_lab={allow_to_manage_all_lab}
      has_production_warehouse={has_production_warehouse}
      has_main_warehouse={has_main_warehouse}
      allow_show_data_l={allow_show_data_l}
    />
  );

  return (
    <Box sx={{ ...layoutStyle, mt: 2 }}>
      <DataCard
        data={labData}
        title="أضافة المعامل"
        loading={loading}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        addButton={addButton}
        actionButtons={renderActionButtons}
        statusField="status"
        nameField="Laboratory_name"
        secondaryField="user_name"
        locationField="location"
        dateField="created_at"
        extraFields={extraFields}
        t={t}
        theme={theme}
        hasAddPermission={hasPermission(roles?.add_lab?._id, permissionData)}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};

export default LabsEntity;
