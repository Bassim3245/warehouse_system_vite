import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Essential imports - NOT lazy loaded
import Loader from "./components/reusableComponent/Loader";
// import ReactGA from "react-ga";
// import GoogleAnalyticsTracker from "./utils/GoogleAnalyticsTracker ";
import MainHome from "./main/MainHome";
import PageNotFound from "./middleware/PageNotFound";
import Unauthorized from "./middleware/Unauthorized";
import Login from "./Auth/login";
import PrivateRoutes from "./middleware/praivetRout";
import ProtectedApplicationRoute from "./middleware/ProtectedApplicationRoute";
import Root2 from "./app/obesoloteMaterial/Layout/Root2";
import Root3 from "./app/managemant_platform/Layout/Root3";
import Root4 from "./app/customerManagePlatform/Layout/Root4";
import RootWarehouse from "./app/warehouse_management/Layout/Root3";
import AccountActivationMiddleware from "./middleware/AccountActivationMiddleware";
import useAppInitialization from "./hooks/useAppInitialization";
import HomeObesoloteMaterial from "./app/obesoloteMaterial/Page/home/Home";
import HomeWharhouse from "./app/warehouse_management/Pages/Home/Home";
import InventoryExportArchiveMonthly from "./app/warehouse_management/Pages/Archive/commen/inventoryExportArchiveMonthly";
import OpeningBalanceImport from "./app/warehouse_management/Pages/excelForm/uploadFileExcelPage";
import InventoryReturnManagement from "./app/warehouse_management/Pages/Inventory/return/InventoryReturnManagement";

// Lazy loaded components - Dashboard Pages
const Dashboard = React.lazy(
  () => import("./app/obesoloteMaterial/Page/dashboard/Dashboard"),
);
const DashboardEntity = React.lazy(
  () => import("./app/obesoloteMaterial/Page/dashboard/DashboardEntity"),
);
const GenerateReport = React.lazy(
  () => import("./app/obesoloteMaterial/Page/dashboard/Report/genrateReport"),
);

// Lazy loaded components - Home Pages
const Pages = React.lazy(() => import("./app/obesoloteMaterial/Page/pages"));

// Lazy loaded components - User Management
const PersonalProfile = React.lazy(
  () => import("./Auth/Profile/informationUser"),
);
const UserManagementAllUsers = React.lazy(
  () =>
    import("./app/managemant_platform/MangemantUsers/UsermanagemantAllUsers"),
);
const UserManagementFromEntities = React.lazy(
  () =>
    import("./app/customerManagePlatform/MangemantUsers/userMangemantFromEntitis"),
);

// Lazy loaded components - Categories
const AllCategory = React.lazy(
  () => import("./app/obesoloteMaterial/Page/category/AllCategory"),
);
const AllCategory1 = React.lazy(() => import("./main/category/AllCategory"));

// Lazy loaded components - Help & About
const HelpAboutProject = React.lazy(() => import("./help/help"));
const AboutPage = React.lazy(() => import("./main/AboutPage"));

// Lazy loaded components - Forms & CRUD
const FormDeletedList = React.lazy(
  () => import("./app/obesoloteMaterial/Page/FromIsObsolete/FormObsoleteList"),
);
const FormObsoleteMaterialApproveSuperAdminRoot = React.lazy(
  () =>
    import("./app/obesoloteMaterial/Page/FromIsObsolete/FormAbsoleteMaterialApproveUperAdminRoot"),
);
const FormObsoleteMaterialApproveAdmin = React.lazy(
  () =>
    import("./app/obesoloteMaterial/Page/FromIsObsolete/FormAbsoleteMaterialApproveAdmin"),
);
const ApproveAdmainTobsendRequestBooking = React.lazy(
  () =>
    import("./app/obesoloteMaterial/Page/FromIsObsolete/approveAdmainTobsendRequestBooking"),
);
const BookObsoleteMaterial = React.lazy(
  () =>
    import("./app/obesoloteMaterial/Page/FromIsObsolete/BookObsoleteMaterial"),
);

