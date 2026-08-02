import { memo, useMemo, useState, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme, alpha } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { CustomNoRowsOverlay } from "../../utils/Function";

// ── Row background color map (matches StyledDataGrid row highlighting) ──────
const ROW_BG_MAP = {
  "highlighted-row-ended": (palette) => alpha(palette.success.light, 0.2),
  "highlighted-row-CompleteProject": (palette) => alpha(palette.success.main, 0.2),
  "highlighted-row-expired": (palette) => alpha(palette.error.light, 0.2),
  "highlighted-row-near-expiration": (palette) => alpha(palette.warning.light, 0.2),
  "highlighted-row-odd": (palette) => alpha(palette.warning.light, 0.1),
  "highlighted-row-copy": (palette) => alpha(palette.info.light, 0.1),
};

/**
 * CustomDataTable — A fully custom data table built from MUI Table primitives.
 * Designed to be a drop-in replacement for StyledDataGrid inside GridTemplate.
 *
 * Props mirror the DataGrid API used in the codebase:
 *  columns            — array of { field, headerName, flex?, width?, renderCell?, sortable? }
 *  rows               — array of data objects
 *  getRowId           — fn(row) => id
 *  getRowClassName    — fn(params: { row }) => class string
 *  checkboxSelection  — boolean
 *  selectionModel     — array of selected row IDs
 *  onRowSelectionModelChange — fn(newModel)
 *  columnVisibilityModel     — { [field]: false } hides that column
 *  direction          — "rtl" | "ltr"
 */
