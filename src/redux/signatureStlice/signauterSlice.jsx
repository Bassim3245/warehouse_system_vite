import { createSlice } from "@reduxjs/toolkit";
import { getSignatureBydocumentId } from "./signatureAction";
export const SignauterSlice = createSlice({
  name: "signauter",
  initialState: {
    loading: false,
    signauterData: [],
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
      .addCase(getSignatureBydocumentId.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getSignatureBydocumentId.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.signauterData = payload;
      })
      .addCase(getSignatureBydocumentId.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.signauterData = [];
      });
  },
});
export default SignauterSlice.reducer;
export const { clearState } = SignauterSlice.actions;
export const signauterSelector = (state) => state.signauter;
