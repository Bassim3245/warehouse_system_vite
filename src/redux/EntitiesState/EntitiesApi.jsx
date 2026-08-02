import { apiSlice } from "../api/apiSlice";

export const entitiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEntities: builder.query({
      query: () => ({
        url: "/api/getDataEntities",
        method: "get",
      }),
      providesTags: ["Entities"],
      // You can transform the response if needed, for instance pulling out response.response
      transformResponse: (response) => response.response,
    }),
  }),
});

export const { useGetEntitiesQuery } = entitiesApiSlice;
