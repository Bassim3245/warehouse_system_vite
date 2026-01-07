import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import { useTheme, alpha } from "@mui/material/styles";


import { memo, useMemo, useCallback } from "react";

function CostumePagination({
  limit,
  page,
  totalItems,
  totalPages,
  setPage,
  setLimit,
  
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Memoize callbacks
  const handleChangePage = useCallback(
    (event, newPage) => {
      if (newPage) {
        setPage(newPage);
      }
    },
    [setPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      const newLimit = parseInt(event.target.value, 10);
      console.log("newLimit", newLimit);

      setLimit(newLimit);
      setPage(1);
    },
    [setLimit, setPage]
  );

  const handleTablePaginationChange = useCallback(
    (event, newPage) => {
      handleChangePage(event, newPage + 1);
    },
    [handleChangePage]
  );

  // Memoize paper styles
  const paperStyles = useMemo(
    () => ({
      overflow: "hidden",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      p: 1,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.8)
        : theme.palette.background.paper,
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: theme.shadows[3],
      },
    }),
    [
      isDark,
      theme.palette.background.paper,
      theme.palette.divider,
      theme.shadows,
    ]
  );

  // Memoize TablePagination styles
  const tablePaginationStyles = useMemo(
    () => ({
      color: theme.palette.text.primary,
      "& .MuiTablePagination-select": {
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderRadius: theme.shape.borderRadius,
        padding: "4px 8px",
        marginRight: 1,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
        "& .MuiSvgIcon-root": {
          color: theme.palette.primary.main,
        },
      },
      "& .MuiTablePagination-displayedRows": {
        display: "none",
      },
      "& .MuiToolbar-root .MuiTablePagination-actions": {
        display: "none",
      },
      "& .MuiTablePagination-selectLabel": {
        display: "none",
      },
    }),
    [
      theme.palette.text.primary,
      theme.palette.primary.main,
      theme.shape.borderRadius,
    ]
  );

  // Memoize Pagination styles
  const paginationStyles = useMemo(
    () => ({
      "& .MuiPaginationItem-root": {
        transition: "all 0.2s ease",
        fontWeight: 500,
        "&.Mui-selected": {
          fontWeight: 600,
          boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        },
      },
      "& .MuiPaginationItem-icon": {
        color: theme.palette.primary.main,
      },
    }),
    [theme.palette.primary.main]
  );

  return (
    <Box>
      <Paper elevation={2} dir="ltr" sx={paperStyles}>
        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1}
          onPageChange={handleTablePaginationChange}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage=""
          sx={tablePaginationStyles}
        />

        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          size="medium"
          shape="rounded"
          showFirstButton
          showLastButton
          sx={paginationStyles}
        />
      </Paper>
    </Box>
  );
}

export default memo(CostumePagination);
