import React, { useMemo, useCallback } from "react";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Inventory2 from "@mui/icons-material/Inventory2";
import LockOutlined from "@mui/icons-material/LockOutlined";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Warehouse from "@mui/icons-material/Warehouse";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import Loader from "../../../../../components/reusableComponent/Loader";
import DropDownGrid from "../../../../../components/reusableComponent/CustomMennu";

import {
  CustomNoRowsOverlay,
  getHeaderStyle,
  renderMenuItem,
} from "../../../../../utils/Function";

import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../style/generalStyle";

import {
  formatCurrency,
  formatDateAr,
} from "../../../../../utils/formatData";
import DocumentModel from "./DoucumentModel";
import { usePermissionsStructure } from "../../../../../hooks/useStructureCompany";
import MonthlyInventory from "../../Archive/monthly/ComplmentMontlyInventory";
import useInventoryDocuments from "../../../../../hooks/invantory/useInventoryDocuments";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import useGetfactoryInformationByUserId from "../../../../../hooks/ManageWarehouseSetting/useGetfactoryInformationByUserId";
import useGetAllWarehouse from "../../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { typeDocument } from "../../../../../constants/arrayFuction";
import { useTranslation } from "react-i18next";
import { InputAdornment, MenuItem } from "@mui/material";
import { Search } from "@mui/icons-material";
import CostumePagination from "../../../../../components/reusableComponent/CostumPagination";

