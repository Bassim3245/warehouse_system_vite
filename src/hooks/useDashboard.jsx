import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import usePermissionUser from "./usePermissionUser";
import { getDataStatistic } from "../redux/dashboard/dashboardAction";
export default function useDashboard() {
  const dispatch = useDispatch();
  const {
    statisticData,
    chartDocumentData,
    chartDataMaterialImport,
    chartDataMaterialExport,
  } = useSelector((state) => state.dashboard);

  const { dataUserById } = usePermissionUser();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectMonth] = useState(new Date().getMonth());
  const dispatchDataStatistic = useCallback(() => {
    const { entity_id } = dataUserById;
    dispatch(getDataStatistic({ entity_id, selectedYear }));
  }, [selectedYear])
  useEffect(() => {
    dispatchDataStatistic()
  }, [dispatchDataStatistic]);

  return {
    statisticData,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectMonth,
    chartDocumentData,
    chartDataMaterialImport,
    chartDataMaterialExport,
  };
}
