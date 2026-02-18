import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import SearchIcon from "@mui/icons-material/Search";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocalPrintshopOutlined from "@mui/icons-material/LocalPrintshopOutlined";
import StoreFormModel from "./FormModel";
import HandelExcelFile from "../excelForm/HandelExcell";
import UseFullScreen from "../../../../hooks/useFullScreen";
import GridTemplate from "../../../../components/reusableComponent/GridTemplet";
import Loader from "../../../../components/reusableComponent/Loader";
import { ColorButton } from "../../../../style/ButtomStyle";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../../../../utils/Function";
const StoreData = ({
  selectedWarehouse,
  wareHouseData,
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
  has_lab,
  has_factory,
  has_warehouse,
  allow_to_manage_all_lab,
  has_production_warehouse,
  has_main_warehouse,
  allow_show_data_l,
}) => {
  const navigate = useNavigate();

  if (!selectedWarehouse) {
    return (
      <Card sx={{ mt: 2, textAlign: "center", p: 4 }}>
        <CardContent>
          <WarehouseIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            يرجى اختيار مخزن لعرض البيانات
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      {loading && <Loader />}
      <Box dir={rtl?.dir}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "start",
            alignItems: { xs: "stretch", md: "center" },
            flexWrap: "wrap",
            mt: 2,
            gap: 2,
            width: "100%",
          }}
        >
          {/* Buttons Group */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              width: { xs: "100%", md: "auto" },
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            {hasPermission(
              roles.allow_to_insert_warehouse_materials._id,
              permissionData
            ) &&
              ((has_factory && !has_lab && has_warehouse) ||
                (!has_factory && has_lab && has_warehouse) ||
                (!has_factory && !has_lab && has_warehouse) ||
                (has_factory && has_lab && has_warehouse)) && (
                <StoreFormModel
                  editMode={false}
                  dataUnitMeasuring={dataUnitMeasuring}
                  setRefreshButton={setRefreshButton}
                  dataUserById={dataUserById}
                  wareHouseData={wareHouseData}
                  warehouseId={selectedWarehouse}
                  dataUserLab={dataUserLab}
                  hierarchyConfig={hierarchyConfig}
                  has_lab={has_lab}
                  has_factory={has_factory}
                  has_warehouse={has_warehouse}
                  allow_to_manage_all_lab={allow_to_manage_all_lab}
                  has_production_warehouse={has_production_warehouse}
                  has_main_warehouse={has_main_warehouse}
                  allow_show_data_l={allow_show_data_l}
                />
              )}

            <Tooltip title="طباعة أستمارة الجرد">
              <ColorButton
                disabled={!selectedWarehouse}
                onClick={() =>
                  navigate(`print-Inventory?store_id=${selectedWarehouse}`)
                }
                startIcon={<LocalPrintshopOutlined />}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                جرد المخزن
              </ColorButton>
            </Tooltip>

            {hasPermission(
              roles.allow_to_insert_warehouse_materials._id,
              permissionData
            ) &&
              ((has_factory && !has_lab && has_warehouse) ||
                (!has_factory && has_lab && has_warehouse) ||
                (!has_factory && !has_lab && has_warehouse) ||
                (has_factory && has_lab && has_warehouse)) && (
                <HandelExcelFile
                  dataUnitMeasuring={dataUnitMeasuring}
                  setRefreshButton={setRefreshButton}
                  dataUserById={dataUserById}
                  wareHouseData={wareHouseData}
                  dataUserLab={dataUserLab}
                  warehouseId={selectedWarehouse}
                />

              )}

            <UseFullScreen
              setRefreshButton={setRefreshButton}
              refreshing={refreshButton}
            />

          </Box>

          {/* Search Input */}
          <Box sx={{ width: { xs: "100%", sm: "100%", md: "250px" } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="بحث بالرقم الرمزي، الاسم، أو المواصفات الفنية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Clear Filters */}
          <Box sx={{ width: { xs: "100%", sm: "150px" } }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("");
                setFilterZeroValue("");
                setPage(1);
              }}
              sx={{ height: "40px" }}
            >
              مسح الفلاتر
            </Button>
          </Box>
        </Box>

        <GridTemplate
          key={`${page}-${limit}`}
          columns={columns}
          rows={rows}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          page={page}
          setPage={setPage}
          setLimit={setLimit}
          loading={loading}
          refreshButton={refreshButton}
          setRefreshButton={setRefreshButton}
        />
      </Box>
    </>
  );
};

export default StoreData;
