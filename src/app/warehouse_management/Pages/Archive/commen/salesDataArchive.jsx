import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  getHeaderStyle,
} from "../../../../../utils/Function";
import {
  StyledPaper,
  StyledTableCell,
} from "../../../../../style/generalStyle";
import "dayjs/locale/ar";
import Loader from "../../../../../components/reusableComponent/Loader";
import {
  TableCell,
  Divider
} from "@mui/material";
import layoutStyle from "../../../../../style/layoutStyle";
import DisplayInformationArchiveMaterial from "../showDailogInfMaterialArchive";
import InventoryExportModel from "../../Inventory/selas/components/ExportInventoryModel";
import DropDownGrid from "../../../../../components/reusableComponent/CustomMennu";
import CostumePagination from "../../../../../components/reusableComponent/CostumPagination";
import { setPagination } from "../../../../../redux/InventiryArchive/InventoryArchiveSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

const ExportArchiveMonthly = ({ InventoryArchiveData, setRefreshKey, loading, theme, isPagna = true, isInternalTransfer }) => {
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.inventoryArchive.pagination);

  const handlePageChange = useCallback((page) => {
    dispatch(setPagination({ ...pagination, page }));
    setRefreshKey((prev) => !prev);
  }, [dispatch, pagination, setRefreshKey]);

  const handleLimitChange = useCallback((limit) => {
    dispatch(setPagination({ ...pagination, limit, page: 1 }));
    setRefreshKey((prev) => !prev);
  }, [dispatch, pagination, setRefreshKey]);

  return (
    <>
      {loading && <Loader />}
      <Box sx={{ ...layoutStyle }} dir="rtl">
        <StyledPaper>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    رمز المادة
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    اسم المادة
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    الكمية
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    المعمل
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    المصنع
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    السعر
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    الاجمالي
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    التاريخ
                  </StyledTableCell>
                  <StyledTableCell sx={getHeaderStyle(theme)}>
                    الاجراء
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {InventoryArchiveData?.length > 0 ? (
                  InventoryArchiveData.map((item, index) => (
                    <TableRow
                      key={`${item.id}-${item.inventory_export_id}-${index}`}
                      sx={{
                        bgcolor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                        borderBottom: "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor: "#f0f7ff",
                          transition: "background-color 0.2s ease",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Box
                          sx={{
                            display: "inline-block",
                            padding: "4px 8px",
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            fontWeight: "600",
                            fontSize: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #1976d2",
                          }}
                        >
                          {item?.cod_material}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                          borderRight: "1px solid #e0e0e0",
                          maxWidth: 200,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            wordBreak: "break-word",
                            color: "#333333",
                            fontWeight: "500",
                          }}
                        >
                          {item?.name_of_material}
                        </Typography>
                        {item?.specification && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#666666",
                              fontSize: "0.7rem",
                              display: "block",
                              fontStyle: "italic",
                            }}
                          >
                            {item?.specification}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "600",
                            color: "#2e7d32",
                            fontSize: "0.875rem",
                          }}
                        >
                          {parseFloat(item?.total_quantity).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666666",
                            fontSize: "0.75rem",
                            display: "block",
                          }}
                        >
                          {item?.measuring_unit}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item?.Laboratory_name || "-----"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item?.Factories_name || "-----"}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#1976d2",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                          }}
                        >
                          {parseFloat(item?.price).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666666",
                            fontSize: "0.75rem",
                            display: "block",
                          }}
                        >
                          دينار
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                          borderRight: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#d32f2f",
                            fontWeight: "700",
                            fontSize: "0.875rem",
                          }}
                        >
                          {parseFloat(item?.total_amount).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666666",
                            fontSize: "0.75rem",
                            display: "block",
                          }}
                        >
                          دينار
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666666",
                            fontSize: "0.7rem",
                          }}
                        >
                          {new Date(item?.export_date).toLocaleDateString("ar-IQ")}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          padding: "12px",
                        }}
                      >
                        <DropDownGrid>
                          <InventoryExportModel inventoryData={item} setRefreshButton={setRefreshKey}

                            isInternalTransfer={isInternalTransfer} />
                          <Divider />

                          <DisplayInformationArchiveMaterial
                            dataItem={item}
                            isExport={true}
                          />
                        </DropDownGrid>

                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        لا توجد بيانات للعرض
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {
            isPagna && (
              <CostumePagination
                page={pagination?.page}
                totalPages={pagination?.totalPages}
                totalItems={pagination?.total}
                limit={pagination?.limit}
                setPage={handlePageChange}
                setLimit={handleLimitChange}
              />
            )
          }
        </StyledPaper>
      </Box>
    </>
  );
};

export default ExportArchiveMonthly;