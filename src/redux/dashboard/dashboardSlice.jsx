import { createSlice } from "@reduxjs/toolkit";
import { getDataStatistic } from "./dashboardAction";
const DashboardState = createSlice({
  name: "dashboard",
  initialState: {
    statisticData: [],
    chartDocumentData: [],
    chartDataMaterialImport: [],
    chartDataMaterialExport: [],
    materialExportInternal: [],
    isError: false,
    isSuccess: false,
    isLoading: null,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataStatistic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataStatistic.fulfilled, (state, { payload }) => {
        state.statisticData = payload?.statistic;
        state.chartDocumentData = payload?.chartDocumentData;
        state.chartDataMaterialImport = payload?.chartDataMaterialImport;
        state.chartDataMaterialExport = payload?.chartDataMaterialExport;
        state.materialExportInternal = payload?.chartDataMaterialExportInternal;
        state.isLoading = false;
      })
      .addCase(getDataStatistic.rejected, (state, { payload }) => {
        state.message = "error";
        state.statisticData = null;
        state.chartDocumentData = null;
        state.chartDataMaterialImport = null;
        state.chartDataMaterialExport = null;
        state.materialExportInternal = null;
      });
  },
});
export default DashboardState.reducer;
export const statisticDataSelector = (state) => state.dashboard.statisticData;
export const chartDataSelector = (state) => state.dashboard.chartDocumentData;
export const chartDataMaterialImportSelector = (state) =>
  state.dashboard.chartDataMaterialImport;
export const chartDataMaterialExportSelector = (state) =>
  state.dashboard.chartDataMaterialExport;
