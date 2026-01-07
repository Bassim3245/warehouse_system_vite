import { createSlice } from "@reduxjs/toolkit";
import {
  getDataDocumentById,
  documentArchiveMonthly,
  documentCountLast,
} from "./documentsAction";

const documentState = createSlice({
  name: "document",
  initialState: {
    document: [],
    documentCount: {},
    isError: false,
    isSuccess: false,
    isLoading: null,
    message: "",
    page: 0,
    limit: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataDocumentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDataDocumentById.fulfilled, (state, { payload }) => {
        state.document = payload;
        state.isLoading = false;
      })
      .addCase(getDataDocumentById.rejected, (state, { payload }) => {
        state.message = "error";
        state.document = null;
      });
    builder
      .addCase(documentArchiveMonthly.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(documentArchiveMonthly.fulfilled, (state, { payload }) => {
        state.document = payload;
        state.isLoading = false;
      })
      .addCase(documentArchiveMonthly.rejected, (state, { payload }) => {
        state.message = "error";
        state.document = null;
      });
    builder
      .addCase(documentCountLast.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(documentCountLast.fulfilled, (state, { payload }) => {
        state.documentCount = payload;
        state.isLoading = false;
      })
      .addCase(documentCountLast.rejected, (state, { payload }) => {
        state.message = "error";
        state.documentCount = null;

      });
  },
});
export default documentState.reducer;
export const documentSelector = (state) => state.document;
