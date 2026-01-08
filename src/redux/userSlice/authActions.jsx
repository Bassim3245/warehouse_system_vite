import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BackendUrl } from "../api/axios";
import {
  getToken,
  removeToken,
  getRefreshToken,
  setToken,
} from "../../utils/handelCookie";
// Helper to refresh token
const refreshAuthToken = async () => {
  try {
    const refreshToken = getRefreshToken(); // Get the refresh token from cookies or storage
    const response = await axios.post(
      `${BackendUrl}/api/refreshToken`,
      {},
      {
        headers: {
          authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    if (response && response.data) {
      const { token } = response.data;
      return token;
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// login
const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/Login`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(formData),
      });
      if (response || response?.data) {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
const getAllDataUser = createAsyncThunk(
  "auth/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/getAllData`,
        headers: {
          Accept: "application/json",
        },
      });
      if (response || response?.data) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
const getDataUserById = createAsyncThunk(
  "auth/getDataUserById",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/getUserById`,
        headers: {
          authorization: token,
        },
      });
      if (response || response?.data) {

        return response?.data?.data;
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
const fetchDataUserEntityId = createAsyncThunk(
  "auth/getDataUserManageBIdEntityWithoutLimit",
  async (entityId, { rejectWithValue }) => {
    try {
      const response = await axios({
        method: "get",
        url: `${BackendUrl}/api/getDataUserManageBIdEntityWithoutLimit/${entityId}`,
        headers: {
          authorization: getToken(),
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
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = getToken(); // Retrieve the token
      const refreshToken = getRefreshToken();
      if (!token) {
        return rejectWithValue("User not authenticated");
      }
      const response = await axios.post(`${BackendUrl}/api/logoutUser`, {
        userId,
        refreshToken,
      });
      if (response || response.data) {
        removeToken();
        localStorage.clear();
        return response?.data; // If successful, return the API response
      }
    } catch (error) {
      // Return a user-friendly error message
      return rejectWithValue(
        error.response?.data?.message || "Failed to log out. Please try again."
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "user/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await axios.post(`${BackendUrl}/api/refresh-token`, {
        refreshToken,
      });
      if (response) {
        const { accessToken } = response.data;
        setToken(accessToken, refreshToken); // Update tokens
        // window.location.reload();
        return { accessToken };
      }
    } catch (error) {
      console.log("error", error.response);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export {
  loginUser,
  getAllDataUser,
  getDataUserById,
  refreshAuthToken,
  fetchDataUserEntityId,
};
