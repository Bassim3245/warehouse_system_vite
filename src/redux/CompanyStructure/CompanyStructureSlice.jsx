import { createSlice } from "@reduxjs/toolkit";
import {
  getCompanyStructure,
  getCompanyStructureEntityId,
} from "./CompanyStructureAction";

// Helper function لتحديد الصلاحيات
const determinePermissions = (structureType) => {
  const permissions = {
    full: {
      has_factory: true,
      has_lab: true,
      has_warehouse: true,
      levels: ["company", "factory", "lab", "warehouse"],
      maxDepth: 4,
    },
    simple: {
      has_factory: false,
      has_lab: false,
      has_warehouse: true,
      levels: ["company", "warehouse"],
      maxDepth: 2,
    },
    factory_only: {
      has_factory: true,
      has_lab: false,
      has_warehouse: true,
      levels: ["company", "factory", "warehouse"],
      maxDepth: 3,
    },
    lab_only: {
      has_factory: false,
      has_lab: true,
      has_warehouse: true,
      levels: ["company", "lab", "warehouse"],
      maxDepth: 3,
    },
  };
  return permissions[structureType] || permissions.simple;
};
const CompanyStructureState = createSlice({
  name: "CompanyStructure",
  initialState: {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    CompanyStructure: [],
    selectedCompany: null,
    permissionsStructure: {
      has_factory: false,
      has_lab: false,
      has_warehouse: false,
      levels: [],
      maxDepth: 0,
    },
    hierarchyConfig: null,
  },
  reducers: {
    setSelectedCompany: (state, action) => {
      const company = action.payload;
      state.selectedCompany = company;
      state.permissionsStructure = determinePermissions(company.structure_type);
      state.hierarchyConfig = {
        entityId: company?.comp_entity_id,
        has_factory: company?.has_factory,
        has_lab: company?.has_lab,
        has_warehouse: company?.has_warehouse,
        entityName: company?.Entities_name,
      };
    },
    clearSelection: (state) => {
      state.selectedCompany = null;
      state.permissionsStructure = {
        has_factory: false,
        has_lab: false,
        has_warehouse: false,
        levels: [],
        maxDepth: 0,
      };
      state.hierarchyConfig = null;
    },
    resetState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyStructure.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCompanyStructure.fulfilled, (state, { payload }) => {
        state.CompanyStructure = payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getCompanyStructure.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.message = payload?.message || "حدث خطأ في جلب بيانات الشركات";
      })
      .addCase(getCompanyStructureEntityId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCompanyStructureEntityId.fulfilled, (state, { payload }) => {
        state.permissionsStructure = determinePermissions(payload);
        state.hierarchyConfig = payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getCompanyStructureEntityId.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.message = payload?.message || "حدث خطأ في جلب بيانات الشركة";
      });
  },
});

export const { setSelectedCompany, clearSelection, resetState } =
  CompanyStructureState.actions;
export default CompanyStructureState.reducer;
// Selectors محسنة
export const CompanyStructureSelector = (state) => state.CompanyStructure;
export const getCompanyPermissions = (state) =>
  state.CompanyStructure.permissionsStructure;
export const getSelectedCompany = (state) =>
  state.CompanyStructure.selectedCompany;
export const getHierarchyConfig = (state) =>
  state.CompanyStructure.hierarchyConfig;
