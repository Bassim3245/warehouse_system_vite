import { useState, useEffect, useCallback } from "react";
import LogList from "../../../main_page/log/LogLis.jsx";
import { useApi } from "../../../hooks/useApi";
import usePermissionUser from "../../../hooks/usePermissionUser";
const LogWarehouseById = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [refreshButton, setRefreshButton] = useState(false);
  const [dataLog, setDataLog] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const { dataUserById, roles, applicationPermission } = usePermissionUser();
  const { loading: apiLoading, fetchData } = useApi(); // Using the new API hook
  const fetchDataByProjectId = useCallback(async () => {
    try {
      const response = await fetchData({
        endpoint: "/api/getLogByEntityId",
        method: "GET",
        params: {
          page,
          limit,
          checkPermissionUser: roles?.show_log_entity?._id,
          entityId: dataUserById?.entity_id,
          applicationPermission: applicationPermission?.warehouseSystem?._id,
          category_id: 2,
        },
        onSuccess: (data) => {
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
    roles?.show_log_entity?._id,
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
        limit={limit}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        setRefreshButton={setRefreshButton}
        refreshButton={refreshButton}
        title={`سجل  ${dataUserById?.Entities_name}`}
      />
    </>
  );
};

export default LogWarehouseById;
