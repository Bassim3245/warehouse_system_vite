import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosConfig";

const getAllLab = createAsyncThunk(
  "auth/getAllLab",
  async (
    { entity_id, roles, applicationPermission },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/api/warehouse/getLabDataByEntity_id',
        params: {
          entity_id,
          checkPermissionUser: roles.get_all_report_for_factory_lab_warehouse._id,
          applicationPermission: applicationPermission.warehouseSystem._id
        }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lab data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const getAllLabByFactoryId = createAsyncThunk(
  "auth/getLabDataById",
  async (
    { entity_id, factory_id },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance({
        method: 'GET',
        url: '/api/warehouse/getLabData',
        params: {
          entity_id,
          factory_id: factory_id,
        }
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lab data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
export { getAllLab ,getAllLabByFactoryId };
