import Box from "@mui/material/Box";

import { useCallback, useEffect, useMemo, useState } from "react";
import "dayjs/locale/ar";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import Loader from "../../../../../components/reusableComponent/Loader";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import PrintDialogInventory from "../../printInventory/printDialogInventory";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import {
  Grid,
  useTheme,
} from "@mui/material";
import layoutStyle from "../../../../../style/layoutStyle";
import useWarehpuseDataById from "../../../../../hooks/ManageWarehouseSetting/useWarehpuseDataById";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInventoryArchiveMonthly } from "../../../../../redux/InventiryArchive/InventoryArchiveAction";
import ExportArchiveMonthly from "./salesDataArchive";

const InventoryExportArchiveMonthly = () => {
  const { InventoryArchiveDataMonthly, loading, pagination } =
    useSelector((state) => state?.inventoryArchive);

  const theme = useTheme();
  const [refreshKey, setRefreshKey] = useState(false);
  const { dataUserById, dataUserLab } = usePermissionUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  // Get values from URL params
  const warehouseId = searchParams.get("warehouseId");
  const documentType = searchParams.get("documentType");
  const documentIdFromUrl = searchParams.get("documentId");
  const isInternalTransfer = useMemo(
    () => documentType === "internal_consumption",
    [documentType]
  );
  const { warehouseDataBYId } = useWarehpuseDataById({ warehouseId });

  // Document ID state
  const [documentId, setDocumentId] = useState(documentIdFromUrl || "");

  const fetchData = useCallback(() => {
    if (!warehouseId || !documentType) return;
    let param = {
      entity_id: dataUserById?.entity_id,
      warehouse_id: warehouseId,
      filterDocumentType: documentType,
      documentId: documentId,
      pagination: pagination
    };

    dispatch(getInventoryArchiveMonthly(param));
  }, [
    dispatch,
    dataUserById?.entity_id,
    warehouseId,
    documentType,
    documentId,
    searchParams
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize button container styles
  const buttonContainerSx = useMemo(
    () => ({
      display: "flex",
      gap: 1,
      flexWrap: "wrap",
      alignItems: "center",
    }),
    []
  );

  // Get document type display name
  const getDocumentTypeDisplay = () => {
    switch (documentType) {
      case "in":
        return "المواد الواردة";
      case "internal_consumption":
        return "صرف داخلي";
      case "out":
        return "المواد الصادرة";
      default:
        return "غير محدد";
    }
  };


  return (
    <>
      {loading && <Loader />}
      <Box sx={{ ...layoutStyle }} dir="rtl">
        <Box sx={{ mb: 1 }}>
          <Header
            title={getDocumentTypeDisplay()}
            dir="rtl"
          />
        </Box>

        {/* Controls Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Action Buttons */}
          <Grid item xs={12} md={3}>
            <Box sx={buttonContainerSx}>
              <PrintDialogInventory
                store_id={warehouseId}
                InventoryArchiveData={InventoryArchiveDataMonthly}
                dataUserById={dataUserById}
                dataUserLab={dataUserLab}
                Factories_name={warehouseDataBYId?.Factories_name}
                Labs_name={warehouseDataBYId?.Laboratory_name}
                warehouse_name={warehouseDataBYId?.name}
                filterDocumentType={documentType}
              />
              <UseFullScreen
                setRefreshButton={setRefreshKey}
                refreshing={refreshKey}
              />
            </Box>
          </Grid>
        </Grid>
        <ExportArchiveMonthly
          InventoryArchiveData={InventoryArchiveDataMonthly}
          theme={theme}
          loading={loading}
          setRefreshKey={setRefreshKey}
          isPagna={false}
          isInternalTransfer={isInternalTransfer}
        />
      </Box>
    </>
  );
};

export default InventoryExportArchiveMonthly;