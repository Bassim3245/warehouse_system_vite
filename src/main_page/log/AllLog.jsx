import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import LogList from "./LogLis.jsx";
import { useApi } from "../../hooks/useApi.jsx";
const AllLog = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshButton, setRefreshButton] = useState(false);
  const [dataLog, setDataLog] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const { roles, applicationPermission } = useSelector(
    (state) => state?.RolesData
  );
  const { loading: apiLoading, fetchData } = useApi(); // Using the new API hook

  const fetchDataByProjectId = useCallback(async () => {
    try {
      const response = await fetchData({
        endpoint: "/api/getLog",
        method: "GET",
        params: {
          page,
          limit,
          checkPermissionUser: roles?.show_log?._id,
          applicationPermission: applicationPermission?.materialObsolete?._id,
        },
        onSuccess: (data) => {
          console.log("Data fetched successfully in AllLog:", data);
          if (data?.logs && Array.isArray(data.logs)) {
            setDataLog(data.logs);
            setTotalPages(data?.pagination?.totalPages);
            setTotalItems(data?.pagination?.totalItems);
          } else {
            console.error("Logs data is not in expected format:", data);
            setDataLog([]);
          }
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
    roles?.show_log?._id,
    applicationPermission?.materialObsolete?._id,
  ]);
  useEffect(() => {
    fetchDataByProjectId();
  }, [fetchDataByProjectId, refreshButton, page, limit]);
  return (
    <>
      <LogList
        dataLog={dataLog}
        totalItems={totalItems}
        totalPages={totalPages}
        loading={apiLoading}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        setRefreshButton={setRefreshButton}
        refreshButton={refreshButton}
        title="السجل العام"
      />
    </>
  );
};

export default AllLog;