// Lazy loaded components - Material & Product Details
const MaterialOverview = React.lazy(
  () => import("./app/obesoloteMaterial/Page/FromIsObsolete/MaterialOverview"),
);
const ProductStagnant = React.lazy(
  () => import("./app/obesoloteMaterial/Page/Productstagmant"),
);
const ProductOverview = React.lazy(
  () => import("./app/obesoloteMaterial/Page/materialOverview/ProductOverview"),
);

// Lazy loaded components - Warehouse Management
const StoreData = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managemnatStoreData/storeData"),
);
const ManagementDataStore = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managemnatStoreData/manigemantdDataStored"),
);
const LabMinitoring = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/monitoringLabrarotory/LabMinitoring"),
);
const MaterialMovement = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Inventory/MovmentMaterial/materialMovment"),
);
const MaterialMovementExport = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Inventory/MovmentMaterial/WarehouseExportRecords"),
);
const PrintInventory = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/printInventory/PrintInventory"),
);
const WarehouseMange = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managemantWarehouse/WarehouseManager"),
);
const LabsEntity = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managemantWarehouse/LabsEntity"),
);
const Factories = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managemantWarehouse/Factories"),
);

// Lazy loaded components - Inventory & Documents
const ManageDocuments = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Inventory/Document/ManageDocuments"),
);
const PurchasesData = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Inventory/Purchases/PurchasesData"),
);
// DocumentSales removed as it is now part of ManageDocuments
const SalesMaterial = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Inventory/selas/salesMaterial"),
);

// Lazy loaded components - Notifications
const WarehouseNotification = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Notification/WarehouseNotifction"),
);
const NotificationObsoletedMaterial = React.lazy(
  () =>
    import("./app/obesoloteMaterial/Page/Notification/NotificationObesoloteMaterial"),
);
const ApproveBooked = React.lazy(
  () => import("./main_page/Notification/approveBooked"),
);

// Lazy loaded components - Logs
const LogById = React.lazy(
  () => import("./app/obesoloteMaterial/Page/log/LogById"),
);
const AllLog = React.lazy(() => import("./main_page/log/AllLog"));
const LogWarehouseById = React.lazy(
  () => import("./app/warehouse_management/log/LogById"),
);
const LogObsoleteById = React.lazy(
  () => import("./app/obesoloteMaterial/log/LogById"),
);

// Lazy loaded components - Platform Management
const MainInformation = React.lazy(
  () =>
    import("./app/managemant_platform/manageMainInformation/MainInformation"),
);
const Monitoring = React.lazy(
  () => import("./app/managemant_platform/monitoring/Monitoring"),
);
const EntityManagement = React.lazy(
  () => import("./app/managemant_platform/setting/entityManagemant"),
);
const EntityDetails = React.lazy(
  () => import("./app/managemant_platform/setting/entityDetails"),
);
const DocumentEdit = React.lazy(
  () => import("./app/managemant_platform/DocumentManagement/DocumentEdit"),
);
const DocumentCount = React.lazy(
  () => import("./app/managemant_platform/DocumentManagement/DocumentCount"),
);
const DocumentFieldSettings = React.lazy(
  () =>
    import("./app/customerManagePlatform/documentFiledSetting/DocumentFieldSettings"),
);

// Lazy loaded components - Permissions
const Permission = React.lazy(
  () =>
    import("./app/managemant_platform/manageMainInformation/RoleAndPermission/Permission"),
);
const SetPermissionToGroup = React.lazy(
  () =>
    import("./app/managemant_platform/manageMainInformation/RoleAndPermission/SetPermisition"),
);
const SetPermissionFromEntities = React.lazy(
  () =>
    import("./app/managemant_platform/MangemantUsers/setPermissionFromEntitis"),
);

// Lazy loaded components - Archive & Reports
const Archive = React.lazy(
  () => import("./app/obesoloteMaterial/Page/archive/archiveList"),
);
const InformationMaterialArchive = React.lazy(
  () => import("./app/obesoloteMaterial/Page/archive/InformationMaterial"),
);
const MainPageForReport = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managermantReports/mainPageReport"),
);
const MonthlyInventory = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Archive/monthly/MonthlyDocumentInventory"),
);
const AnnualInventory = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Archive/annual/AnnualDocumentInventory"),
);
const InventoryImportArchiveMonthly = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Archive/commen/inventoryImportArchiveMontly"),
);
const InventoryDataArchive = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Archive/monthly/InventoryDataArchive"),
);
const InventoryArchiveAnnual = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/Archive/annual/InventoryArchiveAnnual"),
);