function Document({
  token,
  documentType,
  setRefreshButton,
  refreshButton,
  dataUserById,
  dataUserLab,
  title,
  navigateUrl,
  filedLabel,
  isExport = false,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    has_lab,
    has_factory,
    has_warehouse,
    has_production_warehouse,
  } = usePermissionsStructure();

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const { wareHouseData } = useGetAllWarehouse();

  const {
    documentTypeValue,
    setDocumentTypeValue,
    documentTypeLabel,
    loading,
    documentMaterials,
    warehosueId,
    handleWarehouseChange,
    openMovement,
    deleteDocument,
    completeItem,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination,
  } = useInventoryDocuments({
    token,
    navigateUrl,
    documentType,
    isExport,
    dataUserById,
    dataUserLab,
    wareHouseData,
    dataUserFactory,
    has_factory,
    has_lab,
    has_warehouse,
    refreshButton,
    setRefreshButton
  });

  // --------------------------------------
  //  Memoized Data
  // --------------------------------------

  const memoWarehouseOptions = useMemo(
    () => wareHouseData || [],
    [wareHouseData]
  );

  const selectedWarehouse = useMemo(
    () => memoWarehouseOptions.find((w) => w.id === warehosueId) || null,
    [memoWarehouseOptions, warehosueId]
  );

  const memoDocuments = useMemo(
    () => documentMaterials || [],
    [documentMaterials]
  );

  // --------------------------------------
  // 🧠 Memoized Event Handlers
  // --------------------------------------

  const handleDocDelete = useCallback(
    (id) => deleteDocument(id),
    [deleteDocument]
  );
  const handleDocComplete = useCallback(
    (id, is_complete) => completeItem(id, is_complete),
    [completeItem]
  );

  const renderRowMenu = useCallback(
    (item) => (
      <DropDownGrid
        GridTheme={{
          paperColor: "#ffffff",
          paperTextColor: "#333333",
          gloablTextColor: "#666666",
        }}
      >
        {renderMenuItem(
          "informationProduct",
          () => openMovement(item.id),
          OpenInNew,
          documentTypeLabel
        )}
        <Divider />
        {renderMenuItem(
          "delete",
          () => handleDocDelete(item.id),
          DeleteOutlined,
          "حذف"
        )}
        <Divider />
        <DocumentModel
          documentType={documentTypeValue}
          editMode
          user_id={dataUserById?.user_id}
          entity_id={dataUserById?.entity_id}
          setRefreshButton={setRefreshButton}
          dataUserLab={dataUserLab}
          documentData={item}
          filedLabel={filedLabel}
          wareHouseData={memoWarehouseOptions}
          dataUserFactory={dataUserFactory}
          has_factory={has_factory}
          has_production_warehouse={has_production_warehouse}
          has_warehouse={has_warehouse}
          has_lab={has_lab}
        />
        <Divider />

        {!item.is_complete &&
          renderMenuItem(
            "complete",
            () => handleDocComplete(item.id, item.is_complete),
            LockOutlined,
            "قفل المستند"
          )}
      </DropDownGrid>
    ),
    [
      openMovement,
      handleDocDelete,
      handleDocComplete,
      documentTypeValue,
      dataUserById,
      dataUserLab,
      filedLabel,
      memoWarehouseOptions,
      dataUserFactory,
      has_factory,
      has_lab,
      has_warehouse,
      has_production_warehouse,
      setRefreshButton,
      documentTypeLabel
    ]
  );

  // --------------------------------------
  // JSX
  // --------------------------------------

  return (
    <div className="m-2" dir="rtl">
      {loading && <Loader />}

      <Header title={title} icon={<Inventory2 />} dir="rtl" />

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
        <DocumentModel
          documentTypeValue={documentTypeValue}
          editMode={false}
          dataUserById={dataUserById}
          entity_id={dataUserById?.entity_id}
          setRefreshButton={setRefreshButton}
          dataUserLab={dataUserLab}
          filedLabel={filedLabel}
          dataUserFactory={dataUserFactory}
          has_factory={has_factory}
          has_production_warehouse={has_production_warehouse}
          has_warehouse={has_warehouse}
          has_lab={has_lab}
          wareHouseData={memoWarehouseOptions}
          documentType={documentType}
          isExport={isExport}
        />

        <MonthlyInventory
          documentMaterials={memoDocuments}
          dataUserById={dataUserById}
        />

        <UseFullScreen
          setRefreshButton={setRefreshButton}
          refreshing={refreshButton}
        />
      </Box>

      <Grid container spacing={1} alignItems="center" dir="rtl">
        {isExport && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              name="documentType"
              label="نوع المستند"
              value={documentTypeValue}
              onChange={(e) => setDocumentTypeValue(e.target.value)}
              fullWidth
              select
            >
              {typeDocument
                .filter((item) =>
                  ["internal_consumption", "out"].includes(item.value)
                )
                .map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

        )}

        <Grid size={{ xs: 12, sm: 4 }}>
          <Autocomplete
            fullWidth
            options={memoWarehouseOptions}
            getOptionLabel={(option) => option?.name || ""}
            value={selectedWarehouse}
            onChange={handleWarehouseChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="تصفية حسب المخزن"
                placeholder="اختر مخزن للتصفية أو اتركه فارغاً لعرض الكل..."
                sx={{ borderRadius: 2 }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                key={option.id}
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                }}
              >
                <Warehouse sx={{ color: "primary.main", fontSize: 18 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.location} - {option.user_name}
                  </Typography>
                </Box>
                <Chip
                  label={option.status}
                  color={option.status === "ممتلئ" ? "error" : "success"}
                  size="small"
                />
              </Box>
            )}
            noOptionsText="لا توجد مخازن"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            placeholder="بحث بستخدام رقم المستند ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

      </Grid>

      <Card sx={{ mb: 1 }}>
        <CardContent>
          <TableContainer dir="rtl">
            <Table>
              <TableHead>
                <TableRow sx={getHeaderStyle(theme)}>
                  {[
                    "#",
                    "رقم المستند",
                    "حالة",
                    "تاريخ المستند",
                    "تاريخ الإدخال",
                    "نوع المستند",
                    "الجهة",
                    "المخزن",
                    "المبلغ",
                    "ملاحظات",
                    "إجراءات",
                  ].map((title, idx) => (
                    <StyledTableCell key={idx} sx={getHeaderStyle(theme)}>
                      {title}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {memoDocuments?.length > 0 ? (
                  memoDocuments?.map((item, index) => (
                    <StyledTableRow key={item?.id}>
                      <StyledTableCell>{index + 1}</StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          label={item?.document_number}
                          size="small"
                          color="primary"
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        <Chip
                          label={item?.is_complete ? "مكتمل" : "غير مكتمل"}
                          size="small"
                          color={item?.is_complete ? "success" : "warning"}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        {formatDateAr(item?.document_date)}
                      </StyledTableCell>

                      <StyledTableCell>
                        {formatDateAr(item?.created_at)}
                      </StyledTableCell>

                      <StyledTableCell>
                        {item?.document_type === "internal_transfer"
                          ? "مستند نقل داخلي"
                          : item?.document_type === "out"
                            ? "مستند تصدير"
                            : item?.document_type === "in"
                              ? "مستند وارد"
                              : "مستند صادر"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item?.beneficiary || "-"}
                      </StyledTableCell>

                      <StyledTableCell>
                        {item?.warehouse_name || "-"}
                      </StyledTableCell>

                      <StyledTableCell>
                        {formatCurrency(item?.total_amount || 0)}
                      </StyledTableCell>

                      <StyledTableCell>
                        {item?.description || "-"}
                      </StyledTableCell>

                      <StyledTableCell>{renderRowMenu(item)}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={11}>
                      <CustomNoRowsOverlay />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CostumePagination
            page={pagination?.page}
            totalPages={pagination?.totalPages}
            totalItems={pagination?.total}
            limit={pagination?.limit}
            setPage={(page) => setPagination({ ...pagination, page })}
            setLimit={(limit) => setPagination({ ...pagination, limit })}
          />
        </CardContent>
      </Card>

      <Card dir="rtl">
        <CardContent>
          <Typography>
            {t("عدد المواد الموجودة في الجدول")} ({memoDocuments.length})
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default React.memo(Document);
