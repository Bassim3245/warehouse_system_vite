import React, { useMemo, useState, useCallback } from "react";
import GridTemplate from "../../../../../../components/reusableComponent/GridTemplet";
import { inventoryImportManagement } from "../../../../../../utils/ColumnsGridData";
import { useTranslation } from "react-i18next";
import RefreshButtonData from "../../../../../../components/reusableComponent/RefreshButton";
import usePermissionUser from "../../../../../../hooks/usePermissionUser";
import Loader from "../../../../../../components/reusableComponent/Loader";

const ImportManagement = ({ rtl, invoiceData, setRefreshButton, loading, document }) => {
  const { t } = useTranslation();
  const { roles, applicationPermission } = usePermissionUser();
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
      }),
    [t, setRefreshButton, roles, applicationPermission, document, handleSetAnchor]
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
        isPagination={false}
      />
    </>
  );
};

export default React.memo(ImportManagement);
