import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ar";
import { getToken } from "../../../../../utils/handelCookie";
import { typeDocument } from "../../../../../constants/arrayFuction";
import Loader from "../../../../../components/reusableComponent/Loader";
import AnnualInventoryModel from "../annual/ComplmentAnnualInventory";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import { documentArchiveMonthlyGrid } from "../../../../../utils/ColumnsGridData";
import GridTemplate from "../../../../../components/reusableComponent/GridTemplet";
import { BackendUrl } from "../../../../../redux/api/axios";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import usePermissionUser from "../../../../../hooks/usePermissionUser";
import RefreshButtonData from "../../../../../components/reusableComponent/RefreshButton";
import { useTranslation } from "react-i18next";
import { useInventoryArchiveMonthly } from "../hook/useInventory";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import layoutStyle from "../../../../../style/layoutStyle";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Chip, InputAdornment, TextField, Typography } from "@mui/material";
import { Warehouse } from "@mui/icons-material";
import { Search } from "lucide-react";
import useGetAllWarehouse from "../../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";


const DocumentTypeButton = React.memo(({ docType, isActive, onClick }) => (
  <Button
    variant={isActive ? "contained" : "outlined"}
    size="small"
    onClick={() => onClick(docType.value)}
  >
    {docType?.label}
  </Button>
));

DocumentTypeButton.displayName = "DocumentTypeButton";

