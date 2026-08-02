import { apiSlice } from "../api/apiSlice";

export const warehouseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllWarehouse: builder.query({
      query: (params) => ({
        url: "/api/warehouse/getAllWarehouseData",
        method: "GET",
        params,
      }),
      providesTags: ["Warehouse"],
      transformResponse: (response) => response?.data,
    }),
    getWarehouseByLabId: builder.query({
      query: (params) => ({
        url: "/api/warehouse/getWarehouseData",
        method: "GET",
        params,
      }),
      providesTags: ["Warehouse"],
      transformResponse: (response) => response?.data,
    }),
    getAllWarehouseByFactoryAndLab: builder.query({
      query: (params) => ({
        url: "/api/warehouse/getWarehouseDataByFactoryAndLab",
        method: "GET",
        params,
      }),
      providesTags: ["Warehouse"],
      transformResponse: (response) => response?.data,
    }),
    getWarehouseDataByUserId: builder.query({
      query: (userId) => ({
        url: `/api/warehouse/getWarehouseDataByUserId/${userId}`,
        method: "GET",
      }),
      providesTags: ["Warehouse"],
      transformResponse: (response) => response?.data,
    }),
    getWarehouseDataById: builder.query({
      query: (warehouseId) => ({
        url: `/api/warehouse/getWarehouseDataById/${warehouseId}`,
        method: "GET",
      }),
      providesTags: ["Warehouse"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetAllWarehouseQuery,
  useLazyGetAllWarehouseQuery,
  useGetWarehouseByLabIdQuery,
  useLazyGetWarehouseByLabIdQuery,
  useGetAllWarehouseByFactoryAndLabQuery,
  useLazyGetAllWarehouseByFactoryAndLabQuery,
  useGetWarehouseDataByUserIdQuery,
  useLazyGetWarehouseDataByUserIdQuery,
  useGetWarehouseDataByIdQuery,
  useLazyGetWarehouseDataByIdQuery,
} = warehouseApiSlice;
