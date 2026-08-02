import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Header from "../../../../components/reusableComponent/HeaderComponent.jsx";
import { useTranslation } from "react-i18next";
import GridTemplate from "../../../../components/reusableComponent/GridTemplet.jsx";
import { BackendUrl } from "../../../../redux/api/axios";
import FromIsDeleted from "./FromObsolete";
import { hasPermission, renderMenuItem } from "../../../../utils/Function.jsx";
import Loader from "../../../../components/reusableComponent/Loader.jsx";
import FilterData from "./FilterData.jsx";
import "../style.css";
import { getToken } from "../../../../utils/handelCookie.jsx";
import HandelExcelFile from "./excelForm/HandelExcell";
import { useApi } from "../../../../hooks/useApi";
import UseFullScreen from "../../../../hooks/useFullScreen";
import { obsoleteMaterialGrideColumn } from "../../../../utils/ColumnsGridData";
import { handelDeleteAll } from "../../../../utils/opsoloteUtils";
import useUserPermissions from "../../../../hooks/genaral/useUserPermissions";
import layoutStyle from "../../../../style/layoutStyle";
import useGetInformationClass from "../../../../hooks/useGetInformationClass.jsx";
import useUnitMeasuring from "../../../../hooks/genaral/useUnitMeasuring";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Search from "@mui/icons-material/Search";
import useUserData from "../../../../hooks/genaral/useUserData.jsx";
import useMinistries from "../../../../hooks/genaral/useMinistries.jsx";
import useEntities from "../../../../hooks/genaral/useEntities.jsx";
import useStateMaterial from "../../../../hooks/genaral/useStatMaterila.jsx";

const FormDeletedList = () => {
  const {
    roles,
    applicationPermission,
    permissionData,

  } = useUserPermissions();

  const { dataUserById, rtl } = useUserData()
  const { Ministries } = useMinistries()
  const { Entities } = useEntities()
  const { stateMaterial } = useStateMaterial()
  const { dataMainClass, dataSubClass } = useGetInformationClass();
  const { dataUnitMeasuring } = useUnitMeasuring();
  let token = getToken();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteItem, setDelete] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [refreshButton, setRefreshButton] = useState(false);
  const [loading, setLoading] = useState(null);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const [filterDataMainClass, setFilterDataMainClass] = useState([]);
  const [dataMaterials, setDataMaterials] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  const { loading: apiLoading, fetchData } = useApi();
  const fetchDataByProjectId = useCallback(async () => {
    try {
      const hasDirectPermission = hasPermission(
        roles?.show_all_data_obsolete_material?._id,
        permissionData
      );
      const url = hasDirectPermission
        ? "getDataStagnantMaterialsPa"
        : "getDataStagnantMaterialsByUserId";

      await fetchData({
        endpoint: `/api/${url}`,
        method: "GET",
        params: {
          page,
          limit,
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.view_data_obsolete?._id,
          applicationPermission: applicationPermission.materialObsolete._id,
        },
        onSuccess: (data) => {
          if (data?.response) {
            setDataMaterials(data?.response);
            setTotalPages(data?.pagination?.totalPages || 0);
            setTotalItems(data?.pagination?.totalItems || 0);
          } else {
            setDataMaterials([]);
            setTotalPages(0);
            setTotalItems(0);
          }
        },
        onError: (err) => {
          console.error("Error fetching data:", err);
          setDataMaterials([]);
          setTotalPages(0);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setDataMaterials([]);
      setTotalPages(0);
      setTotalItems(0);
    }
  }, [
    fetchData,
    page,
    limit,
    dataUserById?.entity_id,
    roles?.view_data_obsolete?._id,
    roles?.show_all_data_obsolete_material?._id,
    permissionData,
    hasPermission,
    refreshButton,
    deleteItem,
  ]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [
    fetchDataByProjectId,
    page,
    limit,
    roles?.view_data_obsolete?._id,
    roles?.show_all_data_obsolete_material?._id,
    permissionData,
    hasPermission,
    refreshButton,
  ]);
  const openProduct = (id) => {
    navigate(`Material-Overview/${id}`);
  };
  const columns = obsoleteMaterialGrideColumn({
    t,
    token,
    setRefreshButton,
    dataMainClass,
    dataSubClass,
    dataUnitMeasuring,
    renderMenuItem,
    applicationPermission,
    roles,
    dataUserById,
    open,
    setAnchorEl,
    setDelete,
    setSelectionModel,
    selectionModel,
    openProduct,
    Ministries,
    Entities,
    stateMaterial,
    rtl,
  });
  const rows = dataMaterials?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
  const handleAddDataModel = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);
  return (
    <>
      {apiLoading || (loading && <Loader />)}
      <Box dir={rtl?.dir} sx={{ ...layoutStyle }}>
        <Header title={t("Stagnant.title")} dir={rtl?.dir} />
        <div className="d-flex flex-wrap w-100 gap-2 mb-3 justify-content-start align-items-center">
          {selectionModel?.length > 0 && (
            <Button
              variant="contained"
              startIcon={<DeleteOutlined />}
              onClick={() =>
                handelDeleteAll(
                  selectionModel,
                  setRefreshButton,
                  setSelectionModel,
                  setLoading,
                  token,
                  roles,
                  applicationPermission,
                  BackendUrl
                )
              }
              sx={{
                backgroundColor: "#d32f2f",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 2,
                py: 1.2,
                boxShadow: "0 4px 12px rgba(211,47,47,0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(211,47,47,0.3)",
                },
              }}
            >
              {t("delete")}
            </Button>
          )}
          <FromIsDeleted
            dataUserById={dataUserById}
            dataSubClass={dataSubClass}
            dataMainClass={dataMainClass}
            dataUnitMeasuring={dataUnitMeasuring}
            setRefreshButton={setRefreshButton}
            token={token}
            roles={roles}
            applicationPermission={applicationPermission}
            Ministries={Ministries}
            Entities={Entities}
            stateMaterial={stateMaterial}
            rtl={rtl}
          />
          {hasPermission(
            roles?.allow_to_users_to_save_material_from_file_excel?._id,
            permissionData
          ) && (
              <HandelExcelFile
                dataUserById={dataUserById}
                dataSubClass={dataSubClass}
                dataMainClass={dataMainClass}
                dataUnitMeasuring={dataUnitMeasuring}
                setRefreshButton={setRefreshButton}
                token={token}
              />
            )}

          {!open && (
            <IconButton
              color="primary"
              variant="contained"
              onClick={handleAddDataModel}
            >
              {<Search />}
            </IconButton>
          )}
          <UseFullScreen
            setRefreshButton={setRefreshButton}
            refreshing={refreshButton}
          />
        </div>
        <FilterData
          dataUserById={dataUserById}
          dataSubClass={dataSubClass}
          dataMainClass={dataMainClass}
          open={open}
          limit={limit}
          page={page}
          setOpen={setOpen}
          setTotalItems={setTotalItems}
          setTotalPages={setTotalPages}
          setRefreshButton={setRefreshButton}
          setFilterDataMainClass={setFilterDataMainClass}
          setDataMaterials={setDataMaterials}
          token={token}
        />
        <GridTemplate
          rows={rows}
          columns={columns}
          setLimit={setLimit}
          setPage={setPage}
          page={page}
          limit={limit}
          totalItems={totalItems}
          totalPages={totalPages}
          getRowId={(row) => row.stagnant_id}
          checkboxSelection={true}
          selectionModel={selectionModel}
          setSelectionModel={setSelectionModel}
        />
      </Box>
    </>
  );
};
export default FormDeletedList;
