import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Inventory2 from "@mui/icons-material/Inventory2";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
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
import { useTheme } from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import {
  Search,
  Title,
  FilterList,
  Close,
  RestartAlt,
  CalendarMonth
} from "@mui/icons-material";
import {
  InputAdornment,
  Drawer,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";

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
import { formatCurrency, formatDateAr } from "../../../../../utils/formatData";
import DocumentModel from "./DoucumentModel";
import { usePermissionsStructure } from "../../../../../hooks/useStructureCompany";
import useInventoryDocuments from "../../../../../hooks/invantory/useInventoryDocuments";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import useGetfactoryInformationByUserId from "../../../../../hooks/ManageWarehouseSetting/useGetfactoryInformationByUserId";
import useGetAllWarehouse from "../../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { useTranslation } from "react-i18next";
import CostumePagination from "../../../../../components/reusableComponent/CostumPagination";
import { ButtonTheme } from "../../../../../style/ButtomStyle";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const buildFieldMap = (fieldValues = []) =>
  fieldValues.reduce((acc, fv) => {
    acc[fv.field_key] = fv.value;
    return acc;
  }, {});

const extractDynamicColumns = (documents = []) => {
  const seen = new Map();
  documents.forEach((doc) => {
    (doc.field_values || []).forEach(({ field_key, field_label, display_order }) => {
      if (!seen.has(field_key)) {
        seen.set(field_key, { field_label, display_order });
      }
    });
  });
  return Array.from(seen.entries())
    .sort((a, b) => a[1].display_order - b[1].display_order)
    .map(([field_key, { field_label }]) => ({ field_key, field_label }));
};

// ─── Loading skeleton for table rows ─────────────────────────────────────────
const TableSkeleton = ({ cols = 8 }) => (
  <>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        {[...Array(cols)].map((__, j) => (
          <StyledTableCell key={j}>
            <Skeleton variant="text" width="80%" />
          </StyledTableCell>
        ))}
      </TableRow>
    ))}
  </>
);

