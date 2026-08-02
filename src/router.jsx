import React, { Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

// Core components - NOT lazy loaded
import Loader from "./components/reusableComponent/Loader";
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
import HomeObesoloteMaterial from "./app/obesoloteMaterial/Page/home/Home";
import HomeWharhouse from "./app/warehouse_management/Pages/Home/Home";
import InventoryExportArchiveMonthly from "./app/warehouse_management/Pages/Archive/commen/inventoryExportArchiveMonthly";
import OpeningBalanceImport from "./app/warehouse_management/Pages/excelForm/uploadFileExcelPage";
import InventoryReturnManagement from "./app/warehouse_management/Pages/Inventory/return/InventoryReturnManagement";

// ---------------------------------------------------------------------------
// Lazy loaded components - Dashboard Pages
// ---------------------------------------------------------------------------
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
const InfoSelectionPage = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/managermantReports/InfoSelectionPage"),
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
const MonthLockForm = React.lazy(
  () => import("./app/warehouse_management/Pages/MonthlyLocks/MonthLockForm"),
);
const UnlockRequests = React.lazy(
  () =>
    import("./app/warehouse_management/Pages/UnlockRequests/UnlockRequests"),
);
const AuditLog = React.lazy(
  () => import("./app/warehouse_management/Pages/AuditLog/AuditLog"),
);

// ---------------------------------------------------------------------------
// Helper: wraps any element in Suspense with a Loader fallback
// ---------------------------------------------------------------------------
const lazy = (element) => (
  <Suspense fallback={<Loader />}>{element}</Suspense>
);

// ---------------------------------------------------------------------------
// Root layout: provides AccountActivationMiddleware inside the router context
// AccountActivationMiddleware uses useLocation(), so it MUST live inside
// the router tree (i.e., as a route element), not outside RouterProvider.
// ---------------------------------------------------------------------------
const RootLayout = () => (
  <AccountActivationMiddleware>
    <Outlet />
  </AccountActivationMiddleware>
);

// ---------------------------------------------------------------------------
// Router definition using Data Routes API
// ---------------------------------------------------------------------------
export const router = createBrowserRouter([
  // ── Root layout wraps ALL routes so AccountActivationMiddleware is always active
  {
    element: <RootLayout />,
    children: [
      // ── Public / unauthenticated routes ──────────────────────────────────
      { path: "/login", element: <Login /> },
      { path: "/", element: <MainHome /> },
      { path: "/unauthorized", element: <Unauthorized /> },

      // ── Protected routes (require valid refreshToken cookie) ──────────────
      {
        element: <PrivateRoutes />,
        children: [
          // ── Application 1: Stagnant Materials ────────────────────────────
          {
            element: <ProtectedApplicationRoute applicationId={1} />,
            children: [
              {
                path: "stagnant-materials",
                element: <Root2 />,
                children: [
                  { index: true, element: <HomeObesoloteMaterial /> },
                  { path: "stagnant-materials_home", element: <HomeObesoloteMaterial /> },
                  { path: "UserManagementAllUsers", element: lazy(<UserManagementAllUsers />) },
                  { path: "ListOfObsoleteItems", element: lazy(<FormDeletedList />) },
                  { path: "MainInformation", element: lazy(<MainInformation />) },
                  { path: "stagnant-materials/Permission/:id", element: lazy(<Permission />) },
                  { path: "UserManagementAllUsers/Permission/:id", element: lazy(<Permission />) },
                  { path: "MainInformation/SetPermissionToGroup/:id", element: lazy(<SetPermissionToGroup />) },
                  { path: "AllLog", element: lazy(<AllLog />) },
                  { path: "stagnant-materials/ProductStagnant/:id", element: lazy(<ProductStagnant />) },
                  { path: "stagnant-materials/SetPermissionFromEntities/:id", element: lazy(<SetPermissionFromEntities />) },
                  { path: "UserManagementFromEntities/SetPermissionFromEntities/:id", element: lazy(<SetPermissionFromEntities />) },
                  { path: "BookObsoleteMaterial", element: lazy(<BookObsoleteMaterial />) },
                  { path: "Dashboard", element: lazy(<Dashboard />) },
                  { path: "archive", element: lazy(<Archive />) },
                  { path: "dashboard-Entity", element: lazy(<DashboardEntity />) },
                  { path: "ListOfObsoleteItems/Material-Overview/:id", element: lazy(<MaterialOverview />) },
                  { path: "Material-Overview/:id", element: lazy(<MaterialOverview />) },
                  { path: "Obsolete-Material-Approve-Admin/Material-Overview/:id", element: lazy(<MaterialOverview />) },
                  { path: "Obsolete-Material-Approve-Super-Admin/Material-Overview/:id", element: lazy(<MaterialOverview />) },
                  { path: "archive/information-Material/:id", element: lazy(<InformationMaterialArchive />) },
                  { path: "Obsolete-Material-Approve-Admin", element: lazy(<FormObsoleteMaterialApproveAdmin />) },
                  { path: "Notification/Obsolete-Material-Approve-Admin", element: lazy(<FormObsoleteMaterialApproveAdmin />) },
                  { path: "Obsolete-Material-Approve-Super-Admin", element: lazy(<FormObsoleteMaterialApproveSuperAdminRoot />) },
                  { path: "Notification", element: lazy(<NotificationObsoletedMaterial />) },
                  { path: "Notification/Obsolete-Material-Approve-Super-Admin", element: lazy(<FormObsoleteMaterialApproveSuperAdminRoot />) },
                  { path: "Approval-reservations", element: lazy(<ApproveBooked />) },
                  { path: "Notification/Approval-reservations", element: lazy(<ApproveBooked />) },
                  { path: "Notification/Product-Overview/:id", element: lazy(<ProductOverview />) },
                  { path: "approve-Admin-To-send-Request-Booking", element: lazy(<ApproveAdmainTobsendRequestBooking />) },
                  { path: "Product-Obsolete/:id", element: lazy(<ProductStagnant />) },
                  { path: "Product-Overview/:id", element: lazy(<ProductOverview />) },
                  // Reports
                  { path: "Dashboard/generate-report", element: lazy(<GenerateReport />) },
                  { path: "dashboard-Entity/generate-report", element: lazy(<GenerateReport />) },
                  // Misc
                  { path: "all-category", element: lazy(<AllCategory />) },
                  { path: "help-platform", element: lazy(<HelpAboutProject />) },
                ],
              },
            ],
          },

          // ── Application 2: Warehouse Management ──────────────────────────
          {
            element: <ProtectedApplicationRoute applicationId={2} />,
            children: [
              {
                element: <PrivateRoutes />,
                children: [
                  {
                    path: "warehouse-management",
                    element: <RootWarehouse />,
                    children: [
                      { index: true, element: <HomeWharhouse /> },
                      { path: "warehouse-home", element: <HomeWharhouse /> },
                      { path: "management-data-store", element: lazy(<ManagementDataStore />) },
                      { path: "warehouse-Notification", element: lazy(<WarehouseNotification />) },
                      { path: "management-data-store/StoreData", element: lazy(<StoreData />) },
                      { path: "management-data-store/material-movement", element: lazy(<MaterialMovement />) },
                      { path: "material-movement", element: lazy(<MaterialMovement />) },
                      { path: "Warehouse-Notification/material-movement", element: lazy(<MaterialMovement />) },
                      { path: "management-data-store/Inventory/material-movement", element: lazy(<MaterialMovement />) },
                      { path: "management-data-store/material-movement/Warehouse-out-Records", element: lazy(<MaterialMovementExport />) },
                      { path: "management-data-store/print-Inventory", element: lazy(<PrintInventory />) },
                      { path: "management-data-store/Inventory/print-Inventory", element: lazy(<PrintInventory />) },
                      // Document / Purchase / Sales
                      { path: "manage-documents", element: lazy(<ManageDocuments />) },
                      { path: "manage-documents/purchases-material", element: lazy(<PurchasesData />) },
                      { path: "manage-documents/sales-material", element: lazy(<SalesMaterial />) },
                      { path: "manage-documents/return-material", element: <InventoryReturnManagement /> },
                      // Labs
                      { path: "general-Setting/follow-up-labs", element: lazy(<LabMinitoring />) },
                      // Logs
                      { path: "AllLog", element: lazy(<AllLog />) },
                      { path: "logEntity", element: lazy(<LogById />) },
                      { path: "log-warehouse-entity", element: lazy(<LogWarehouseById />) },
                      // Profile
                      { path: "profile", element: lazy(<PersonalProfile />) },
                      { path: "UserManagementFromEntities", element: lazy(<UserManagementFromEntities />) },
                      // Reports
                      { path: "main-page-report", element: lazy(<MainPageForReport />) },
                      { path: "main-page-report/info-selection", element: lazy(<InfoSelectionPage />) },
                      // Archive - Monthly
                      { path: "monthly-inventory", element: lazy(<MonthlyInventory />) },
                      { path: "monthly-inventory/inventory-export-archive-monthly", element: <InventoryExportArchiveMonthly /> },
                      { path: "monthly-inventory/inventory-import-archive-monthly", element: lazy(<InventoryImportArchiveMonthly />) },
                      { path: "warehouse-store/Inventory/monthly-inventory", element: lazy(<MonthlyInventory />) },
                      { path: "inventory-import-archive-monthly", element: lazy(<InventoryImportArchiveMonthly />) },
                      { path: "inventory-archive-monthly", element: lazy(<InventoryDataArchive />) },
                      // Archive - Annual
                      { path: "annual-inventory", element: lazy(<AnnualInventory />) },
                      { path: "inventory-archive-annual", element: lazy(<InventoryArchiveAnnual />) },
                      // Month Lock System
                      { path: "monthly-locks", element: lazy(<MonthlyLocks />) },
                      { path: "monthly-locks/add", element: lazy(<MonthLockForm />) },
                      { path: "unlock-requests", element: lazy(<UnlockRequests />) },
                      { path: "audit-log", element: lazy(<AuditLog />) },
                      // Warehouse & Factory management
                      { path: "warehouse-mange", element: lazy(<WarehouseMange />) },
                      { path: "opening-balance-import", element: <OpeningBalanceImport /> },
                      { path: "lab-manage", element: lazy(<LabsEntity />) },
                      { path: "Factory-manage", element: lazy(<Factories />) },
                    ],
                  },
                ],
              },
            ],
          },

          // ── Application 3: Platform Management ───────────────────────────
          {
            element: <ProtectedApplicationRoute applicationId={3} />,
            children: [
              {
                path: "platform-management",
                element: <Root3 />,
                children: [
                  { index: true, element: lazy(<Pages />) },
                  { path: "stagnant-materials_home", element: lazy(<Pages />) },
                  { path: "UserManagementAllUsers", element: lazy(<UserManagementAllUsers />) },
                  { path: "MainInformation", element: lazy(<MainInformation />) },
                  { path: "UserManagementAllUsers/Permission/:id", element: lazy(<Permission />) },
                  { path: "MainInformation/SetPermissionToGroup/:id", element: lazy(<SetPermissionToGroup />) },
                  { path: "Obsolete-Material-Approve-Super-Admin/Material-Overview/:id", element: lazy(<MaterialOverview />) },
                  { path: "AllLog", element: lazy(<AllLog />) },
                  { path: "profile", element: lazy(<PersonalProfile />) },
                  { path: "Notification", element: lazy(<NotificationObsoletedMaterial />) },
                  { path: "Notification/Obsolete-Material-Approve-Super-Admin", element: lazy(<FormObsoleteMaterialApproveSuperAdminRoot />) },
                  { path: "monitoring", element: lazy(<Monitoring />) },
                  { path: "entity-management", element: lazy(<EntityManagement />) },
                  { path: "entity-management/entity-details/:id", element: lazy(<EntityDetails />) },
                  { path: "document-edit", element: lazy(<DocumentEdit />) },
                  { path: "document-count", element: lazy(<DocumentCount />) },
                ],
              },
            ],
          },

          // ── Application 4: Customer Platform Management ───────────────────
          {
            element: <ProtectedApplicationRoute applicationId={4} />,
            children: [
              {
                path: "customer-platform-management",
                element: <Root4 />,
                children: [
                  { index: true, element: lazy(<UserManagementFromEntities />) },
                  { path: "user-management-from-entity", element: lazy(<UserManagementFromEntities />) },
                  { path: "profile", element: lazy(<PersonalProfile />) },
                  { path: "Notification", element: lazy(<NotificationObsoletedMaterial />) },
                  { path: "Log-stagnant-entity", element: lazy(<LogObsoleteById />) },
                  { path: "invoice-template-designer", element: lazy(<InvoiceTemplateDesigner />) },
                  { path: "document-field-settings", element: lazy(<DocumentFieldSettings />) },
                  { path: "help-platform", element: lazy(<HelpAboutProject />) },
                ],
              },
            ],
          },
        ],
      },

      // ── Public routes (no auth required) ─────────────────────────────────
      { path: "/help-platform", element: lazy(<HelpAboutProject />) },
      { path: "/all-category", element: lazy(<AllCategory1 />) },
      { path: "/Product-Obsolete/:id", element: lazy(<ProductStagnant />) },
      { path: "/Product-Overview/:id", element: lazy(<ProductOverview />) },
      { path: "/about-page", element: lazy(<AboutPage />) },

      // ── Catch-all ─────────────────────────────────────────────────────────
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);