// Lazy loaded components - Invoice Template Designer
const InvoiceTemplateDesigner = React.lazy(
  () =>
    import("./app/customerManagePlatform/InvoiceTemplateDesigner/InvoiceTemplateDesigner"),
);

// Lazy loaded components - Month Lock System
const MonthlyLocks = React.lazy(
  () => import("./app/warehouse_management/Pages/MonthlyLocks/MonthlyLocks"),
);
const UnlockRequests = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/UnlockRequests/UnlockRequests"),
);
const AuditLog = React.lazy(
  () => import("./app/warehouse_management/Pages/AuditLog/AuditLog"),
);

export default function App() {
  // Use custom hook for app initialization
  useAppInitialization();

  // const TRACKING_ID = "G-2H0DW1GEQW";
  // ReactGA.initialize(TRACKING_ID);

  return (
    <BrowserRouter>
      {/* <GoogleAnalyticsTracker /> */}
      <AccountActivationMiddleware>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainHome />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* Stagnant Materials System Routes (Application ID: 1) */}
            <Route element={<PrivateRoutes />}>
              <Route element={<ProtectedApplicationRoute applicationId={1} />}>
                <Route path="stagnant-materials" element={<Root2 />}>
                  {/* <Route index element={<Pages />} /> */}
                  <Route index element={<HomeObesoloteMaterial />} />
                  <Route
                    path="stagnant-materials_home"
                    element={<HomeObesoloteMaterial />}
                  />
                  <Route
                    path="UserManagementAllUsers"
                    element={<UserManagementAllUsers />}
                  />
                  <Route
                    path="ListOfObsoleteItems"
                    element={<FormDeletedList />}
                  />
                  <Route path="MainInformation" element={<MainInformation />} />
                  <Route
                    path="stagnant-materials/Permission/:id"
                    element={<Permission />}
                  />
                  <Route
                    path="UserManagementAllUsers/Permission/:id"
                    element={<Permission />}
                  />
                  <Route
                    path="MainInformation/SetPermissionToGroup/:id"
                    element={<SetPermissionToGroup />}
                  />
                  <Route path="AllLog" element={<AllLog />} />
                  <Route
                    path="stagnant-materials/ProductStagnant/:id"
                    element={<ProductStagnant />}
                  />
                  <Route
                    path="stagnant-materials/SetPermissionFromEntities/:id"
                    element={<SetPermissionFromEntities />}
                  />
                  <Route
                    path="UserManagementFromEntities/SetPermissionFromEntities/:id"
                    element={<SetPermissionFromEntities />}
                  />
                  <Route
                    path="BookObsoleteMaterial"
                    element={<BookObsoleteMaterial />}
                  />
                  <Route path="Dashboard" element={<Dashboard />} />
                  <Route path="archive" element={<Archive />} />
                  <Route
                    path="dashboard-Entity"
                    element={<DashboardEntity />}
                  />
                  <Route
                    path="ListOfObsoleteItems/Material-Overview/:id"
                    element={<MaterialOverview />}
                  />
                  <Route
                    path="Material-Overview/:id"
                    element={<MaterialOverview />}
                  />
                  <Route
                    path="Obsolete-Material-Approve-Admin/Material-Overview/:id"
                    element={<MaterialOverview />}
                  />
                  <Route
                    path="Obsolete-Material-Approve-Super-Admin/Material-Overview/:id"
                    element={<MaterialOverview />}
                  />
                  <Route
                    path="archive/information-Material/:id"
                    element={<InformationMaterialArchive />}
                  />
                  <Route
                    path="Obsolete-Material-Approve-Admin"
                    element={<FormObsoleteMaterialApproveAdmin />}
                  />
                  <Route
                    path="Notification/Obsolete-Material-Approve-Admin"
                    element={<FormObsoleteMaterialApproveAdmin />}
                  />
                  <Route
                    path="Obsolete-Material-Approve-Super-Admin"
                    element={<FormObsoleteMaterialApproveSuperAdminRoot />}
                  />
                  <Route
                    path="Notification"
                    element={<NotificationObsoletedMaterial />}
                  />
                  <Route
                    path="Notification/Obsolete-Material-Approve-Super-Admin"
                    element={<FormObsoleteMaterialApproveSuperAdminRoot />}
                  />
                  <Route
                    path="Approval-reservations"
                    element={<ApproveBooked />}
                  />
                  <Route
                    path="Notification/Approval-reservations"
                    element={<ApproveBooked />}
                  />
                  <Route
                    path="Notification/Product-Overview/:id"
                    element={<ProductOverview />}
                  />
                  <Route
                    path="approve-Admin-To-send-Request-Booking"
                    element={<ApproveAdmainTobsendRequestBooking />}
                  />
                  <Route
                    path="Product-Obsolete/:id"
                    element={<ProductStagnant />}
                  />
                  <Route
                    path="Product-Overview/:id"
                    element={<ProductOverview />}
                  />
                  {/* report */}
                  <Route
                    path="Dashboard/generate-report"
                    element={<GenerateReport />}
                  />
                  <Route
                    path="dashboard-Entity/generate-report"
                    element={<GenerateReport />}
                  />

                  {/* refresh token */}
                  <Route path="all-category" element={<AllCategory />} />
                  <Route path="help-platform" element={<HelpAboutProject />} />
                </Route>
              </Route>
              {/* Warehouse Management System Routes (Application ID: 2) */}
              <Route element={<ProtectedApplicationRoute applicationId={2} />}>
                <Route element={<PrivateRoutes />}>
                  <Route
                    path="warehouse-management"
                    element={<RootWarehouse />}
                  >
                    <Route index element={<HomeWharhouse />} />
                    <Route path="warehouse-home" element={<HomeWharhouse />} />

                    <Route
                      path="management-data-store"
                      element={<ManagementDataStore />}
                    />

                    <Route
                      path="warehouse-Notification"
                      element={<WarehouseNotification />}
                    />

                    <Route
                      path="management-data-store/StoreData"
                      element={<StoreData />}
                    />
                    <Route
                      path="management-data-store/material-movement"
                      element={<MaterialMovement />}
                    />

                    <Route
                      path="material-movement"
                      element={<MaterialMovement />}
                    />
                    <Route
                      path="Warehouse-Notification/material-movement"
                      element={<MaterialMovement />}
                    />
                    <Route
                      path="management-data-store/Inventory/material-movement"
                      element={<MaterialMovement />}
                    />
                    <Route
                      path="management-data-store/material-movement/Warehouse-out-Records"
                      element={<MaterialMovementExport />}
                    />
                    <Route
                      path="management-data-store/print-Inventory"
                      element={<PrintInventory />}
                    />
                    <Route
                      path="management-data-store/Inventory/print-Inventory"
                      element={<PrintInventory />}
                    />
                    {/*  document purchase */}
                    <Route
                      path="manage-documents"
                      element={<ManageDocuments />}
                    />
                    <Route
                      path="manage-documents/purchases-material"
                      element={<PurchasesData />}
                    />

                    {/* document sales */}

                    <Route
                      path="manage-documents/sales-material"
                      element={<SalesMaterial />}
                    />
                       <Route
                      path="manage-documents/return-material"
                      element={<InventoryReturnManagement />}
                    />

                    <Route
                      path="general-Setting/follow-up-labs"
                      element={<LabMinitoring />}
                    />
                    <Route path="AllLog" element={<AllLog />} />
                    <Route path="logEntity" element={<LogById />} />
                    <Route
                      path="log-warehouse-entity"
                      element={<LogWarehouseById />}
                    />
                    <Route path="profile" element={<PersonalProfile />} />
                    <Route
                      path="UserManagementFromEntities"
                      element={<UserManagementFromEntities />}
                    />
                    {/* report management */}
                    <Route
                      path="main-page-report"
                      element={<MainPageForReport />}
                    />
                    <Route
                      path="monthly-inventory"
                      element={<MonthlyInventory />}
                    />
                    <Route
                      path="monthly-inventory/inventory-export-archive-monthly"
                      element={<InventoryExportArchiveMonthly />}
                    />
                    <Route
                      path="monthly-inventory/inventory-import-archive-monthly"
                      element={<InventoryImportArchiveMonthly />}
                    />
                    <Route
                      path="warehouse-store/Inventory/monthly-inventory"
                      element={<MonthlyInventory />}
                    />
                    <Route
                      path="annual-inventory"
                      element={<AnnualInventory />}
                    />
                    <Route
                      path="inventory-import-archive-monthly"
                      element={<InventoryImportArchiveMonthly />}
                    />
                    <Route
                      path="inventory-archive-monthly"
                      element={<InventoryDataArchive />}
                    />

                    {/* archive annual */}
                    <Route
                      path="inventory-archive-annual"
                      element={<InventoryArchiveAnnual />}
                    />

                    {/* Month Lock System Routes */}
                    <Route path="monthly-locks" element={<MonthlyLocks />} />
                    <Route
                      path="unlock-requests"
                      element={<UnlockRequests />}
                    />
                    <Route path="audit-log" element={<AuditLog />} />

                    <Route
                      path="warehouse-mange"
                      element={<WarehouseMange />}
                    />
                    <Route
                      path="opening-balance-import"
                      element={<OpeningBalanceImport />}
                    />

                    <Route path="lab-manage" element={<LabsEntity />} />
                    <Route path="Factory-manage" element={<Factories />} />
                  </Route>
                </Route>
              </Route>
              <Route element={<ProtectedApplicationRoute applicationId={3} />}>
                <Route path="platform-management" element={<Root3 />}>
                  <Route index element={<Pages />} />
                  <Route path="stagnant-materials_home" element={<Pages />} />
                  <Route
                    path="UserManagementAllUsers"
                    element={<UserManagementAllUsers />}
                  />
                  <Route path="MainInformation" element={<MainInformation />} />
                  <Route
                    path="UserManagementAllUsers/Permission/:id"
                    element={<Permission />}
                  />
                  <Route
                    path="MainInformation/SetPermissionToGroup/:id"
                    element={<SetPermissionToGroup />}
                  />
                  <Route
                    path="Obsolete-Material-Approve-Super-Admin/Material-Overview/:id"
                    element={<MaterialOverview />}
                  />
                  <Route path="AllLog" element={<AllLog />} />
                  <Route path="profile" element={<PersonalProfile />} />
                  <Route
                    path="Notification"
                    element={<NotificationObsoletedMaterial />}
                  />
                  <Route
                    path="Notification/Obsolete-Material-Approve-Super-Admin"
                    element={<FormObsoleteMaterialApproveSuperAdminRoot />}
                  />
                  <Route path="monitoring" element={<Monitoring />} />

                  <Route
                    path="entity-management"
                    element={<EntityManagement />}
                  />
                  <Route
                    path="entity-management/entity-details/:id"
                    element={<EntityDetails />}
                  />
                  <Route path="document-edit" element={<DocumentEdit />} />
                  <Route path="document-count" element={<DocumentCount />} />
                </Route>
              </Route>
              <Route element={<ProtectedApplicationRoute applicationId={4} />}>
                <Route path="customer-platform-management" element={<Root4 />}>
                  <Route index element={<UserManagementFromEntities />} />
                  <Route
                    path="user-management-from-entity"
                    element={<UserManagementFromEntities />}
                  />
                  <Route path="profile" element={<PersonalProfile />} />
                  <Route
                    path="Notification"
                    element={<NotificationObsoletedMaterial />}
                  />
                  <Route
                    path="Log-stagnant-entity"
                    element={<LogObsoleteById />}
                  />
                  <Route
                    path="invoice-template-designer"
                    element={<InvoiceTemplateDesigner />}
                  />
                  <Route
                    path="document-field-settings"
                    element={<DocumentFieldSettings />}
                  />
                  <Route path="help-platform" element={<HelpAboutProject />} />
                </Route>
              </Route>
            </Route>
            {/*  public routes */}
            <Route path="/help-platform" element={<HelpAboutProject />} />
            <Route path="/all-category" element={<AllCategory1 />} />
            <Route path="/Product-Obsolete/:id" element={<ProductStagnant />} />
            <Route path="/Product-Overview/:id" element={<ProductOverview />} />
            <Route path="/about-page" element={<AboutPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </AccountActivationMiddleware>
    </BrowserRouter>
  );
}
