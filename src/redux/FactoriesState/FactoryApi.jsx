import { apiSlice } from "../api/apiSlice";

export const factoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFactory: builder.query({
      query: (params) => {
        const queryParams = { ...params };
        if (params?.roles && params?.applicationPermission) {
          queryParams.checkPermissionUser = params.roles?.get_all_report_for_factory_lab_warehouse?._id;
          queryParams.applicationPermission = params.applicationPermission?.warehouseSystem?._id;
          delete queryParams.roles;
        }
        return {
          url: "/api/warehouse/getFactoriesData",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Factory"],
      transformResponse: (response) => response?.data || response,
    }),
  }),
});

export const {
  useGetAllFactoryQuery,
  useLazyGetAllFactoryQuery,
} = factoryApiSlice;
