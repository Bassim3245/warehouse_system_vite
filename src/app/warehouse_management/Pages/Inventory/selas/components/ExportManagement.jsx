import { useState, useEffect, useMemo, useCallback } from "react";
import { inventoryExportTransactions } from "../../../../../../utils/ColumnsGridData";
import { useTranslation } from "react-i18next";
import GridTemplate from "../../../../../../components/reusableComponent/GridTemplet";
import RefreshButtonData from "../../../../../../components/reusableComponent/RefreshButton";
import { axiosInstance } from "../../../../../../redux/api/axiosConfig";
import UsePermissionUser from "../../../../../../hooks/usePermissionUser";
import Loader from "../../../../../../components/reusableComponent/Loader";
import { BackendUrl } from "../../../../../../redux/api/axios";
import { getToken } from "../../../../../../utils/handelCookie";

const ExportManagement = ({
  documentId,
  refreshButton,
  setRefreshButton,
  document,
  isInternalTransfer,
}) => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const { roles, applicationPermission } = UsePermissionUser();
  // --------------------------------------------------
  // 🔒 Stable fetch function (avoids re-creation)
  // --------------------------------------------------
  const fetchExports = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getExportTransactionData/${documentId}`,
        { headers: { authorization: getToken() } }
      );

      setExports(response?.data?.data || []);
    } catch (error) {
      console.log("Fetch exports error:", error);
    } finally {
      setLoading(false);
    }
  }, [documentId]);
  useEffect(() => {
    fetchExports();
  }, [fetchExports, refreshButton]);
  const memoizedSetAnchorEl = useCallback((el) => setAnchorEl(el), []);
  const columns = useMemo(
    () =>
      inventoryExportTransactions({
        t,
        roles,
        applicationPermission,
        setRefreshButton,
        setAnchorEl: memoizedSetAnchorEl,
        document,
        isInternalTransfer,
      }),
    [t, roles, applicationPermission, setRefreshButton, memoizedSetAnchorEl, document]
  );
  const rows = useMemo(
    () =>
      exports?.map((item, index) => ({
        index: index + 1,
        ...item,
        name_material:
          item?.details?.length > 0 ? item.details[0].material_name : "",
      })) || [],
    [exports]
  );
  return (
    <>
      {loading && <Loader />}
      <GridTemplate
        rows={rows}
        columns={columns}
        btn={<RefreshButtonData onClick={setRefreshButton} />}
        isPagination={false}
      />
    </>
  );
};
export default ExportManagement;
