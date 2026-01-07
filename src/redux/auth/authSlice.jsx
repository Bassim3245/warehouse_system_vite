import { createSlice } from '@reduxjs/toolkit';
import { getApplicationPermissionById } from './authAction';

const initialState = {
  applicationPermissions: [],
  isError: false,
  isSuccess: false,
  isFetching: false,
  message: "",};
export const applicationPermissionsSlice = createSlice({
  name: "applicationPermissions",
  initialState,
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
      .addCase(getApplicationPermissionById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getApplicationPermissionById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.applicationPermissions = payload;
      })
      .addCase(getApplicationPermissionById.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
      });
  },
});


export const { clearState } = applicationPermissionsSlice.actions;
export default applicationPermissionsSlice.reducer;
