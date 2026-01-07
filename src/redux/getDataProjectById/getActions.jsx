import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../api/axiosConfig";
// Helper to refresh toke
const getDataUserWithWareHouseDataById = createAsyncThunk(
  "auth/getDataUserWithWareHouseDataById",
  async ({ user_id, entity_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getWarehouseAndUserData?user_id=${user_id}&entity_id=${entity_id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        return response?.data?.data[0];
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
const getDataUserWithFactoryById = createAsyncThunk(
  "auth/getFactoryAndUserData",
  async ({ user_id, entity_id }, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getFactoryAndUserData?user_id=${user_id}&entity_id=${entity_id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        return response?.data?.data[0];
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
export { getDataUserWithFactoryById, getDataUserWithWareHouseDataById };
