import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
import { getToken } from "../../utils/handelCookie";
export const getDataStatistic = createAsyncThunk(
  "Admin/getDataStatistic",
  async ({ entity_id, selectedYear, selectedMonth }, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getStatisticReport?entity_id=${entity_id}&selectYear=${selectedYear}&selectMonth=${selectedMonth}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response && error.response.data.response.message) {
        return thunkAPI.rejectWithValue(error.response.data.response.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);
