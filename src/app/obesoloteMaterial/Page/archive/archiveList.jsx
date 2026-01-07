import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../../components/reusableComponent/HeaderComponent.jsx";
import Box from "@mui/material/Box";
import { setLanguage } from "../../../../redux/LanguageState";
import { useTranslation } from "react-i18next";
import Loader from "../../../../components/reusableComponent/Loader.jsx";
import { ButtonClose, ButtonTheme } from "../../../../style/ButtomStyle.jsx";
import "../style.css";
import ArchiveRecipient from "./Archivericever.jsx";
import ArchiveSender from "./ArchiveSender.jsx";
import { useApi } from "../../../../hooks/useApi";
import usePermissionUser from "../../../../hooks/usePermissionUser";
const Archive = () => {
  // State management
  const [page, setPage] = useState(1); // Current page for pagination
  const [limit, setLimit] = useState(10); // Limit for items per page
  const { rtl } = useSelector((state) => state.language); // Language direction (RTL or LTR)
  const { dataUserById, roles, applicationPermission } = usePermissionUser();
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0); // Total number of pages from pagination
  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const [dataMaterials, setDataMaterials] = useState([]); // Data for sent materials
  const [dataMaterialsBuy, setDataMaterialsBuy] = useState([]); // Data for received materials
  const [filter, setFilter] = useState(false); // Determines if we're showing sent or received materials
  const { t } = useTranslation(); // Translation function
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
  const { loading: apiLoading, fetchData } = useApi();
  const fetchDataByProjectId = useCallback(async () => {
    try {
      // Fetch data for booked stagnant materials
      await fetchData({
        endpoint: `/api/getDataStagnantMaterialsBookedPa`,
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
            setDataMaterials(data.response);
            setTotalPages(data.pagination?.totalPages || 0);
            setTotalItems(data.pagination?.totalItems || 0);
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

      // Fetch data for booked or purchased stagnant materials
      await fetchData({
        endpoint: `/api/getDataStagnantMaterialsBookedPByEntityBookedOrBuyTheMaterial`,
        method: "GET",
        params: {
          page,
          limit,
          entities_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.show_archive?._id,
          applicationPermission: applicationPermission.materialObsolete._id,
        },
        onSuccess: (data) => {
          if (data?.response) {
            setDataMaterialsBuy(data.response); // Assuming you have a different state for bought materials
            setTotalPages(data.pagination?.totalPages || 0);
            setTotalItems(data.pagination?.totalItems || 0);
          } else {
            setDataMaterialsBuy([]);
            setTotalPages(0);
            setTotalItems(0);
          }
        },
        onError: (err) => {
          console.error("Error fetching data:", err);
          setDataMaterialsBuy([]);
          setTotalPages(0);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setDataMaterialsBuy([]);
      setTotalPages(0);
      setTotalItems(0);
    }
  }, [
    fetchData,
    page,
    limit,
    dataUserById?.entity_id,
    applicationPermission,
    roles?.show_archive?._id,
    roles?.show_all_data_obsolete_material?._id,
  ]);

  useEffect(() => {
    fetchDataByProjectId();
  }, [
    fetchDataByProjectId,
    page,
    limit,
    dataUserById?.entity_id,
    applicationPermission,
    roles?.show_archive?._id,
    roles?.show_all_data_obsolete_material?._id,
  ]);

  // Toggle between sent and received materials
  const handelOpenRecipient = () => setFilter(false);
  const handelOpenSender = () => setFilter(true);
  return (
    <>
      {apiLoading && <Loader />} {/* Display loader when fetching data */}
      <Box
        dir={rtl?.dir}
        sx={{ marginLeft: "20px", marginRight: "20px", minWidth: "999px" }}
      >
        {!filter ? (
          <Header title={t("حركة المواد المرسلة ")} dir={rtl?.dir} />
        ) : (
          <Header title={t("حركة المواد المستلمة ")} dir={rtl?.dir} />
        )}

        <div className="d-flex flex-wrap w-100 gap-3 mb-3">
          <ButtonTheme onClick={handelOpenSender}>المواد المستلمة</ButtonTheme>
          <ButtonClose onClick={handelOpenRecipient}>
            المواد المرسلة
          </ButtonClose>
        </div>

        {/* Conditionally render ArchiveRecipient or ArchiveSender based on filter */}
        {filter ? (
          <ArchiveRecipient
            setLimit={setLimit}
            setPage={setPage}
            dataMaterials={dataMaterialsBuy}
            page={page}
            limit={limit}
            totalItems={totalItems}
            totalPages={totalPages}
            t={t}
            info={dataUserById}
          />
        ) : (
          <ArchiveSender
            setLimit={setLimit}
            setPage={setPage}
            dataMaterials={dataMaterials}
            t={t}
            page={page}
            limit={limit}
            totalItems={totalItems}
            totalPages={totalPages}
            info={dataUserById}
          />
        )}
      </Box>
    </>
  );
};

export default Archive;
