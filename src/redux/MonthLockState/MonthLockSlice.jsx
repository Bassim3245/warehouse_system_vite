import { createSlice } from "@reduxjs/toolkit";
import { createMonthlyLock, getAllMonthlyLocksEntityId } from "./monthLock";
import { toast } from "react-toastify";


const monthLockState = createSlice({
  name: "MonthLock",
  initialState: {
    lockData: [],
    isError: false,
    isSuccess: false,
    isLoading: null,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMonthlyLock.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMonthlyLock.fulfilled, (state, { payload }) => {
        state.message = payload;
        toast.success(payload);
        state.isLoading = false;
      })
      .addCase(createMonthlyLock.rejected, (state, { payload }) => {
        state.message = payload;
        toast.error(payload);
        state.isLoading = false;
      });
      builder
      .addCase(getAllMonthlyLocksEntityId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllMonthlyLocksEntityId.fulfilled, (state, { payload }) => {
        state.lockData = payload;
        state.isLoading = false;
      })
      .addCase(getAllMonthlyLocksEntityId.rejected, (state, { payload }) => {
        state.message = "error";
        state.lockData = null;
      });
  },
});
export default monthLockState.reducer;
export const monthLockSelector = (state) => state.monthLockState;
