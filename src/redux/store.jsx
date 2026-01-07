import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice/userSlice";
import languageSlice from "./LanguageState";
import RolesReducer from "./RoleSlice/RoleSlice";
import themesSlice from "./theme/themeReducer";
import MinistriesState from "./MinistriesState/MinistriesSlice";
import EntitiesState from "./EntitiesState/EntitiesSlice";
import StateMaterialState from "./StateMartrialState/StateMatrialSlices";
import settingDataSlice from "./windoScreen/settingDataSlice";
import inventorySlice from "./Inventiry/InventorySlice";
import warehouseSlice from "./wharHosueState/WareHouseSlice";
import factorySlice from "./FactoriesState/FactoriesSlice";
import LabSlice from "./LaboriesState/LabSlice";
import dataHandelUserActionSlice from "./getDataProjectById/getSlice";
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
      user: userSlice,
      language: languageSlice,
      RolesData: RolesReducer,
      ThemeData: themesSlice,
      Ministries: MinistriesState,
      Entities: EntitiesState,
      StateMaterial: StateMaterialState,
      settingData: settingDataSlice,
      Inventory: inventorySlice,
      wareHouse: warehouseSlice,
      factory: factorySlice,
      lab: LabSlice,
      dataHandelUserAction: dataHandelUserActionSlice,
      applicationPermissions: applicationPermissionsSlice,
      CompanyStructure: CompanyStructureState,
      document: documentState,
      inventoryArchive: inventoryArchiveSlice,
      dashboard: DashboardState,
      signauter: SignauterSlice,
      monthLock: monthLockState,
    },
  },
  // @ts-ignore
  enhance
);
export default store;
