import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../api/axiosConfig";
export const AddStateMaterial = createAsyncThunk(
  "Admin/AddStateMaterial",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "post",
        url: `${BackendUrl}/api/MartialStateRegister`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: formData,
      });
      if (response) {
        return response?.data?.message;
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
export const getDataStateName = createAsyncThunk(
  "Admin/getDataStateName",
  async (thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/getDataStateName`,
        headers: {
          authorization:getToken()
        },
      });
      if (response || response?.data) {
        return response.data;
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
