import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosConfig";

const getAllFactory = createAsyncThunk(
  "auth/getAllFactory",
  async (
    { entity_id, roles, applicationPermission },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/api/warehouse/getFactoriesData',
        params: {
          entity_id,
          checkPermissionUser: roles?.get_all_report_for_factory_lab_warehouse._id,
          applicationPermission: applicationPermission?.warehouseSystem._id
        }
      });
      return response?.data;
    } catch (error) {
      console.error("Error fetching factory data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export { getAllFactory };