import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
export const getCompanyStructure = createAsyncThunk(
  "Admin/getCompanyStructure",
  async (thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/getCompanyStructure`,
      });
      if (response || response?.data) {
        return response?.data?.data;
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
export const getCompanyStructureEntityId = createAsyncThunk(
  "Admin/getCompanyStructureEntityId",
  async (entityIdParam, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/getCompanyStructureEntityId/${entityIdParam}`,
      });
      if (response || response?.data) {
        // console.log( "hhhhh",response?.data.data);
        return response?.data?.data;
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
