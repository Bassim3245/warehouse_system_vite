import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
import { getToken } from "../../utils/handelCookie";
export const createMonthlyLock = createAsyncThunk(
  "MonthLock/createMonthlyLock",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/warehouse/closeMonth`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        return response.data.message;
      }
    } catch (error) {

      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const createMonthlyLockLive = createAsyncThunk(
  "MonthLock/createMonthlyLockLive",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/warehouse/closeMonthLive`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        return response.data.message;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const getAllMonthlyLocksEntityId = createAsyncThunk(
  "MonthLock/getAllMonthlyLocksEntityId",
  async (entity_id, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getAllMonthlyLocksEntityId/${entity_id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        // console.log( "hhhhh",response?.data);
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