function Document({
  token,
  documentType,
  documentTypeLabel: initialDocumentTypeLabel,
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
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { has_lab, has_factory, has_warehouse, has_production_warehouse } =
    usePermissionsStructure();

  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const { wareHouseData, loading: warehouseLoading } = useGetAllWarehouse();

  const {
    documentTypeValue,
    documentTypeLabel,
    loading,
    documentMaterials,
    warehosueId,
    handleWarehouseChange,
    handleLimitChange,
    openMovement,
    deleteDocument,
    completeItem,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateFilterType,
    setDateFilterType,
    pagination,
    setPagination,

  } = useInventoryDocuments({
    token,
    navigateUrl,
    documentType,
    documentTypeLabel: initialDocumentTypeLabel,
    isExport,
    dataUserById,
    dataUserLab,
    wareHouseData,
    dataUserFactory,
    has_factory,
    has_lab,
    has_warehouse,
    refreshButton,
    setRefreshButton,
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate(null);
    setEndDate(null);
    setDateFilterType("document_date");
  };

 

  // ─── Memoized Data ────────────────────────────────────────────────────────
  const memoWarehouseOptions = useMemo(() => wareHouseData || [], [wareHouseData]);

  // ✅ FIX: isOptionEqualToValue ensures Autocomplete finds the saved option
  //         even if the object reference is different across renders
  const selectedWarehouse = useMemo(
    () => memoWarehouseOptions.find((w) => String(w.id) === String(warehosueId)) || null,
    [memoWarehouseOptions, warehosueId]
  );

  const memoDocuments = useMemo(() => documentMaterials || [], [documentMaterials]);

  const dynamicColumns = useMemo(
    () => extractDynamicColumns(memoDocuments),
    [memoDocuments]
  );

  const staticHeaders = [
    "#",
    "رقم المستند",
    "حالة",
    "تاريخ المستند",
    "تاريخ الإدخال",
    "الجهة",
    "المبلغ",
    "ملاحظات",
  ];

  const totalCols = staticHeaders.length + dynamicColumns.length + 1;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleDocDelete = useCallback((id) => deleteDocument(id), [deleteDocument]);
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
        {renderMenuItem("informationProduct", () => {
          navigate(`${navigateUrl}?id=${item.id}&documentType=${documentType}&warehouseId=${warehosueId}`);
        }, OpenInNew, title)}
        <Divider />
        {renderMenuItem("delete", () => handleDocDelete(item.id), DeleteOutlined, "حذف")}
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
        {renderMenuItem(
          item.is_complete ? "unlock" : "complete",
          () => handleDocComplete(item.id, item.is_complete),
          item.is_complete ? LockOpenOutlined : LockOutlined,
          item.is_complete ? "فتح القفل" : "قفل المستند"
        )}
      </DropDownGrid>
    ),
    [
      openMovement, handleDocDelete, handleDocComplete,
      documentTypeValue, dataUserById, dataUserLab, filedLabel,
      memoWarehouseOptions, dataUserFactory, has_factory, has_lab,
      has_warehouse, has_production_warehouse, setRefreshButton, documentTypeLabel,
    ]
  );

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ m: 2 }} dir="rtl">
      <Header title={title} icon={<Inventory2 />} dir="rtl" />

      {/* ── Action Bar ────────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
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
        {/* <MonthlyInventory documentMaterials={memoDocuments} dataUserById={dataUserById} /> */}
        <UseFullScreen setRefreshButton={setRefreshButton} refreshing={refreshButton} />
      </Box>

      {/* ── Filters Card ──────────────────────────────────────────────────── */}
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderRadius: 2,
          background: theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.01)",
        }}
      >
        <CardContent sx={{ pb: "12px !important" }}>
          <Grid container spacing={2} alignItems="center" dir="rtl">
            <Grid size={{ xs: 12, sm: isExport ? 4 : 6 }}>
              <Autocomplete
                fullWidth
                options={memoWarehouseOptions}
                getOptionLabel={(option) => option?.name || ""}
                // ✅ KEY FIX: compare by id string so saved value is matched
                isOptionEqualToValue={(option, value) =>
                  String(option?.id) === String(value?.id)
                }
                value={selectedWarehouse}
                onChange={handleWarehouseChange}
                loading={warehouseLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="تصفية حسب المخزن"
                    placeholder="اختر مخزناً أو اتركه فارغاً لعرض الكل"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    key={option.id}
                    component="li"
                    {...props}
                    sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, px: 1.5 }}
                  >
                    <Warehouse sx={{ color: "primary.main", fontSize: 20, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {option.location} · {option.user_name}
                      </Typography>
                    </Box>
                    <Chip
                      label={option.status}
                      color={option.status === "ممتلئ" ? "error" : "success"}
                      size="small"
                      sx={{ flexShrink: 0 }}
                    />
                  </Box>
                )}
                noOptionsText="لا توجد مخازن"
              />
            </Grid>

            {/* Search */}
            <Grid size={{ xs: 12, sm: isExport ? 4 : 6 }}>
              <Stack direction="row" spacing={1}>
                <ButtonTheme
                  onClick={() => setIsFilterDrawerOpen(true)}
                  
                >
                  <FilterList />
                  تصفية متقدمة
                </ButtonTheme>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Filter Drawer ─────────────────────────────────────────────────── */}
      <Drawer
        anchor="left"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 350 }, p: 3 }
        }}
      >
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }} dir="rtl">
          <Typography variant="h6" fontWeight={700}>فلاتر متقدمة</Typography>
          <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3} dir="rtl">
          {/* Search by Doc Number */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>رقم المستند</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="بحث برقم المستند..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Date Filter Type */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontWeight: 600, fontSize: "0.875rem", mb: 1, color: "text.primary" }}>
              تصفية التاريخ بناءً على:
            </FormLabel>
            <RadioGroup
              value={dateFilterType}
              onChange={(e) => setDateFilterType(e.target.value)}
              row
            >
              <FormControlLabel 
                value="document_date" 
                control={<Radio size="small" />} 
                label={<Typography variant="body2">تاريخ المستند</Typography>} 
              />
              <FormControlLabel 
                value="created_at" 
                control={<Radio size="small" />} 
                label={<Typography variant="body2">تاريخ الإدخال</Typography>} 
              />
            </RadioGroup>
          </FormControl>

          {/* Start Date */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>تاريخ البدء</Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          {/* End Date */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>تاريخ الانتهاء</Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonth fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>

          <Box sx={{ pt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setIsFilterDrawerOpen(false)}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              تطبيق الفلاتر
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<RestartAlt />}
              onClick={handleResetFilters}
              sx={{ borderRadius: 2 }}
            >
              إعادة تعيين
            </Button>
          </Box>
        </Stack>
      </Drawer>

      {/* ── Documents Table ───────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <TableContainer dir="rtl">
            <Table size="small">
              <TableHead>
                <TableRow sx={getHeaderStyle(theme)}>
                  {staticHeaders.map((h, idx) => (
                    <StyledTableCell key={`s-${idx}`} sx={getHeaderStyle(theme)}>
                      {h}
                    </StyledTableCell>
                  ))}
                  {dynamicColumns.map(({ field_key, field_label }) => (
                    <StyledTableCell key={field_key} sx={getHeaderStyle(theme)}>
                      {field_label}
                    </StyledTableCell>
                  ))}
                  <StyledTableCell sx={getHeaderStyle(theme)}>إجراءات</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableSkeleton cols={totalCols} />
                ) : memoDocuments.length > 0 ? (
                  memoDocuments.map((item, index) => {
                    const fieldMap = buildFieldMap(item.field_values);
                    return (
                      <StyledTableRow
                        key={item.id}
                        sx={{
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(255,255,255,0.04)"
                                : "rgba(0,0,0,0.02)",
                          },
                        }}
                      >
                        <StyledTableCell>
                          <Typography variant="caption" color="text.secondary">
                            {(pagination.page - 1) * pagination.limit + index + 1}
                          </Typography>
                        </StyledTableCell>

                        <StyledTableCell>
                          <Chip
                            label={item.document_number}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <Chip
                            label={item.is_complete ? "مكتمل" : "غير مكتمل"}
                            size="small"
                            color={item.is_complete ? "success" : "warning"}
                          />
                        </StyledTableCell>

                        <StyledTableCell>{formatDateAr(item.document_date)}</StyledTableCell>
                        <StyledTableCell>{formatDateAr(item.created_at)}</StyledTableCell>
                        <StyledTableCell>{item.beneficiary || "—"}</StyledTableCell>
                        <StyledTableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {formatCurrency(item.total_amount || 0)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ maxWidth: 160, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                            title={item.description}
                          >
                            {item.description || "—"}
                          </Typography>
                        </StyledTableCell>

                        {dynamicColumns.map(({ field_key }) => (
                          <StyledTableCell key={field_key}>
                            {fieldMap[field_key] ?? "—"}
                          </StyledTableCell>
                        ))}

                        <StyledTableCell>{renderRowMenu(item)}</StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <StyledTableCell colSpan={totalCols}>
                      <CustomNoRowsOverlay />
                    </StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ px: 2, py: 1 }}>
            <CostumePagination
              page={pagination?.page}
              totalPages={pagination?.totalPages}
              totalItems={pagination?.total}
              limit={pagination?.limit}
              setPage={(page) => setPagination((prev) => ({ ...prev, page }))}
              setLimit={(limit) => handleLimitChange(limit)}
            />
          </Box>
        </CardContent>
      </Card>

      {/* ── Summary Footer ────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 2 }} dir="rtl">
        <CardContent sx={{ py: "10px !important" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {t("عدد المواد الموجودة في الجدول")}
            </Typography>
            <Chip
              label={memoDocuments.length}
              size="small"
              color="primary"
              variant="outlined"
            />
            {pagination.total > 0 && (
              <Typography variant="caption" color="text.secondary">
                من أصل {pagination.total} مستند
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default React.memo(Document);