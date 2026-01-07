import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
const getApplicationPermissionById = createAsyncThunk(
  "auth/getApplicationPermissionById",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/getApplicationPermissionById`,
        headers: {
          Accept: "application/json",
          authorization: `${token}`,
        },
      });
      if (response || response?.data) {
        return response?.data?.response;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        console.log(error.response.data.message);
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export { getApplicationPermissionById };
