import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../api/axiosConfig";

const getSignatureBydocumentId = createAsyncThunk(
  "auth/getSignatureBydocumentId",
  async (documentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: `/api/warehouse/getSignatureDataByDocumentId/${documentId}`,
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

export { getSignatureBydocumentId };
