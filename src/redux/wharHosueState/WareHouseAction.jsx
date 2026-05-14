import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosConfig";
import { getToken } from "../../utils/handelCookie";
const getAllWarehouse = createAsyncThunk(
  "warehouse/getAllWarehouse",
  async (
    {
      entity_id,
      warehouse_type = "",
      roles,
      applicationPermission,
      labId,
      factoryId,
    },
    { rejectWithValue },
  ) => {
    let param = {
      entity_id,

      checkPermissionUser: roles?.get_all_report_for_factory_lab_warehouse?._id,
      applicationPermission: applicationPermission.warehouseSystem._id,
    };
    if (warehouse_type) {
      param.warehouse_type = warehouse_type;
    }
    if (labId) {
      param.lab_id = labId;
    }
    if (factoryId) {
      param.factory_id = factoryId;
    }

    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/api/warehouse/getAllWarehouseData",
        params: {
          ...param,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
const getWarehouseByLabId = createAsyncThunk(
  "warehouse/getWarehouseByLabId",
  async ({ entity_id, lab_id, warehouseType }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/api/warehouse/getWarehouseData",
        params: {
          entity_id,
          lab_id,
          warehouseType,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

const getAllWarehouseByFactoryAndLab = createAsyncThunk(
  "warehouse/getAllWarehouseByFactoryAndLab",
  async (
    { entity_id, lab_id, factory_id, warehouseType },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: "/api/warehouse/getWarehouseDataByFactoryAndLab",
        params: {
          entity_id,
          lab_id,
          factory_id,
          warehouseType,
        },
      });
      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
const getWarehouseDataByUserId = createAsyncThunk(
  "warehouse/getWarehouseDataByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: `/api/warehouse/getWarehouseDataByUserId/${userId}`,
      });

      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
export const getWarehouseDataById = createAsyncThunk(
  "warehouse/getWarehouseDataById",
  async (warhouseId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: `/api/warehouse/getWarehouseDataById/${warhouseId}`,
        headers: {
          Accept: "application/json",
          authorization: `${getToken()}`,
        },
      });

      return response?.data?.data;
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);
// Removed duplicate thunk
export {
  getAllWarehouse,
  getAllWarehouseByFactoryAndLab,
  getWarehouseByLabId,
  getWarehouseDataByUserId,
};
