import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import userSlice from "./userSlice/userSlice";
import languageSlice from "./LanguageState";
import RolesReducer from "./RoleSlice/RoleSlice";
import themesSlice from "./theme/themeReducer";
import MinistriesState from "./MinistriesState/MinistriesSlice";
import StateMaterialState from "./StateMartrialState/StateMatrialSlices";
import settingDataSlice from "./windoScreen/settingDataSlice";
import inventorySlice from "./Inventiry/InventorySlice";
import applicationPermissionsSlice from "./auth/authSlice";
import CompanyStructureState from "./CompanyStructure/CompanyStructureSlice";
import documentState from "./documentState/documentsSlice";
import inventoryArchiveSlice from "./InventiryArchive/InventoryArchiveSlice";
import DashboardState from "./dashboard/dashboardSlice";
import SignauterSlice from "./signatureStlice/signauterSlice";
import monthLockState from "./MonthLockState/MonthLockSlice";
// @ts-ignore
const enhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const store = configureStore(
  {
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      user: userSlice,
      language: languageSlice,
      RolesData: RolesReducer,
      ThemeData: themesSlice,
      Ministries: MinistriesState,
      StateMaterial: StateMaterialState,
      settingData: settingDataSlice,
      Inventory: inventorySlice,
      applicationPermissions: applicationPermissionsSlice,
      CompanyStructure: CompanyStructureState,
      document: documentState,
      inventoryArchive: inventoryArchiveSlice,
      dashboard: DashboardState,
      signauter: SignauterSlice,
      monthLock: monthLockState,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  },
  // @ts-ignore
  enhance
);

setupListeners(store.dispatch);

export default store;
