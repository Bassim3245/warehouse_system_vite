import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../api/axiosConfig";

const getInventoryArchiveMonthly = createAsyncThunk(
  "inventoryArchive/getInventoryArchiveMonthly", // تصحيح الـ prefix
  async (
    {
      entity_id,
      warehouse_id,
      selectedYear,
      selectedMonth,
      filterDocumentType,
      documentId,
      selectFactory,
      selectLab,
      pagination,

    },
    { rejectWithValue }
  ) => {
    try {
      // Ensure all parameters are strings for URL query
      const queryParams = new URLSearchParams();
      if (entity_id) queryParams.append("entity_id", String(entity_id));
      if (warehouse_id)
        queryParams.append("warehouse_id", String(warehouse_id));
      if (selectedYear)
        queryParams.append("selectedYear", String(selectedYear));
      if (selectedMonth)
        queryParams.append("selectedMonth", String(selectedMonth));
      if (filterDocumentType && filterDocumentType !== "") {
        queryParams.append("filterDocumentType", String(filterDocumentType));
      }
      if (documentId)
        queryParams.append("documentId", String(documentId))
      if (selectFactory)
        queryParams.append("selectFactory", String(selectFactory))
      if (selectLab)
        queryParams.append("selectLab", String(selectLab))
      if (pagination.page)
        queryParams.append("page", String(pagination.page));
      if (pagination.limit)
        queryParams.append("limit", String(pagination.limit));
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getInventoryArchiveMonthly?${queryParams.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      if (response?.data?.data) {
        return response.data.data;
      }

      return rejectWithValue("No data received from server.");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);
const getInventoryArchiveAnnual = createAsyncThunk(
  "inventoryArchive/getInventoryArchiveAnnual", // تصحيح الـ prefix
  async (
    { entity_id, warehouse_id, selectedYear, filterDocumentType, selectFactory, selectLab, pagination },
    { rejectWithValue }
  ) => {
    try {
      // Ensure all parameters are strings for URL query
      const queryParams = new URLSearchParams();

      if (entity_id) queryParams.append("entity_id", String(entity_id));
      if (warehouse_id)
        queryParams.append("warehouse_id", String(warehouse_id));
      if (selectedYear)
        queryParams.append("selectedYear", String(selectedYear));
      if (selectFactory)
        queryParams.append("selectFactory", String(selectFactory))
      if (selectLab)
        queryParams.append("selectLab", String(selectLab))
      if (filterDocumentType && filterDocumentType !== "") {
        queryParams.append("filterDocumentType", String(filterDocumentType));
      }
      if (pagination.page)
        queryParams.append("page", String(pagination.page));
      if (pagination.limit)
        queryParams.append("limit", String(pagination.limit));
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getInventoryArchiveAnnual?${queryParams.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      if (response?.data?.data) {
        return response.data;
      }

      return rejectWithValue("No data received from server.");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Unknown error";
      return rejectWithValue(errorMessage);
    }
  }
);

export { getInventoryArchiveMonthly, getInventoryArchiveAnnual };
