import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import "dayjs/locale/ar";
import { useInventoryArchiveMonthly } from "../hook/useInventory";
import layoutStyle from "../../../../../style/layoutStyle";
import SelectInformation from "../commen/selectInformation";
import ExportArchiveMonthly from "../commen/salesDataArchive";
import ImportArchiveMonthly from "../commen/PurchasesDataArchive";
const InventoryArchiveMonthly = () => {
  const theme = useTheme();
  const {
    loading,
    selectedYear,
    InventoryArchiveDataMonthly,
    setFilterDocumentType,
    filterDocumentType,
    wareHouseData,
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
  } = useInventoryArchiveMonthly();

  return (
    <Box sx={{ ...layoutStyle }} dir="rtl">
      <SelectInformation
        title={"الأرشيف الشهرية للمواد المخزنية"}
        views={["month", "year"]}
        openTo="month"
        isMonthly={true}
        InventoryArchiveData={InventoryArchiveDataMonthly}
        setFilterDocumentType={setFilterDocumentType}
        filterDocumentType={filterDocumentType}
        wareHouseData={wareHouseData}
        selectedDate={selectedDate}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        handleDateChange={handleDateChange}
        typeDocument={typeDocument}
        selectFactory={selectFactory}
        selectLab={selectLab}
        selectedMonth={selectedMonth}
        setSelectFactory={setSelectFactory}
        setSelectLab={setSelectLab}
        loading={loading}
        selectedYear={selectedYear}
      />
      {(filterDocumentType === "out" ||
        filterDocumentType === "internal_consumption") && (
          <ExportArchiveMonthly
            InventoryArchiveData={InventoryArchiveDataMonthly}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            theme={theme}
            loading={loading}
          />
        )}
      {filterDocumentType === "in" && (
        <ImportArchiveMonthly
          InventoryArchiveData={InventoryArchiveDataMonthly}
          theme={theme}
          selectedYear={selectedYear}
          loading={loading}
        />
      )}
      {InventoryArchiveDataMonthly &&
        InventoryArchiveDataMonthly.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              إجمالي العناصر:{" "}
              <strong>{InventoryArchiveDataMonthly.length}</strong>
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default InventoryArchiveMonthly;
