// @ts-ignore
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useMemo, useCallback } from "react";
import CustomDataTable from "./CustomDataTable";
import CostumePagination from "./CostumPagination";
import { useSelector } from "react-redux";
import { getRowClassName } from "../../style/ButtomStyle";
import MobileCardView from "./MobileCardView";

const GridTemplate = ({
  columns,
  rows = [],
  page = 1,
  limit = 10,
  totalItems = 0,
  totalPages = 0,
  checkboxSelection = false,
  selectionModel = [],
  setPage = (newPage) => { },
  setLimit = (newLimit) => { },
  setSelectionModel = (newSelection) => { },
  getRowId = (row) => row.index,
  isPagination = true,
}) => {
  const theme = useTheme();
  const { rtl } = useSelector((state) => state?.language);

  const isMobileView = useMediaQuery(theme.breakpoints.down("lg"));


  // Column visibility model — hides id and stagnant_id
  const columnVisibilityModel = useMemo(
    () => ({
      stagnant_id: false,
      id: false,
    }),
    []
  );

  // Handle row selection - keep single selection only
  const handleRowSelectionChange = useCallback(
    (newSelection) => {
      const selection = Array.isArray(newSelection)
        ? newSelection.slice(-1)
        : newSelection;
      setSelectionModel(selection);
    },
    [setSelectionModel]
  );

  const getRowClassNameMemo = useCallback(
    (params) => getRowClassName(params, theme.palette.primary.main),
    [theme.palette.primary.main]
  );

  return (
    <Box sx={{ mt: 1 }} dir={rtl?.dir || "rtl"}>
        <Box sx={{ width: "100%", p: isMobileView ? 1 : 0 }}>
          {isMobileView ? (
            <MobileCardView
              columns={columns}
              rows={rows}
              checkboxSelection={checkboxSelection}
              selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
              getRowId={getRowId}
              getRowClassName={getRowClassNameMemo}
              mainColor={theme.palette.primary.main}
              dir={rtl?.dir || "rtl"}
            />
          ) : (
            <CustomDataTable
              rows={rows}
              columns={columns}
              checkboxSelection={checkboxSelection}
              onRowSelectionModelChange={handleRowSelectionChange}
              selectionModel={selectionModel}
              columnVisibilityModel={columnVisibilityModel}
              getRowId={getRowId}
              direction={rtl?.dir || "rtl"}
              getRowClassName={getRowClassNameMemo}
            />
          )}

          {/* الترقيم */}
          {isPagination && (
            <Box sx={{ mt: isMobileView ? 2 : 1 }}>
              <CostumePagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
              />
            </Box>
          )}
        </Box>
    </Box>
  );
};

export default memo(GridTemplate);