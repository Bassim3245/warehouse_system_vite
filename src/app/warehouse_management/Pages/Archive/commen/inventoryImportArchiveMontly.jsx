import Box from "@mui/material/Box";

import { useCallback, useEffect, useMemo, useState } from "react";
import "dayjs/locale/ar";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../../../../components/reusableComponent/Loader";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import useWarehpuseDataById from "../../../../../hooks/ManageWarehouseSetting/useWarehpuseDataById";
import { getInventoryArchiveMonthly } from "../../../../../redux/InventiryArchive/InventoryArchiveAction";
import { Grid, useTheme } from "@mui/material";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import PrintDialogInventory from "../../printInventory/printDialogInventory";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import ImportArchiveMonthly from "./PurchasesDataArchive";
import layoutStyle from "../../../../../style/layoutStyle";

const InventoryImportArchiveMonthly = () => {
  const { InventoryArchiveDataMonthly, loading } =
    useSelector((state) => state?.inventoryArchive);

  const theme = useTheme();
  const { dataUserById, dataUserLab } = usePermissionUser();
  const [refreshKey, setRefreshKey] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { warehouseDataBYId } = useWarehpuseDataById({ warehouseId: searchParams.get("warehouseId") });
  const warehouseId = searchParams.get("warehouseId");
  const documentType = searchParams.get("documentType");
  const documentId = searchParams.get("documentId"); // Optional - may be null

  const fetchData = useCallback(() => {
    if (!warehouseId) return;

    const param = {
      entity_id: dataUserById?.entity_id,
      warehouse_id: warehouseId,
      filterDocumentType: documentType,
      documentId: documentId || null,
    };
    dispatch(getInventoryArchiveMonthly(param));
  }, [
    dispatch,
    dataUserById?.entity_id,
    warehouseId,
    documentType,
    documentId,
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
  return (
    <>
      {loading && <Loader />}
      <Box sx={{ ...layoutStyle }} dir="rtl">
        <Box sx={{ mb: 1 }}>
          <Header
            title={"سجل المخزون"}
            dir="rtl"
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
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

        <ImportArchiveMonthly
          InventoryArchiveData={InventoryArchiveDataMonthly}
          loading={loading}
          theme={theme}
          setRefreshButton={setRefreshKey}
        />
      </Box>

    </>
  );
};

export default InventoryImportArchiveMonthly;
