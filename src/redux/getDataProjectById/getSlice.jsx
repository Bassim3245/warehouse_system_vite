import { createSlice } from "@reduxjs/toolkit";
import {
  getDataUserWithFactoryById,
  getDataUserWithWareHouseDataById,
} from "./getActions";
export const dataHandelUserActionSlice = createSlice({
  name: "dataHandelUserAction",
  initialState: {
    loading: false,
    informationData: [],
    dataUserLab: {},
    dataUserFactory: {},
    isFetching: false,
    isSuccess: false,
    isSuccessMessage: false,
    isError: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataUserWithWareHouseDataById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(
        getDataUserWithWareHouseDataById.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.isSuccessMessage = true;
          state.dataUserLab = payload;
        }
      )
      .addCase(
        getDataUserWithWareHouseDataById.rejected,
        (state, { payload }) => {
          state.loading = false;
          state.isError = true;
          state.isSuccessMessage = false;
          state.message = payload;
          state.dataUserLab = {};
        }
      );
    builder
      .addCase(getDataUserWithFactoryById.pending, (state) => {
        state.loading = true;
        state.isError = null;
      })
      .addCase(getDataUserWithFactoryById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isSuccessMessage = true;
        state.dataUserFactory = payload;
      })
      .addCase(getDataUserWithFactoryById.rejected, (state, { payload }) => {
        state.loading = false;
        state.isError = true;
        state.isSuccessMessage = false;
        state.message = payload;
        state.dataUserFactory = {};
      });
  },
});

export default dataHandelUserActionSlice.reducer;
// export const { clearState, logout, setTokens } = userSlice.actions;
export const handelUserActionDataSelector = (state) =>
  state.dataHandelUserAction;
