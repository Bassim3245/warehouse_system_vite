import { createSlice } from "@reduxjs/toolkit";
import { getInventoryArchiveMonthly, getInventoryArchiveAnnual } from "./InventoryArchiveAction";
export const inventoryArchiveSlice = createSlice({
  name: "inventoryArchive",
  initialState: {
    loading: false,
    InventoryArchiveDataMonthly: [],
    InventoryArchiveDataAnnual: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    totalPages: 0,
    totalItems: 0,
    currentPage: 0,
    code: false,
    isFetching: false,
    isSuccess: false,
    isSuccessMessage: false,
    isError: false,
    message: "",
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.InventoryArchiveDataMonthly = [];
      state.InventoryArchiveDataAnnual = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInventoryArchiveMonthly.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getInventoryArchiveMonthly.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.InventoryArchiveDataMonthly = payload;
        state.pagination = payload.pagination;
      })
      .addCase(getInventoryArchiveMonthly.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.InventoryArchiveDataMonthly = [];

      });
    builder
      .addCase(getInventoryArchiveAnnual.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getInventoryArchiveAnnual.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.InventoryArchiveDataAnnual = payload.data;
        state.pagination = payload.pagination;
      })
      .addCase(getInventoryArchiveAnnual.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.InventoryArchiveDataAnnual = [];

      });
  },
});
export default inventoryArchiveSlice.reducer;
export const { clearState } = inventoryArchiveSlice.actions;
export const inventoryArchiveSelector = (state) => state.inventoryArchive;
export const setPagination = (pagination) => (dispatch) => {
  dispatch(inventoryArchiveSlice.actions.setPagination(pagination));
};

