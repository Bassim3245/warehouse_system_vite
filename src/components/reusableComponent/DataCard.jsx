import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";

import { alpha, useTheme } from "@mui/material/styles";

import { formatDateYearsMonth } from "../../utils/formatData";
import DropDownGrid from "./CustomMennu";
import UseFullScreen from "../../hooks/useFullScreen";
const DataCard = ({
  data,
  refreshKey,
  setRefreshKey,
  addButton,
  actionButtons,
  statusField = "status",
  nameField = "name",
  secondaryField = "user_name",
  locationField = "location",
  dateField = "created_at",
  extraFields = [],
  t,
  theme,
  hasAddPermission = true,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const defaultTheme = useTheme();
  const themeToUse = theme || defaultTheme;

  const getStatusColor = (status) => {
    if (status === "نشط" || status === "active") {
      return {
        bg: themeToUse.palette.success.light,
        color: themeToUse.palette.success.dark,
      };
    } else if (status === "تحت الصيانة") {
      return {
        bg: themeToUse.palette.warning.light,
        color: themeToUse.palette.warning.dark,
      };
    } else {
      return {
        bg: themeToUse.palette.error.light,
        color: themeToUse.palette.error.dark,
      };
    }
  };

  // Define table columns
  const columns = [
    { id: "index", label: "#", minWidth: 50, align: "center" },
    { id: nameField, label: t("الاسم"), minWidth: 150 },
    { id: secondaryField, label: t("أسم المدير"), minWidth: 150 },
    { id: locationField, label: t("الموقع"), minWidth: 120 },
    ...extraFields.map((field) => ({
      id: field.key,
      label: t(field.label),
      minWidth: 120,
    })),
    { id: dateField, label: t("تاريخ الادخال"), minWidth: 120 },
    { id: statusField, label: t("الحالة"), minWidth: 100, align: "center" },
    { id: "actions", label: t("الإجراءات"), minWidth: 100, align: "center" },
  ];

  return (
    <Box dir="rtl">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        {hasAddPermission && addButton}
        <UseFullScreen setRefreshButton={setRefreshKey} refreshing={refreshKey} />
      </Box>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${alpha(themeToUse.palette.divider, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(
            themeToUse.palette.primary.main,
            0.08
          )}`,
        }}
      >
        {(
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="data table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align || "right"}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: 600,
                          backgroundColor: alpha(
                            themeToUse.palette.primary.main,
                            0.05
                          ),
                          borderBottom: `2px solid ${themeToUse.palette.primary.main}`,
                          fontSize: "0.9rem",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    ?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    .map((item, index) => (
                      <TableRow
                        hover
                        key={item.id || index}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha(
                              themeToUse.palette.primary.main,
                              0.04
                            ),
                          },
                          "&:nth-of-type(even)": {
                            backgroundColor: alpha(
                              themeToUse.palette.background.default,
                              0.5
                            ),
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Index */}
                        <TableCell align="center" sx={{ fontWeight: 500 }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>

                        {/* Name */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: themeToUse.palette.text.primary,
                            }}
                          >
                            {item[nameField] || "------"}
                          </Typography>
                        </TableCell>

                        {/* Secondary Field */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item[secondaryField] || "------"}
                          </Typography>
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {item[locationField] || "------"}
                          </Typography>
                        </TableCell>

                        {/* Extra Fields */}
                        {extraFields.map((field) => (
                          <TableCell key={field.key}>
                            <Typography variant="body2" color="text.secondary">
                              {item[field.key] || "------"}
                            </Typography>
                          </TableCell>
                        ))}

                        {/* Date */}
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateYearsMonth(item[dateField])}
                          </Typography>
                        </TableCell>

                        {/* Status */}
                        <TableCell align="center">
                          <Chip
                            label={t(item[statusField])}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(item[statusField])
                                .bg,
                              color: getStatusColor(item[statusField]).color,
                              fontWeight: "bold",
                              fontSize: "0.75rem",
                              height: 24,
                            }}
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          {actionButtons && (
                            <DropDownGrid>
                              {actionButtons(item) || "------"}
                            </DropDownGrid>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {onPageChange && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={data?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                labelRowsPerPage={t("عدد الصفوف في الصفحة:")}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`
                }
                sx={{
                  borderTop: `1px solid ${themeToUse.palette.divider}`,
                  backgroundColor: alpha(
                    themeToUse.palette.background.default,
                    0.5
                  ),
                }}
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};
export default DataCard;
