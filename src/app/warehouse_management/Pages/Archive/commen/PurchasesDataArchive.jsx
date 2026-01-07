import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";

import "dayjs/locale/ar";

import Loader from "../../../../../components/reusableComponent/Loader";
import {
  CustomNoRowsOverlay,
  getHeaderStyle,
} from "../../../../../utils/Function";
import {
  StyledPaper,
  StyledTableCell,
} from "../../../../../style/generalStyle";
import DisplayInformationArchiveMaterial from "../showDailogInfMaterialArchive";
import DropDownGrid from "../../../../../components/reusableComponent/CustomMennu";
import { setPagination } from "../../../../../redux/InventiryArchive/InventoryArchiveSlice";
import CostumePagination from "../../../../../components/reusableComponent/CostumPagination";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";

const ImportArchiveMonthly = ({ InventoryArchiveData, loading, theme, setRefreshKey ,isInternalTransfer}) => {
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
      <StyledPaper>
        <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  أسم المادة
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  رمز المادة
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  كمية المادة
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  كمية المتبقية
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  وحدة القياس
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  المواصفات الفنية
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  تاريخ شراء المادة
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  المعمل
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  المصنع
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  الحالة
                </StyledTableCell>
                <StyledTableCell sx={getHeaderStyle(theme)}>
                  الإجراءات
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {InventoryArchiveData && InventoryArchiveData.length > 0 ? (
                InventoryArchiveData.map((item, index) => (
                  <TableRow key={item?.id || index} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {item.name_of_material || "غير محدد"}
                      </Box>
                    </TableCell>
                    <TableCell>{item.cod_material || "غير محدد"}</TableCell>
                    <TableCell>{item.quantity || "0"}</TableCell>
                    <TableCell>{item.remaining_quantity || "0"}</TableCell>
                    <TableCell>{item.measuring_unit || "غير محدد"}</TableCell>
                    <TableCell>{item.specification || "غير محدد"}</TableCell>
                    <TableCell>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("ar-IQ")
                        : "غير محدد"}
                    </TableCell>
                    <TableCell>
                      {item?.Laboratory_name || "-----"}
                    </TableCell>
                    <TableCell>
                      {item?.Factories_name || "-----"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item?.state_name || "غير محدد"}
                        color="success"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <DropDownGrid>
                        {/* <ModelEditImportData inventoryData={item} setRefreshButton={setRefreshButton} />
                        <Divider /> */}

                        <DisplayInformationArchiveMaterial
                          dataItem={item}
                          isExport={false}
                        />
                      </DropDownGrid>


                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11}>
                    <CustomNoRowsOverlay />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <CostumePagination
          page={pagination?.page}
          totalPages={pagination?.totalPages}
          totalItems={pagination?.total}
          limit={pagination?.limit}
          setPage={handlePageChange}
          setLimit={handleLimitChange}
        />
      </StyledPaper>
    </>
  );
};

export default ImportArchiveMonthly;
