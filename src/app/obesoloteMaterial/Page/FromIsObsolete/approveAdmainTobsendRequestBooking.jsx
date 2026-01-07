import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Header from "../../../../components/reusableComponent/HeaderComponent.jsx";
import GridTemplate from "../../../../components/reusableComponent/GridTemplet.jsx";
import Loader from "../../../../components/reusableComponent/Loader.jsx";
import { BackendUrl } from "../../../../redux/api/axios"; 
import { getToken } from "../../../../utils/handelCookie.jsx";
import { useTranslation } from "react-i18next";
import {
  renderMenuItem,
} from "../../../../utils/Function.jsx";
import { useApi } from "../../../../hooks/useApi";
import UseFullScreen from "../../../../hooks/useFullScreen";
import { ApproveAdmainTobsendRequestBookingColumn } from "../../../../utils/ColumnsGridData";
import usePermissionUser from "../../../../hooks/usePermissionUser";
import layoutStyle from "../../../../style/layoutStyle";
const ApproveAdmainTobsendRequestBooking = () => {
  const {
    roles,
    applicationPermission,
    dataUserById,
    rtl,
  } = usePermissionUser();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [dataBook, setDataBookObsolete] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { t } = useTranslation();
  const [refreshButton, setRefreshButton] = useState(false);
  const token = getToken();

  const { loading: apiLoading, fetchData } = useApi();
  const fetchDataByProjectId = useCallback(async () => {
    try {
      await fetchData({
        endpoint: `/api/getDataBookByEntityIdSendBooking`,
        method: "GET",
        params: {
          page,
          limit,
          entity_id: dataUserById?.entity_id,
          checkPermissionUser: roles?.Booking_requests?._id,
          applicationPermission: applicationPermission.materialObsolete._id,
        },
        onSuccess: (data) => {
          if (data?.response) {
            setDataBookObsolete(data.response);
            setTotalPages(data.pagination?.totalPages || 0);
            setTotalItems(data.pagination?.totalItems || 0);
          } else {
            setDataBookObsolete([]);
            setTotalPages(0);
            setTotalItems(0);
          }
        },
        onError: (err) => {
          console.error("Error fetching data:", err);
          setDataBookObsolete([]);
          setTotalPages(0);
          setTotalItems(0);
        },
      });
    } catch (error) {
      console.error("Error in fetchDataByProjectId:", error);
      setDataBookObsolete([]);
      setTotalPages(0);
      setTotalItems(0);
    }
  }, [
    fetchData,
    page,
    limit,
    dataUserById?.entity_id,
    roles?.Booking_requests?._id,
    applicationPermission.materialObsolete._id,
  ]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [
    fetchDataByProjectId,
    page,
    limit,
    roles?.Booking_requests?._id,
    applicationPermission.materialObsolete._id,
  ]);


  const rows = dataBook?.map((item, index) => ({
    index: index + 1,
    ...item,
  }));
  const columns = ApproveAdmainTobsendRequestBookingColumn({
    t,
    token,
    setRefreshButton,
    setLoading,
    renderMenuItem,
    applicationPermission,
    roles,
    BackendUrl,
  })
  return (
    <Box dir={rtl?.dir} sx={{
      ...layoutStyle
    }}>
      {apiLoading && <Loader />}

      <Header
        title={t(
          "List of Approved Reservations Sent to Beneficiary Entities"
        )}
        dir={rtl?.dir}
      />
      <div className="mb-2">
        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />{" "}
      </div>
      <Box sx={{ flexGrow: 1 }}>
        <GridTemplate
          rows={rows}
          columns={columns}
          setLimit={setLimit}
          setPage={setPage}
          page={page}
          limit={limit}
          totalItems={totalItems}
          totalPages={totalPages}
        />
      </Box>
    </Box>
  );
};

export default ApproveAdmainTobsendRequestBooking;
