import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  getInventoryArchiveAnnual,
  getInventoryArchiveMonthly,
} from "../../../../../redux/InventiryArchive/InventoryArchiveAction";
import { typeDocument } from "../../../../../constants/arrayFuction";
import { useCallback, useEffect, useMemo, useState } from "react";
import useGetAllWarehouse from "../../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse";
import useUserData from "../../../../../hooks/genaral/useUserData";

export const useInventoryArchiveMonthly = () => {
  const dispatch = useDispatch();
  const { InventoryArchiveDataMonthly, InventoryArchiveDataAnnual, loading, pagination } =
    useSelector((state) => state?.inventoryArchive);
  const { dataUserById, rtl } = useUserData();
  const { wareHouseData } = useGetAllWarehouse();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filterDocumentType, setFilterDocumentType] = useState("in");
  const [refreshKey, setRefreshKey] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectLab, setSelectLab] = useState("");
  const [selectFactory, setSelectFactory] = useState("");
  const [selectedMonthDetails, setSelectedMonthDetails] = useState(null);
  const [error, setError] = useState(null);


  const selectedMonth = useMemo(() => selectedDate.month() + 1, [selectedDate]);
  const selectedYear = useMemo(() => selectedDate.year(), [selectedDate]);

  const fetchData = useCallback(() => {
    const param = {
      entity_id: dataUserById?.entity_id,
      warehouse_id: selectedWarehouse,
      selectedYear,
      selectedMonth,
      filterDocumentType,
      selectFactory,
      selectLab,
      pagination,
    };
    dispatch(getInventoryArchiveMonthly(param));
    dispatch(getInventoryArchiveAnnual(param));
  }, [
    dispatch,
    dataUserById?.entity_id,
    selectedWarehouse,
    selectedYear,
    selectedMonth,
    filterDocumentType,
    selectFactory,
    selectLab,
    refreshKey,
  ]);

  const handleDateChange = useCallback((newDate) => {
    if (newDate && newDate.isValid()) {
      setSelectedDate(newDate);
    }
  }, []);

  // Auto-fetch data when dependencies change
  useEffect(() => {
    if (dataUserById?.entity_id) {
      fetchData();
    }
  }, [fetchData, dataUserById?.entity_id]);




  return {
    InventoryArchiveDataMonthly,
    InventoryArchiveDataAnnual,
    wareHouseData,
    selectedDate,
    setSelectedDate,
    filterDocumentType,
    setFilterDocumentType,
    refreshKey,
    setRefreshKey,
    loading,
    selectedWarehouse,
    setSelectedWarehouse,
    selectedMonthDetails,
    setSelectedMonthDetails,
    error,
    setError,
    selectedMonth,
    selectedYear,
    handleDateChange,
    dataUserById,
    fetchData,
    typeDocument,
    selectLab,
    selectFactory,
    setSelectFactory,
    setSelectLab,
    rtl,
  };
};
