import React, { useMemo, useState, useCallback } from "react";
import GridTemplate from "../../../../../../components/reusableComponent/GridTemplet";
import { inventoryImportManagement } from "../../../../../../utils/ColumnsGridData";
import { useTranslation } from "react-i18next";
import RefreshButtonData from "../../../../../../components/reusableComponent/RefreshButton";
import useUserPermissions from "../../../../../../hooks/genaral/useUserPermissions";
import Loader from "../../../../../../components/reusableComponent/Loader";

const ImportManagement = ({ rtl, invoiceData, setRefreshButton, loading, document, pagination, setPagination, searchParams }) => {
  const { t } = useTranslation();
  const { roles, applicationPermission } = useUserPermissions();
  const [anchorEl, setAnchorEl] = useState(null);

  // 🔒 Stable callback for menu anchor
  const handleSetAnchor = useCallback((el) => setAnchorEl(el), []);

  // 🔒 Stable refresh callback
  const handleRefresh = useCallback(() => {
    setRefreshButton();
  }, [setRefreshButton]);

  // 🚀 Memoize columns to avoid re-creation on every render
  const columns = useMemo(
    () =>
      inventoryImportManagement({
        t,
        setRefreshButton,
        roles,
        applicationPermission,
        setAnchorEl: handleSetAnchor,
        document,
        searchParams
      }),
    [t, setRefreshButton, roles, applicationPermission, document, handleSetAnchor, searchParams]
  );

  // 🚀 Memoize rows
  const rows = useMemo(() => {
    return invoiceData?.map((item, index) => ({
      index: index + 1,
      ...item,
    })) || [];
  }, [invoiceData]);

  return (
    <>
      {loading && <Loader />}
      <GridTemplate
        rows={rows}
        columns={columns}
        btn={<RefreshButtonData onClick={handleRefresh} />}
        page={pagination.page}
        limit={pagination.limit}
        totalItems={pagination.total}
        totalPages={pagination.totalPages}
        setPage={(page) => setPagination((prev) => ({ ...prev, page }))}
        setLimit={(limit) => setPagination((prev) => ({ ...prev, limit }))}
      // isPagination={false}
      />
    </>
  );
};

export default React.memo(ImportManagement);
