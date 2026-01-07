import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
import { getToken } from "../../utils/handelCookie";
export const getDataEntities = createAsyncThunk(
  "Admin/getDataEntities",
  async (token,thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/getDataEntities`,
        headers:{
          authorization:getToken()
        }
      });
      if (response || response?.data) {
        // console.log( "hhhhh",response?.data);
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
