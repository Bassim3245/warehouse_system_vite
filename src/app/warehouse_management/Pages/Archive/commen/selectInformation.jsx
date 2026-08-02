import { memo, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ar";
import { Inventory } from "@mui/icons-material";
import UseFullScreen from "../../../../../hooks/useFullScreen";
import Loader from "../../../../../components/reusableComponent/Loader";
import Header from "../../../../../components/reusableComponent/HeaderComponent";
import PrintDialogInventory from "../../printInventory/printDialogInventory";
import { useLabManagement } from "../../../../../hooks/ManageWarehouseSetting/useLab";
import { useFactoryManagement } from "../../../../../hooks/ManageWarehouseSetting/useFactory";
import useGetAllWarehouse from "../../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import useUserData from "../../../../../hooks/genaral/useUserData";

const SelectInformation = ({
  title,
  views,
  openTo,
  isMonthly,
  InventoryArchiveData,
  setFilterDocumentType,
  filterDocumentType,
  // wareHouseData,
  selectedDate,
  refreshKey,
  setRefreshKey,
  selectedWarehouse,
  setSelectedWarehouse,
  handleDateChange,
  typeDocument,
  selectFactory,
  selectLab,
  selectedMonth,
  setSelectFactory,
  setSelectLab,
  loading,
  selectedYear,
}) => {

  const { dataUserById, dataUserLab } = useUserData();
  const { labData } = useLabManagement();
  const { factoryData } = useFactoryManagement();
  const { wareHouseData } = useGetAllWarehouse();

  const filterDataLab = useMemo(
    () => labData?.find((l) => l.id === selectLab) || null,
    [labData, selectLab]
  );

  const filterDataFactory = useMemo(
    () => factoryData?.find((f) => f.id === selectFactory) || null,
    [factoryData, selectFactory]
  );

  const filterWarehouse = useMemo(
    () => wareHouseData?.find((w) => w.id === selectedWarehouse) || null,
    [wareHouseData, selectedWarehouse]
  );


  // Memoize callbacks
  const handleWarehouseChange = useCallback(
    (event, newValue) => {
      setSelectedWarehouse(newValue?.id || "");
    },
    [setSelectedWarehouse]
  );

  const handleLabChange = useCallback(
    (event, newValue) => {
      setSelectLab(newValue?.lab_id || "");
    },
    [setSelectLab]
  );

  const handleFactoryChange = useCallback(
    (event, newValue) => {
      setSelectFactory(newValue?.id || "");
    },
    [setSelectFactory]
  );

  const handleDateChangeWithRefresh = useCallback(
    (newDate) => {
      handleDateChange(newDate);
    },
    [handleDateChange]
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
    }),
    []
  );

  // Memoize common InputProps for Autocomplete
  const autocompleteInputProps = useMemo(
    () => ({
      sx: { borderRadius: 2 },
    }),
    []
  );

  // Memoize Autocomplete sx
  const autocompleteSx = useMemo(() => ({ borderRadius: 2 }), []);

  // Memoize button container styles
  const buttonContainerSx = useMemo(
    () => ({
      display: "flex",
      gap: 1,
      flexWrap: "wrap",
      alignItems: "center",
    }),
    []
  );

  const selectedDocumentLabel = useMemo(
    () => typeDocument?.find((t) => t.value === filterDocumentType)?.label,
    [typeDocument, filterDocumentType]
  );

  // Memoize warehouse name
  const warehouseName = useMemo(() => filterWarehouse?.name, [filterWarehouse]);

  // Memoize factory render condition
  const showFactory = useMemo(
    () => factoryData?.length > 0,
    [factoryData?.length]
  );

  // Memoize lab render condition
  const showLab = useMemo(() => labData?.length > 0, [labData?.length]);

  // Render Autocomplete input with icon
  const renderAutocompleteInput = useCallback(
    (params, label) => (
      <TextField
        {...params}
        label={label}
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <Inventory color="action" />
            </InputAdornment>
          ),
          sx: autocompleteInputProps.sx,
        }}
      />
    ),
    [autocompleteInputProps]
  );

  return (
    <Box>
      {loading && <Loader />}
      <Box sx={{ mb: 1 }}>
        <Header title={title} dir="rtl" />
      </Box>
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
            <DatePicker
              label="اختر الشهر والسنة"
              views={views}
              openTo={openTo}
              value={selectedDate}
              onChange={handleDateChangeWithRefresh}
              sx={{ width: "100%" }}
              slotProps={datePickerSlotProps}
            />
          </LocalizationProvider>
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
        {showFactory && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Autocomplete
              fullWidth
              options={factoryData}
              getOptionLabel={(option) => option?.Factories_name || ""}
              value={filterDataFactory}
              onChange={handleFactoryChange}
              renderInput={(params) =>
                renderAutocompleteInput(params, "أختيار المصنع")
              }
              sx={autocompleteSx}
            />
          </Grid>
        )}
        {showLab && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Autocomplete
              fullWidth
              options={labData}
              getOptionLabel={(option) => option?.Laboratory_name || ""}
              value={filterDataLab}
              onChange={handleLabChange}
              renderInput={(params) =>
                renderAutocompleteInput(params, "اختيار المعمل")
              }
              sx={autocompleteSx}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 3 }}>
          <Autocomplete
            fullWidth
            options={wareHouseData}
            getOptionLabel={(option) => option?.name || ""}
            value={filterWarehouse}
            onChange={handleWarehouseChange}
            renderInput={(params) =>
              renderAutocompleteInput(params, "اختيار المخزن")
            }
            sx={autocompleteSx}
          />
        </Grid>

        <Grid size={12}>
          <Box sx={buttonContainerSx}>
            <PrintDialogInventory
              store_id={selectedWarehouse}
              InventoryArchiveData={InventoryArchiveData}
              dataUserById={dataUserById}
              dataUserLab={dataUserLab}
              filterDataFactory={filterDataFactory}
              filterDataLab={filterDataLab}
              filterWarehouse={filterWarehouse}
              filterDocumentType={filterDocumentType}
            />
            <UseFullScreen
              setRefreshButton={setRefreshKey}
              refreshing={refreshKey}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 1 }}>
        <Alert severity="info">
          <Typography variant="body2">
            {isMonthly ? (
              <>
                عرض البيانات للشهر: <strong>{selectedMonth}</strong> من السنة:{" "}
                <strong>{selectedYear}</strong> - نوع المستند:{" "}
              </>
            ) : (
              <>
                عرض البيانات للسنة: <strong>{selectedYear}</strong> - نوع
                المستند:
              </>
            )}
            <strong>{selectedDocumentLabel}</strong>
            {selectedWarehouse && (
              <>
                {" "}
                - المخزن: <strong>{warehouseName}</strong>
              </>
            )}
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default memo(SelectInformation);
