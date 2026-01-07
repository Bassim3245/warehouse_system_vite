import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../../redux/LanguageState";
import { getDataUserById } from "../../../redux/userSlice/authActions";
import { getToken } from "../../../utils/handelCookie";
import LogList from "../../../main_page/log/LogLis";
import { useApi } from "../../../hooks/useApi";
const LogObsoleteById = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const [refreshButton, setRefreshButton] = useState(false);
  const [dataLog, setDataLog] = useState([]);
  const [totalPages, setTotalPages] = useState("");
  const [totalItems, setTotalItems] = useState("");
  const { roles,applicationPermission } = useSelector((state) => state.RolesData);
  const token = getToken();
  const { dataUserById } = useSelector((state) => {
    return state.user;
  });
  useEffect(() => {
    dispatch(getDataUserById(token));
  }, [dispatch, token]);
  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);
 const { loading: apiLoading, fetchData } = useApi(); // Using the new API hook
    const fetchDataByProjectId = useCallback(async () => {
      try {
        const response = await fetchData({
          endpoint: '/api/getLogByEntityId',
          method: 'GET',
          params: {
            page,
            limit,
            checkPermissionUser: roles?.show_log_entity?._id,
            entityId: dataUserById?.entity_id,
            category_id: 1,
            applicationPermission: applicationPermission?.materialObsolete?._id
          },
          onSuccess: (data) => {
            console.log('Data fetched successfully in AllLog:', data);
            if (data?.logs && Array.isArray(data.logs)) {
              setDataLog(data.logs);
              setTotalPages(data?.pagination?.totalPages);
              setTotalItems(data?.pagination?.totalItems);
            } else {
              console.error('Logs data is not in expected format:', data);
              setDataLog([]);
            }
          },
          onError: (err) => {
            console.error('Error in fetchDataByProjectId:', err);
          }
        });
        return response;
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }, [fetchData, page, limit, roles?.show_log?._id, applicationPermission?.materialObsolete?._id]);
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
        title={`سجل  ${dataUserById?.Entities_name}`}
      />
    </>
  );
};

export default LogObsoleteById;
