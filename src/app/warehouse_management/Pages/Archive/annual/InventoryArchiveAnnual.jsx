import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {useTheme} from "@mui/material/styles";import "dayjs/locale/ar";
import { useInventoryArchiveMonthly } from "../hook/useInventory";
import layoutStyle from "../../../../../style/layoutStyle";
import SelectInformation from "../commen/selectInformation";
import ImportArchiveMonthly from "../commen/PurchasesDataArchive";
import ExportArchiveMonthly from "../commen/salesDataArchive";
const InventoryArchiveAnnual = () => {
  const theme = useTheme();
  const {
    loading,
    selectedYear,
    InventoryArchiveDataAnnual,
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
        title={"الأرشيف السنوي للمواد المخزنية"}
        views={["year"]}
        openTo="year"
        isMonthly={false}
        InventoryArchiveData={InventoryArchiveDataAnnual}
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
      />
      {(filterDocumentType === "out" ||
        filterDocumentType === "internal_consumption") && (

          <ExportArchiveMonthly
            InventoryArchiveData={InventoryArchiveDataAnnual}
            theme={theme}
            loading={loading}
            selectedYear={selectedYear}
            setRefreshKey={setRefreshKey}
          />
        )}
      {filterDocumentType === "in" && (
        <ImportArchiveMonthly
          InventoryArchiveData={InventoryArchiveDataAnnual}
          loading={loading}
          theme={theme}
          selectedYear={selectedYear}
          setRefreshKey={setRefreshKey}
        />
      )}
      {InventoryArchiveDataAnnual && InventoryArchiveDataAnnual?.length > 0 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            إجمالي العناصر: <strong>{InventoryArchiveDataAnnual.length}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InventoryArchiveAnnual;
