import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
const getRoleAndUserId = createAsyncThunk(
  "auth/getPermissionByUIserId",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/getDataRoleIdAndPermission`,
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
export { getRoleAndUserId };
