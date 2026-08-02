import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    // baseURL is already handled inside axiosConfig.jsx, but we can pass a prefix if needed
    baseUrl: "",
  }),
  tagTypes: ["Entities"], // Add tag types here as we migrate more slices
  endpoints: (builder) => ({}),
});
