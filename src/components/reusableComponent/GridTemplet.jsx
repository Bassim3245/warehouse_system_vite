// @ts-ignore
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useMemo, useCallback } from "react";
import StyledDataGrid from "./StyledDataGrid";
import { CustomNoRowsOverlay } from "../../utils/Function";
import CostumePagination from "./CostumPagination";
import { useSelector } from "react-redux";
import { getRowClassName } from "../../style/ButtomStyle";
import MobileCardView from "./MobileCardView";
import { DataGrid } from "@mui/x-data-grid";

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

  const paperStyles = useMemo(
    () => ({
      width: "100%",
      overflow: "hidden",
      borderRadius: isMobileView ? "8px" : "10px",
      backgroundColor:
        theme?.palette?.mode === "dark"
          ? "rgba(30, 30, 30, 0.85)"
          : "rgba(255, 255, 255, 0.95)",
      boxShadow:
        theme?.palette?.mode === "dark"
          ? "0 8px 32px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.1)",
      border:
        theme?.palette?.mode === "dark"
          ? "1px solid rgba(255, 255, 255, 0.05)"
          : "1px solid rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow:
          theme?.palette?.mode === "dark"
            ? "0 12px 48px rgba(0, 0, 0, 0.4)"
            : "0 12px 48px rgba(0, 0, 0, 0.15)",
      },
    }),
    [theme?.palette?.mode, isMobileView]
  );

  // Memoize DataGrid styles
  const dataGridStyles = useMemo(
    () => ({
      height: "500px",
      border: "none",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(25, 118, 210, 0.05)",
        color:
          theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.main,
        fontWeight: "bold",
      },
      "& .MuiDataGrid-cell": {
        transition: "background-color 0.2s ease",
        direction: "rtl",
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(25, 118, 210, 0.08)",
      },
      "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
        outline: "none",
      },
      "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
      {
        outline: "none",
      },
    }),
    [
      theme.palette.mode,
      theme.palette.primary.light,
      theme.palette.primary.main,
    ]
  );

  // Memoize slots object
  const slots = useMemo(
    () => ({
      noRowsOverlay: CustomNoRowsOverlay,
    }),
    []
  );

  // Memoize column visibility model
  const columnVisibilityModel = useMemo(
    () => ({
      stagnant_id: false,
      id: false,
    }),
    []
  );

  // Memoize initial state
  const initialState = useMemo(
    () => ({
      pagination: {
        paginationModel: { pageSize: limit },
      },
    }),
    [limit]
  );

  // Ensure selectionModel only contains at most 1 item for free DataGrid
  const singleSelectionModel = useMemo(() => {
    if (!selectionModel || !Array.isArray(selectionModel) || selectionModel.length === 0) {
      return [];
    }
    // Only keep the first/last selected item
    return selectionModel.slice(-1);
  }, [selectionModel]);

  // Memoize callbacks - Fixed to handle single selection only
  const handleRowSelectionChange = useCallback(
    (newSelection) => {
      // For free DataGrid, only keep the last selected item
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
    <Box sx={{ mt: 1 }}>
      <Paper sx={paperStyles}>
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
              initialState={initialState}
            />
          ) : (
            <StyledDataGrid
              slots={slots}
              sx={dataGridStyles}
              rows={rows}
              columns={columns}
              checkboxSelection={checkboxSelection}
              onRowSelectionModelChange={handleRowSelectionChange}
              // rowSelectionModel={singleSelectionModel}
              columnVisibilityModel={columnVisibilityModel}
              getRowId={getRowId}
              direction={rtl.dir}
              getRowHeight={() => "auto"}
              hideFooter={true}
              getRowClassName={getRowClassNameMemo}
              initialState={initialState}
              disableMultipleRowSelection={true}
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
      </Paper>
    </Box>
  );
};

export default memo(GridTemplate);