const CustomDataTable = ({
  columns = [],
  rows = [],
  getRowId = (row) => row.id ?? row.index,
  getRowClassName,
  checkboxSelection = false,
  selectionModel = [],
  onRowSelectionModelChange,
  columnVisibilityModel = { id: false, stagnant_id: false },
  direction = "rtl",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const mainColor = theme.palette.primary.main;
  const isRtl = direction === "rtl";

  // ── Sort state ────────────────────────────────────────────────────────────
  const [sortConfig, setSortConfig] = useState({ field: null, order: "asc" });

  const handleSort = useCallback((field, sortable) => {
    if (sortable === false) return;
    setSortConfig((prev) =>
      prev.field === field
        ? { field, order: prev.order === "asc" ? "desc" : "asc" }
        : { field, order: "asc" }
    );
  }, []);

  // ── Visible columns ───────────────────────────────────────────────────────
  const visibleColumns = useMemo(
    () =>
      columns.filter(
        (col) => !(columnVisibilityModel[col.field] === false)
      ),
    [columns, columnVisibilityModel]
  );

  // ── Sorted rows ───────────────────────────────────────────────────────────
  const sortedRows = useMemo(() => {
    if (!sortConfig.field) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.field] ?? "";
      const bVal = b[sortConfig.field] ?? "";
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortConfig.order === "asc" ? cmp : -cmp;
    });
  }, [rows, sortConfig]);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const selectedSet = useMemo(() => new Set(selectionModel), [selectionModel]);

  const handleRowSelect = useCallback(
    (rowId) => {
      const next = selectedSet.has(rowId)
        ? selectionModel.filter((id) => id !== rowId)
        : [...selectionModel, rowId];
      onRowSelectionModelChange?.(next);
    },
    [selectedSet, selectionModel, onRowSelectionModelChange]
  );

  // ── Shared style values ───────────────────────────────────────────────────
  const headerBg = mainColor;
  const headerText = theme.palette.getContrastText(mainColor);
  const cellBorderColor = alpha(theme.palette.divider, 0.3);
  const fontFamily = "Cairo, sans-serif";

  const headerCellSx = {
    backgroundColor: headerBg,
    color: headerText,
    fontFamily,
    fontWeight: 600,
    fontSize: { xs: "12px", md: "13px", lg: "14px" },
    padding: { xs: "0 8px", md: "0 12px", lg: "0 18px" },
    height: { xs: "45px", md: "50px", lg: "65px" },
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
    textAlign: isRtl ? "right" : "left",
    direction: isRtl ? "rtl" : "ltr",
    borderBottom: "none",
    "&:hover": { backgroundColor: alpha(mainColor, 0.88) },
    transition: "background-color 0.2s ease",
  };

  const bodyCellSx = {
    fontFamily,
    fontSize: { xs: "12px", md: "13px", lg: "14px" },
    padding: { xs: "4px 8px", md: "6px 12px", lg: "10px 18px" },
    minHeight: { xs: "45px", md: "50px", lg: "65px" },
    borderBottom: `1px solid ${cellBorderColor}`,
    textAlign: isRtl ? "right" : "left",
    direction: isRtl ? "rtl" : "ltr",
    color: theme.palette.text.primary,
    wordBreak: "break-word",
    verticalAlign: "middle",
  };

  const getRowBg = useCallback(
    (row, index) => {
      if (getRowClassName) {
        const cls = getRowClassName({ row });
        for (const [key, fn] of Object.entries(ROW_BG_MAP)) {
          if (cls?.includes(key)) return fn(theme.palette);
        }
        if (cls?.includes("highlighted-row-even")) {
          return isDark
            ? alpha(theme.palette.common.white, 0.05)
            : alpha(theme.palette.primary.light, 0.05);
        }
      }
      return "transparent";
    },
    [getRowClassName, isDark, theme.palette]
  );

  const getRowHoverBg = useCallback(
    (row) => {
      if (getRowClassName) {
        const cls = getRowClassName({ row });
        if (cls?.includes("highlighted-row-ended")) return alpha(theme.palette.success.light, 0.3);
        if (cls?.includes("highlighted-row-expired")) return alpha(theme.palette.error.light, 0.3);
        if (cls?.includes("highlighted-row-near-expiration")) return alpha(theme.palette.warning.light, 0.3);
      }
      return isDark
        ? alpha(theme.palette.action.hover, 0.1)
        : alpha(theme.palette.action.hover, 0.07);
    },
    [getRowClassName, isDark, theme.palette]
  );

  // ── Sort icon ─────────────────────────────────────────────────────────────
  const SortIcon = ({ field }) => {
    const iconProps = { sx: { fontSize: 14, ml: isRtl ? 0 : 0.5, mr: isRtl ? 0.5 : 0, verticalAlign: "middle", color: headerText } };
    if (sortConfig.field !== field) return <UnfoldMoreIcon {...iconProps} />;
    return sortConfig.order === "asc"
      ? <ArrowUpwardIcon {...iconProps} />
      : <ArrowDownwardIcon {...iconProps} />;
  };

  return (
    <Box
      sx={{
        width: "100%",
        direction: isRtl ? "rtl" : "ltr",
        backgroundColor: isDark
          ? alpha(theme.palette.background.paper, 0.8)
          : theme.palette.background.paper,
        borderRadius:1,
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          maxHeight: 560,
          overflowX: "auto",
          overflowY: "auto",
          "&::-webkit-scrollbar": { height: "8px", width: "8px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(mainColor, 0.6),
            borderRadius: "4px",
            "&:hover": { backgroundColor: alpha(mainColor, 0.8) },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha(theme.palette.grey[300], 0.3),
            borderRadius: "4px",
          },
        }}
      >
        <Table stickyHeader size="medium" sx={{ minWidth: 400 }}>
          {/* ─── Header ──────────────────────────────────────────────── */}
          <TableHead>
            <TableRow>
              {checkboxSelection && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    ...headerCellSx,
                    width: 48,
                    "&.MuiTableCell-stickyHeader": { backgroundColor: headerBg },
                  }}
                />
              )}
              {visibleColumns.map((col) => (
                <TableCell
                  key={col.field}
                  onClick={() => handleSort(col.field, col.sortable)}
                  sx={{
                    ...headerCellSx,
                    width: col.width ?? "auto",
                    flex: col.flex,
                    "&.MuiTableCell-stickyHeader": { backgroundColor: headerBg },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: isRtl ? "row-reverse" : "row",
                      justifyContent: isRtl ? "flex-end" : "flex-start",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily,
                        fontWeight: 600,
                        fontSize: "inherit",
                        color: headerText,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.headerName}
                    </Typography>
                    {col.sortable !== false && <SortIcon field={col.field} />}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ─── Body ────────────────────────────────────────────────── */}
          <TableBody>
            {sortedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (checkboxSelection ? 1 : 0)}
                  sx={{ border: "none", p: 0 }}
                >
                  <Box
                    sx={{
                      minHeight: 200,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CustomNoRowsOverlay />
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedRows.map((row, index) => {
                const rowId = getRowId(row);
                const isSelected = selectedSet.has(rowId);
                const rowBg = getRowBg(row, index);
                const rowHoverBg = getRowHoverBg(row);

                return (
                  <TableRow
                    key={rowId}
                    selected={isSelected}
                    onClick={checkboxSelection ? () => handleRowSelect(rowId) : undefined}
                    sx={{
                      backgroundColor: rowBg,
                      transition: "background-color 0.15s ease",
                      cursor: checkboxSelection ? "pointer" : "default",
                      "&:hover": { backgroundColor: rowHoverBg },
                      "&:last-child td, &:last-child th": { borderBottom: "none" },
                      ...(isSelected && {
                        backgroundColor: alpha(mainColor, 0.1),
                        "&:hover": { backgroundColor: alpha(mainColor, 0.15) },
                      }),
                    }}
                  >
                    {checkboxSelection && (
                      <TableCell padding="checkbox" sx={{ borderBottom: `1px solid ${cellBorderColor}` }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleRowSelect(rowId)}
                          onClick={(e) => e.stopPropagation()}
                          size="small"
                          sx={{
                            color: mainColor,
                            "&.Mui-checked": { color: mainColor },
                          }}
                        />
                      </TableCell>
                    )}

                    {visibleColumns.map((col) => {
                      const value = row[col.field];
                      const content = col.renderCell
                        ? col.renderCell({ row, value, id: rowId })
                        : value != null
                        ? String(value)
                        : "";

                      return (
                        <TableCell
                          key={col.field}
                          sx={{
                            ...bodyCellSx,
                            width: col.width ?? "auto",
                          }}
                        >
                          {content}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default memo(CustomDataTable);
