import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
import UseFullScreen from "../../../../../hooks/useFullScreen";
import { documentArchiveMonthlyGrid } from "../../../../../utils/ColumnsGridData";
import GridTemplate from "../../../../../components/reusableComponent/GridTemplet";
import { BackendUrl } from "../../../../../redux/api/axios";
import { axiosInstance } from "../../../../../redux/api/axiosConfig";
import useUserPermissions from "../../../../../hooks/genaral/useUserPermissions";
import RefreshButtonData from "../../../../../components/reusableComponent/RefreshButton";
import { useTranslation } from "react-i18next";
import { useInventoryArchiveMonthly } from "../hook/useInventory";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import layoutStyle from "../../../../../style/layoutStyle";
import useUserData from "../../../../../hooks/genaral/useUserData";

const AnnualInventory = () => {
  const token = getToken();
  const { t } = useTranslation();
  const { roles, applicationPermission } = useUserPermissions();
  const { dataUserById } = useUserData();
  const [_, setAnchorEl] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [documentArchiveMonthly, setDocumentArchiveMonthly] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });

  const {
    setSelectedDate,
    selectedDate,
    refreshKey,
    setRefreshKey,
    selectedYear,
    filterDocumentType,
    setFilterDocumentType,
    rtl,
  } = useInventoryArchiveMonthly();

  // Memoize handleDateChange
  const handleDateChange = useCallback(
    (newDate) => {
      if (newDate?.isValid()) {
        setSelectedDate(newDate);
      }
    },
    [setSelectedDate]
  );

  // Memoize DatePicker slot props
  const datePickerSlotProps = useMemo(
    () => ({
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
    }),
    []
  );

  // Fetch document data
  useEffect(() => {
    const fetchDocumentData = async () => {
      try {
        setDataLoaded(true);
        const queryParams = new URLSearchParams();

        if (dataUserById?.entity_id) {
          queryParams.append("entity_id", String(dataUserById.entity_id));
        }
        if (selectedYear) {
          queryParams.append("selectedYear", String(selectedYear));
        }
        if (pagination?.page) {
          queryParams.append("page", String(pagination?.page));
        }
        if (pagination?.limit) {
          queryParams.append("limit", String(pagination?.limit));
        }
        if (filterDocumentType) {
          queryParams.append("filterDocumentType", String(filterDocumentType));
        }

        const response = await axiosInstance.get(
          `${BackendUrl}/api/warehouse/getDocumentArchiveAnnual?${queryParams.toString()}`,
          {
            headers: { authorization: token },
          }
        );

        if (response?.data) {
          setDocumentArchiveMonthly(response.data.data);
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalItems,
          });
        } else {
          setDocumentArchiveMonthly([]);
          setPagination({
            page: 1,
            limit: 10,
            totalPages: 0,
            totalItems: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
        setDocumentArchiveMonthly([]);
        setPagination({
          page: 1,
          limit: 10,
          totalPages: 0,
          totalItems: 0,
        });
      } finally {
        setDataLoaded(false);
      }
    };

    fetchDocumentData();
  }, [
    selectedYear,
    pagination.page,
    pagination.limit,
    refreshKey,
    filterDocumentType,
    dataUserById?.entity_id,
    token,
  ]);

  // Memoize columns
  const columns = useMemo(
    () =>
      documentArchiveMonthlyGrid({
        t,
        roles,
        applicationPermission,
        setRefreshKey,
        setAnchorEl,
        token,
        document,
      }),
    [t, roles, applicationPermission, setRefreshKey, token]
  );

  // Memoize rows data
  const rows = useMemo(
    () =>
      documentArchiveMonthly?.map((item, index) => ({
        index: index + 1,
        ...item,
      })) || [],
    [documentArchiveMonthly]
  );

  // Memoize layout styles
  const containerSx = useMemo(() => ({ ...layoutStyle }), []);
  const tableBoxSx = useMemo(() => ({ minWidth: "999px" }), []);
  const headerBoxSx = useMemo(() => ({ mb: 2 }), []);

  return (
    <Box sx={containerSx} dir="rtl">
      {dataLoaded && <Loader />}

      <Box sx={headerBoxSx}>
        <Header title=" المستندات المؤرشفة السنوية " dir={"rtl"} />
      </Box>

      {/* Controls */}
      <Grid container spacing={1}>
        <Grid size={{ xs: 1 }}>
          <UseFullScreen
            setRefreshButton={setRefreshKey}
            refreshing={refreshKey}
          />
        </Grid>
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
        <Grid size={{ xs: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
            <DatePicker
              label="اختر الشهر والسنة"
              views={["year", "month"]}
              openTo="year"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ width: "100%" }}
              slotProps={datePickerSlotProps}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box dir="rtl" sx={tableBoxSx}>
        <GridTemplate
          rows={rows}

          page={pagination.page}
          limit={pagination.limit}
          totalItems={pagination.totalItems}
          totalPages={pagination.totalPages}

          setPage={(page) =>
            setPagination((prev) => ({ ...prev, page }))
          }

          setLimit={(limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 }))
          }

          setTotalItems={(totalItems) =>
            setPagination((prev) => ({ ...prev, totalItems }))
          }

          setTotalPages={(totalPages) =>
            setPagination((prev) => ({ ...prev, totalPages }))
          }

          columns={columns}
          btn={<RefreshButtonData onClick={setRefreshKey} />}
          isPagination={true}
        />

      </Box>
    </Box>
  );
};

export default memo(AnnualInventory);
