import { apiSlice } from "../api/apiSlice";

export const labApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLab: builder.query({
      query: (params) => {
        const queryParams = { ...params };
        if (params?.roles && params?.applicationPermission) {
          queryParams.checkPermissionUser = params.roles?.get_all_report_for_factory_lab_warehouse?._id;
          queryParams.applicationPermission = params.applicationPermission?.warehouseSystem?._id;
          delete queryParams.roles;
        }
        return {
          url: "/api/warehouse/getLabDataByEntity_id",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Lab"],
      transformResponse: (response) => response?.data || response,
    }),
    getAllLabByFactoryId: builder.query({
      query: (params) => ({
        url: "/api/warehouse/getLabData",
        method: "GET",
        params,
      }),
      providesTags: ["Lab"],
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

export const {
  useGetAllLabQuery,
  useLazyGetAllLabQuery,
  useGetAllLabByFactoryIdQuery,
  useLazyGetAllLabByFactoryIdQuery,
} = labApiSlice;