const MonthlyInventory = () => {
  const token = getToken();
  const { t } = useTranslation();
  const { roles, applicationPermission, dataUserById } = usePermissionUser();
  const { wareHouseData } = useGetAllWarehouse();
  const {
    setSelectedDate,
    selectedDate,
    refreshKey,
    setRefreshKey,
    selectedMonth,
    selectedYear,
    filterDocumentType,
    setFilterDocumentType,
    selectedWarehouse,
    setSelectedWarehouse,
    rtl,
  } = useInventoryArchiveMonthly();

  // State management
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [documentArchiveMonthly, setDocumentArchiveMonthly] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Refs for cleanup and debouncing
  const abortControllerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Handle warehouse change - triggers data refresh
  const handleWarehouseChange = useCallback(
    (event, newValue) => {
      const newId = newValue?.id || "";
      setSelectedWarehouse(newId);
      setPage(1); // Reset to first page
      setRefreshKey((prev) => prev + 1); // Trigger data refresh
    },
    [setSelectedWarehouse, setRefreshKey]
  );

  // Handle search change with debouncing
  const handleSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(1); // Reset to first page when searching
  }, []);

  // Memoized query parameters to prevent unnecessary re-calculations
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (dataUserById?.entity_id)
      params.append("entity_id", String(dataUserById.entity_id));
    if (selectedYear) params.append("selectedYear", String(selectedYear));
    if (selectedMonth) params.append("selectedMonth", String(selectedMonth));
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (filterDocumentType && filterDocumentType !== "") {
      params.append("filterDocumentType", String(filterDocumentType));
    }
    if (selectedWarehouse) params.append("warehouseId", String(selectedWarehouse));
    if (searchTerm && searchTerm.trim() !== "") {
      params.append("searchTerm", searchTerm.trim());
    }
    return params.toString();
  }, [
    dataUserById?.entity_id,
    selectedYear,
    selectedMonth,
    page,
    limit,
    filterDocumentType,
    selectedWarehouse,
    searchTerm,
  ]);

  const memoWarehouseOptions = useMemo(
    () => wareHouseData || [],
    [wareHouseData]
  );

  const selectedWarehouseObj = useMemo(
    () => memoWarehouseOptions.find((w) => w.id === selectedWarehouse) || null,
    [memoWarehouseOptions, selectedWarehouse]
  );

  // Set default warehouse to first warehouse when data loads
  useEffect(() => {
    if (memoWarehouseOptions.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(memoWarehouseOptions[0].id);
    }
  }, [memoWarehouseOptions, selectedWarehouse, setSelectedWarehouse]);

  // Optimized API call with debouncing and abort controller
  const fetchDocumentData = useCallback(async () => {
    try {
      // Clear previous error
      setError(null);

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setDataLoaded(true);

      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getDocumentArchiveMonthly?${queryParams}`,
        {
          headers: { authorization: token },
          signal: abortControllerRef.current.signal,
        }
      );

      if (response?.data) {
        setDocumentArchiveMonthly(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 0);
        setTotalItems(response.data.pagination?.totalItems || 0);
      } else {
        setDocumentArchiveMonthly([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching document data:", error);
        setError("فشل في تحميل البيانات");
        setDocumentArchiveMonthly([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    } finally {
      setDataLoaded(false);
    }
  }, [queryParams, token, searchTerm, selectedWarehouse, selectedMonth, selectedYear, filterDocumentType, page, limit]);



  // Effect with proper cleanup
  useEffect(() => {
    fetchDocumentData();
  }, [
    fetchDocumentData
  ]);
  const openMovement = useCallback(
    (id) => {
      navigate(
        `${filterDocumentType === "in" ? "inventory-import-archive-monthly" : "inventory-export-archive-monthly"}?documentId=${id}&documentType=${filterDocumentType}&warehouseId=${selectedWarehouse}`
      );
    },
    [navigate, filterDocumentType, selectedWarehouse]
  );
  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate && newDate.isValid()) {
        setSelectedDate(newDate);
        setPage(1); // Reset page when date changes
      }
    },
    [setSelectedDate]
  );

  // Memoized columns to prevent re-calculation on every render
  const columns = useMemo(
    () =>
      documentArchiveMonthlyGrid({
        t,
        roles,
        applicationPermission,
        setRefreshKey,
        token,
        document,
        openMovement,
        documentLabel: `${filterDocumentType === "int" ? "المواد الواردة" : filterDocumentType === "internal_consumption" ? "صرف داخلي" : "صرف خارجي"}`,
        documentType: filterDocumentType,
        warehouseId: selectedWarehouse,
      }),
    [t, roles, applicationPermission, setRefreshKey, token, filterDocumentType, openMovement]
  );

  // Memoized rows data
  const rows = useMemo(
    () =>
      documentArchiveMonthly?.map((item, index) => ({
        index: (page - 1) * limit + index + 1, // Correct index calculation for pagination
        ...item,
      })) || [],
    [documentArchiveMonthly, page, limit]
  );

  // Memoized refresh button click handler
  const handleRefreshClick = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, [setRefreshKey]);

  // Memoized page handlers
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  }, []);

  return (
    <Box sx={{ ...layoutStyle }} dir="rtl">
      {dataLoaded && <Loader />}
      <Box sx={{ mb: 2 }}>
        <Header title="المستندات المؤرشفة الشهرية" dir={rtl.dir} />
      </Box>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 2.3 }}>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <AnnualInventoryModel
              documentArchiveMonthly={documentArchiveMonthly}
              dataUserById={dataUserById}
              dir={rtl}
            />
            <UseFullScreen
              setRefreshButton={setRefreshKey}
              refreshing={refreshKey}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="document-type-label">نوع المستند</InputLabel>
            <Select
              labelId="document-type-label"
              value={filterDocumentType}
              label="نوع المستند"
              onChange={(e) => setFilterDocumentType(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              {typeDocument?.map((docType) => (
                <MenuItem key={docType.value} value={docType.value}>
                  {docType?.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Autocomplete
            fullWidth
            options={memoWarehouseOptions}
            getOptionLabel={(option) => option?.name || ""}
            value={selectedWarehouseObj}
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

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            placeholder="بحث بستخدام رقم المستند او الجهة المستفيدة ..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
            <DatePicker
              label="اختر الشهر والسنة"
              views={["month", "year"]}
              openTo="month"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  InputProps: {
                    sx: { borderRadius: 2 },
                  },
                },
                layout: {
                  sx: {
                    ".MuiPickersCalendarHeader-root": { direction: "rtl" },
                    ".MuiDayCalendar-header": { direction: "rtl" },
                    ".MuiDayCalendar-monthContainer": { direction: "rtl" },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      {/* Data Table */}
      <GridTemplate
        rows={rows}
        page={page}
        limit={limit}
        setPage={handlePageChange}
        setLimit={handleLimitChange}
        setTotalItems={setTotalItems}
        totalItems={totalItems}
        setTotalPages={setTotalPages}
        totalPages={totalPages}
        columns={columns}
        btn={<RefreshButtonData onClick={handleRefreshClick} />}
        isPagination={true}
      />
    </Box >
  );
};

export default React.memo(MonthlyInventory);
