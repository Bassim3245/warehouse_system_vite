import { useState, useMemo, useEffect } from "react";
import StoreData from "./storeData";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import layoutStyle from "../../../../style/layoutStyle";
import useStoreData from "../../../../hooks/useStoreData";
import useGetAllWarehouse from "../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import { usePermissionsStructure } from "../../../../hooks/useStructureCompany";

// خيارات أنواع المخازن
const warehouseTypeOptions = [
  { value: "main", label: "مخزن رئيسي" },
  { value: "branch", label: "مخزن فرعي" },
  { value: "production", label: "مخزن إنتاج" },
];

const ManagementDataStore = () => {
  const { wareHouseData } = useGetAllWarehouse();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedWarehouseType, setSelectedWarehouseType] = useState(null);

  const {
    has_lab,
    has_factory,
    has_warehouse,
    allow_to_manage_all_lab,
    has_production_warehouse,
    has_main_warehouse,
    allow_show_data_l,
  } = usePermissionsStructure();

  // تصفية المخازن بناءً على الفلاتر المحددة
  const filteredWarehouses = useMemo(() => {
    let filtered = [...wareHouseData];

    // فلتر حسب القسم
    if (selectedSection) {
      filtered = filtered.filter((w) => w.laboratory_id === selectedSection.id);
    }

    // فلتر حسب نوع المخزن
    if (selectedWarehouseType) {
      filtered = filtered.filter((w) => w.warehouse_type === selectedWarehouseType.value);
    }

    return filtered;
  }, [wareHouseData, selectedSection, selectedWarehouseType]);

  // تعيين أول نوع مخزن افتراضيًا عند الدخول للصفحة أو عند عدم اختياره
  useEffect(() => {
    if (!selectedWarehouseType && warehouseTypeOptions.length > 0) {
      setSelectedWarehouseType(warehouseTypeOptions[0]);
    }
  }, [selectedWarehouseType]);

  // تعيين أول مخزن من المخازن المفلترة افتراضيًا
  useEffect(() => {
    if (!selectedWarehouse && filteredWarehouses && filteredWarehouses.length > 0) {
      setSelectedWarehouse(filteredWarehouses[0].id);
    }
  }, [filteredWarehouses, selectedWarehouse]);

  const {
    dataUserById,
    rtl,
    dataUserLab,
    searchTerm,
    setSearchTerm,
    setFilterStatus,
    setFilterZeroValue,
    loading,
    columns,
    rows,
    totalPages,
    totalItems,
    page,
    setPage,
    limit,
    setLimit,
    refreshButton,
    setRefreshButton,
    dataUnitMeasuring,
    hierarchyConfig,
    roles,
    permissionData,
  } = useStoreData({ selectedWarehouse });

  // Handle warehouse selection change
  const handleWarehouseChange = (event, newValue) => {
    const newWarehouseId = newValue ? newValue?.id : "";
    setSelectedWarehouse(newWarehouseId);
    setPage(1);
  };
  return (
    <Box sx={{ ...layoutStyle }} dir="rtl">
      <Header title={" أدارة الخزين في المخازن"} dir="rtl" />

      {/* قسم الفلاتر */}
      <Grid container spacing={2} sx={{ mb: 2 }}>

        {/* فلتر نوع المخزن */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: "block", fontSize: "0.75rem" }}
          >
            أنواع المخازن
          </Typography>
          <Autocomplete
            fullWidth
            options={warehouseTypeOptions}
            getOptionLabel={(option) => option?.label || ""}
            value={selectedWarehouseType}
            onChange={(event, newValue) => {
              setSelectedWarehouseType(newValue);
              setSelectedWarehouse(""); // إعادة تعيين المخزن المحدد عند تغيير النوع
              setPage(1);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="فلتر حسب نوع المخزن"
                placeholder="اختر نوع المخزن..."
                sx={{ borderRadius: 2 }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1 }}
              >
                <WarehouseIcon sx={{ color: "primary.main", fontSize: 18 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "medium", fontSize: "0.875rem" }}
                >
                  {option.label}
                </Typography>
              </Box>
            )}
            noOptionsText="لا توجد أنواع متاحة"
          />
        </Grid>

        {/* اختيار المخزن */}
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: "block", fontSize: "0.75rem" }}
          >
            المخازن المتاحة: {filteredWarehouses.length}
          </Typography>
          <Autocomplete
            fullWidth
            options={filteredWarehouses}
            getOptionLabel={(option) => option?.name || ""}
            value={
              filteredWarehouses.find(
                (warehouse) => warehouse.id === selectedWarehouse
              ) || null
            }
            onChange={handleWarehouseChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="اختر المخزن"
                placeholder="ابحث عن مخزن..."
                sx={{ borderRadius: 2 }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                key={option.id}
                component="li"
                {...props}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1 }}
              >
                <WarehouseIcon sx={{ color: "primary.main", fontSize: 18 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "medium", fontSize: "0.875rem" }}
                  >
                    {option.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {option.location} - {option.user_name}
                  </Typography>
                </Box>
                <Chip
                  label={option.status}
                  color={option.status === "ممتلئ" ? "error" : "success"}
                  size="small"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              </Box>
            )}
            noOptionsText="لا توجد مخازن متاحة"
          />
        </Grid>
      </Grid>

      {/* Store Data Section */}
      <StoreData
        selectedWarehouse={selectedWarehouse}
        wareHouseData={wareHouseData}
        dataUnitMeasuring={dataUnitMeasuring}
        dataUserById={dataUserById}
        rtl={rtl}
        dataUserLab={dataUserLab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setFilterStatus={setFilterStatus}
        setFilterZeroValue={setFilterZeroValue}
        loading={loading}
        columns={columns}
        rows={rows}
        totalPages={totalPages}
        totalItems={totalItems}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        refreshButton={refreshButton}
        setRefreshButton={setRefreshButton}
        hierarchyConfig={hierarchyConfig}
        roles={roles}
        permissionData={permissionData}
        has_lab={has_lab}
        has_factory={has_factory}
        has_warehouse={has_warehouse}
        allow_to_manage_all_lab={allow_to_manage_all_lab}
        has_production_warehouse={has_production_warehouse}
        has_main_warehouse={has_main_warehouse}
        allow_show_data_l={allow_show_data_l}
      />
    </Box>
  );
};

export default ManagementDataStore;
