import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { axiosInstance } from "../api/axiosConfig";
import { getToken } from "../../utils/handelCookie";
export const getDataDocumentById = createAsyncThunk(
  "Admin/getDataDocumentById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/getInformationDocumentById/${id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        // console.log( "hhhhh",response?.data);
        return response.data.data;
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
export const documentArchiveMonthly = createAsyncThunk(
  "Admin/documentArchiveMonthly",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/documentArchiveMonthly/${id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        // console.log( "hhhhh",response?.data);
        return response.data.data;
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
/**
 * in this function get all document count last of each year ok the idea from this function get last number to handle document number to make as serial number
 */

export const documentCountLast = createAsyncThunk(
  "Admin/documentCountLast",
  async ({ year, entity_id, factory_id, lab_id, document_type }, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/documentCount?year=${year}&entity_id=${entity_id}&factory_id=${factory_id}&lab_id=${lab_id}&document_type=${document_type}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response || response?.data) {
        return response.data.data;
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


