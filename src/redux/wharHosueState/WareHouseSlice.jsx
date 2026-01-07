import { createSlice } from "@reduxjs/toolkit";
import {
  getAllWarehouse,
  getAllWarehouseByFactoryAndLab,
  getWarehouseByLabId,
  getWarehouseDataById,
  getWarehouseDataByUserId,
} from "./WareHouseAction";
export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: {
    loading: false,
    wareHouseData: [],
    warehouseDataBYId: {},
    code: false,
    isFetching: false,
    isSuccess: false,
    isSuccessMessage: false,
    isError: false,
    message: "",
  },
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllWarehouse.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getAllWarehouse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.wareHouseData = payload;
      })
      .addCase(getAllWarehouse.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.wareHouseData = [];
      });
    builder
      .addCase(getAllWarehouseByFactoryAndLab.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(
        getAllWarehouseByFactoryAndLab.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.isSuccessMessage = true;
          state.wareHouseData = payload;
        }
      )
      .addCase(
        getAllWarehouseByFactoryAndLab.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.isError = true;
          state.isSuccessMessage = false;
          state.message = payload;
          state.wareHouseData = [];
        }
      );
    builder
      .addCase(getWarehouseByLabId.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getWarehouseByLabId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.wareHouseData = payload;
      })
      .addCase(getWarehouseByLabId.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.wareHouseData = [];
      });
    builder
      .addCase(getWarehouseDataByUserId.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getWarehouseDataByUserId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.wareHouseData = payload;
      })
      .addCase(getWarehouseDataByUserId.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.wareHouseData = [];
      });
    builder
      .addCase(getWarehouseDataById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getWarehouseDataById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.warehouseDataBYId = payload;
      })
      .addCase(getWarehouseDataById.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.warehouseDataBYId = {};
      });
  },
});

export default warehouseSlice.reducer;
export const { clearState } = warehouseSlice.actions;
export const warehouseSelector = (state) => state.warehouse;
