import { apiSlice } from "../api/apiSlice";

export const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoleAndUserId: builder.query({
      query: () => ({
        url: "/api/getDataRoleIdAndPermission",
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }),
      providesTags: ["Role"],
      transformResponse: (response) => response?.response,
    }),
  }),
});

export const {
  useGetRoleAndUserIdQuery,
  useLazyGetRoleAndUserIdQuery,
} = roleApiSlice;
