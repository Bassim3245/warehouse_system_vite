import { apiSlice } from "../api/apiSlice";

export const getDataUserApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDataUserWithWareHouseDataById: builder.query({
      query: ({ user_id, entity_id }) => ({
        url: `/api/warehouse/getWarehouseAndUserData?user_id=${user_id}&entity_id=${entity_id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.[0],
    }),
    getDataUserWithFactoryById: builder.query({
      query: ({ user_id, entity_id }) => ({
        url: `/api/warehouse/getFactoryAndUserData?user_id=${user_id}&entity_id=${entity_id}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.[0],
    }),
  }),
});

export const {
  useGetDataUserWithWareHouseDataByIdQuery,
  useLazyGetDataUserWithWareHouseDataByIdQuery,
  useGetDataUserWithFactoryByIdQuery,
  useLazyGetDataUserWithFactoryByIdQuery,
} = getDataUserApi;
