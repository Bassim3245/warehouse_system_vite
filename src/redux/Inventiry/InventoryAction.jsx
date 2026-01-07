import { createAsyncThunk } from "@reduxjs/toolkit";
import { BackendUrl } from "../api/axios";
import { getToken } from "../../utils/handelCookie";
import { axiosInstance } from "../api/axiosConfig";
// Helper to refresh token
const getAllDataInventory = createAsyncThunk(
  "auth/getAllInventory",
  async ({ entity_id, warehouse_id }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `${BackendUrl}/api/warehouse/inventoryGetData?entity_id=${entity_id}&warehouse_id=${warehouse_id}`,
        headers: {
          authorization: getToken(),
        },
      });
      if (response?.data?.data) {
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
export const getDataInventoryByCode = createAsyncThunk(
  "inventory/getDataInventoryByCode",
  async (
    {
      dateFrom,
      dateTo,
      materialSearchType,
      selectTypInfroamtion
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("selectTypInfroamtion",selectTypInfroamtion);  
      const params = new URLSearchParams();
      if (selectTypInfroamtion.material_code) params.append("material_code", selectTypInfroamtion.material_code);
      if (dateFrom) params.append("dateFrom", dateFrom);
      if (dateTo) params.append("dateTo", dateTo);

      if (selectTypInfroamtion.selectWarehouse && selectTypInfroamtion.selectWarehouse !== "all") {
        params.append("warehouse_id", selectTypInfroamtion.selectWarehouse);
      }

      if (materialSearchType) {
        params.append("searchType", materialSearchType);
      }
      if (selectTypInfroamtion.selectRadioMaterialInforamtionType) {
        params.append("selectRadioMaterialInforamtionType", selectTypInfroamtion.selectRadioMaterialInforamtionType);
      }
      if (selectTypInfroamtion.searchKey) {
        params.append("searchKey", selectTypInfroamtion.searchKey);
      }
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/manageGetMaterialReport?${params.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );

      return response?.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const getInventoryIsMonthlyTrue = createAsyncThunk(
  "auth/getInventoryIsMonthlyTrue",
  async (
    {
      entity_id,
      warehouse_id,
      selectedYear,
      selectedMonth,
      filterDocumentType,
    },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        entity_id,
        warehouse_id,
        selectedYear,
        selectedMonth,
        filterDocumentType,
      });
      const response = await axiosInstance.get(
        `${BackendUrl}/api/warehouse/getInventoryArchiveMonthly?${queryParams.toString()}`,
        {
          headers: {
            authorization: getToken(),
          },
        }
      );
      if (response?.data?.data) {
        // console.log("respone", response?.data?.data)

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
export const getDataImportInventory = createAsyncThunk(
  "inventory/getDataImportInventory",
  async ({ year, entity_id, factory_id, lab_id, document_type }, thunkAPI) => {
    try {
      const response = await axiosInstance({
        method: "get",
        url: `/api/warehouse/materialImportMovements?year=${year}&entity_id=${entity_id}&factory_id=${factory_id}&lab_id=${lab_id}&document_type=${document_type}`,
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
export { getAllDataInventory, getInventoryIsMonthlyTrue };
