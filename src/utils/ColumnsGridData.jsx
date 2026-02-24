// getWarehouseColumns.js
import Brightness1 from "@mui/icons-material/Brightness1";
import Close from "@mui/icons-material/Close";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import DoneOutline from "@mui/icons-material/DoneOutline";
import EnhancedEncryption from "@mui/icons-material/EnhancedEncryption";
import OpenInNew from "@mui/icons-material/OpenInNew";
import WhereToVote from "@mui/icons-material/WhereToVote";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import DropDownGrid from "../components/reusableComponent/CustomMennu";
import StoreFormModel from "../app/warehouse_management/Pages/managemnatStoreData/FormModel";
import {
  formatCurrency,
  FormatDataNumber,
  formatDate,
  formatDateAr,
  formatDateYearsMonth,
} from "./formatData";
import UserMangeForm from "../app/managemant_platform/MangemantUsers/UserManageForm";
import FromIsDeleted from "../app/obesoloteMaterial/Page/FromIsObsolete/FromObsolete";
import { handleContactedData } from "./opsoloteUtils";
import InformationMaterialBooked from "../app/obesoloteMaterial/Page/FromIsObsolete/InformationMaterialBooked";
import { DeleteItem, renderMenuItem } from "./Function";
import EntityCreateUser from "../app/customerManagePlatform/MangemantUsers/entityCreateUser";
import { getToken } from "./handelCookie";
import ModelEditImportData from "../app/warehouse_management/Pages/Inventory/Purchases/components/ModelEditImportData";
import InventoryExportModel from "../app/warehouse_management/Pages/Inventory/selas/components/ExportInventoryModel";
export const getWarehouseColumns = ({
  t,
  setRefreshButton,
  dataUserById,
  dataUnitMeasuring,
  dataProduct,
  selectedWarehouse,
  dataUserLab,
  renderMenuItem,
  openMovement,
  hierarchyConfig,
  setAnchorEl,
  roles,
  applicationPermission,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 100 },
    {
      field: "cod_material",
      headerName: t("رمز المادة"),
      flex: 1,
    },
    {
      field: "name_of_material",
      headerName: t("أسم المادة"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "measuring_unit",
      headerName: t("وحدة القياس"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "specification",
      headerName: t("مواصفات المادة"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "balance",
      headerName: t("الرصيد الكلي للمادة"),
      flex: 1,
      renderCell: (params) => <p>{FormatDataNumber(params.row.balance)}</p>,
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => (
        <DropDownGrid>

          <StoreFormModel
            editMode={true}
            addInventory="addInventory"
            dataUnitMeasuring={dataUnitMeasuring}
            dataProduct={dataProduct}
            setRefreshButton={setRefreshButton}
            dataUserById={dataUserById}
            storeData={params?.row}
            warehouseId={selectedWarehouse}
            dataUserLab={dataUserLab}
            hierarchyConfig={hierarchyConfig}
          />
          <Divider sx={{ my: 0.5 }} />

          {/* Optional delete menu */}
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.id,
                setRefreshButton,
                setAnchorEl,
                getToken,
                "warehouse/deleteStorDataById",
                roles?.warehouse_page?._id,
                applicationPermission?.warehouseSystem?._id
              ),
            DeleteOutlined,
            "حذف"
          )}
          {renderMenuItem(
            "informationProduct",
            () => openMovement(params?.row?.id, "material-movement"),
            OpenInNew,
            "حركات المادة"
          )}
        </DropDownGrid>
      ),
    },
  ];
export const inventoryColumnGrid = ({
  t,
  renderMenuItem,
  openMovement,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 44 },
    {
      field: "cod_material",
      headerName: t("رمز المادة"),
      flex: 1,
    },
    {
      field: "name_of_material",
      headerName: t("أسم المادة"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "beneficiary",
      headerName: t("الجهة الموردة او المصدرة"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "specification",
      headerName: t("مواصفات المادة"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "document_type",
      headerName: t("نوع المستند"),
      flex: 1,
    },
    {
      field: "quantity",
      headerName: t("الكمية الصادرة أو الواردة"),
      flex: 1,
    },
    {
      field: "remaining_quantity",
      headerName: t("الكمية المتبقية"),
      flex: 1,
    },
    {
      field: "price",
      headerName: t(" السعر المفرد  "),
      flex: 1,
      renderCell: (params) => <p>{FormatDataNumber(params.row.price)}</p>,
    },
    {
      field: "total_price",
      headerName: t("السعر الكلي"),
      flex: 1,
      renderCell: (params) => (
        <p>{FormatDataNumber(params.row.price * params.row.quantity)}</p>
      ),
    },
    {
      field: "balance",
      headerName: t("الرصيد"),
      flex: 1,
    },
    {
      field: "production_date",
      headerName: t("تاريخ الشراء"),
      flex: 1, // Adjust flex value according to preference
      renderCell: (params) => (
        <p>{formatDateYearsMonth(params?.row?.puchase_date)}</p>
      ),
    },
    {
      field: "expiry_date",
      headerName: t("تاريخ انتهاء الصلاحية"),
      flex: 1, // Adjust flex value according to preference
      renderCell: (params) => (
        <p>{formatDateYearsMonth(params?.row?.puchase_date)}</p>
      ),
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => (
        <DropDownGrid>

          {renderMenuItem(
            "informationProduct",
            () => openMovement(params?.row?.material_id),
            OpenInNew,
            "حركات المادة"
          )}
        </DropDownGrid>
      ),
    },
  ];
export const userColumnGrid = ({
  t,
  token,
  setRefreshButton,
  Ministries,
  Entities,
  DataGovernorate,
  DataJobTitle,
  dataGroup,
  setAnchorEl,
  setDelete,
  handleToggle,
  activeStatuses,
  AddPermission,
  renderMenuItem,
  applicationPermission,
  roles,
  DataApplicationPermission,
  rtl,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "ministries",
      headerName: t("userManager.Ministry name"),
      flex: 1,
    },
    {
      field: "Entities_name",
      headerName: t("userManager.Entity name"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "user_name",
      headerName: t("userManager.Username"),
      flex: 1,
    },
    {
      field: "governorate_name",
      headerName: t("userManager.Entity address"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "email",
      headerName: t("userManager.Email"),
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: t("userManager.Phone number"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "role_label",
      headerName: t("userManager.group name"),
      flex: 1,
    },
    {
      field: "warehouse_name",
      headerName: t("المخزن"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.warehouse_name || "----"}</p>;
      },
    },
    {
      field: "Laboratory_name",
      headerName: t("المعمل"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.Laboratory_name || "----"}</p>;
      },
    },
    {
      field: "Factories_name",
      headerName: t("المصنع"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.Factories_name || "----"}</p>;
      },
    },

    {
      field: "is_account_used",
      headerName: t("حالة الاستخدام"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        // Get the current status from activeStatuses state or fallback to row data
        const isAccountUsed =
          activeStatuses[params?.row?.active_id] !== undefined
            ? activeStatuses[params?.row?.active_id]
            : Boolean(params?.row?.is_account_used);

        return (
          <Button
            onClick={() => handleToggle(params, "account_used")}
            sx={{
              padding: "4px 8px",
              minWidth: "auto",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {isAccountUsed ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: "1px solid #4caf50",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                  minWidth: "100px",
                }}
              >
                <Brightness1
                  sx={{
                    fontSize: 12,
                    marginRight: rtl.dir === "ltr" ? "6px" : "0",
                    marginLeft: rtl.dir === "rtl" ? "6px" : "0",
                  }}
                  color="success"
                />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {t("مستخدم")}
                </Typography>
              </div>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: "1px solid #f44336",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  minWidth: "100px",
                }}
              >
                <Brightness1
                  sx={{
                    fontSize: 12,
                    marginRight: rtl.dir === "ltr" ? "6px" : "0",
                    marginLeft: rtl.dir === "rtl" ? "6px" : "0",
                  }}
                  color="error"
                />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {t("غير مستخدم")}
                </Typography>
              </div>
            )}
          </Button>
        );
      },
    },
    {
      field: "is_active",
      headerName: t("حالة الحساب"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        // Get the current status from activeStatuses state or fallback to row data
        const isUserActive =
          activeStatuses[`${params?.row?.active_id}_user_active`] !== undefined
            ? activeStatuses[`${params?.row?.active_id}_user_active`]
            : Boolean(params?.row?.is_active);
        return (
          <Button
            onClick={() => handleToggle(params, "user_active")}
            sx={{
              padding: "4px 8px",
              minWidth: "auto",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            {isUserActive ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: "1px solid #4caf50",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  backgroundColor: "#e8f5e8",
                  color: "#2e7d32",
                  minWidth: "100px",
                }}
              >
                <Brightness1
                  sx={{
                    fontSize: 12,
                    marginRight: rtl.dir === "ltr" ? "6px" : "0",
                    marginLeft: rtl.dir === "rtl" ? "6px" : "0",
                  }}
                  color="success"
                />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {t("userManager.active")}
                </Typography>
              </div>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  border: "1px solid #f44336",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  minWidth: "100px",
                }}
              >
                <Brightness1
                  sx={{
                    fontSize: 12,
                    marginRight: rtl.dir === "ltr" ? "6px" : "0",
                    marginLeft: rtl.dir === "rtl" ? "6px" : "0",
                  }}
                  color="error"
                />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {t("userManager.inactive")}
                </Typography>
              </div>
            )}
          </Button>
        );
      },
    },
    {
      field: "Action",
      headerName: t("userManager.Action"),
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <DropDownGrid>
          {
            <UserMangeForm
              editInfo={true}
              DataUsers={params?.row}
              Entities={Entities}
              Ministries={Ministries}
              DataGovernorate={DataGovernorate}
              DataJobTitle={DataJobTitle}
              dataGroup={dataGroup}
              setRefreshButton={setRefreshButton}
              DataApplicationPermission={DataApplicationPermission}
              applicationPermission={applicationPermission}
              roles={roles}
            />
          }
          {renderMenuItem(
            "permission",
            () => AddPermission(params?.row?.user_id),
            EnhancedEncryption,
            t("userManager.permission management")
          )}
          <Divider sx={{ my: 0.5 }} />
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.user_id,
                setDelete,
                setAnchorEl,
                token,
                "deleteDataUserManage",
                roles?.show_all_data_users?._id,
                applicationPermission?.materialObsolete?._id
              ),
            DeleteOutlined,
            t("delete")
          )}
        </DropDownGrid>
      ),
    },
  ];
export const entityUserColumnGrid = ({
  t,
  token,
  setRefreshButton,
  DataGovernorate,
  DataJobTitle,
  dataGroup,
  setAnchorEl,
  setDelete,
  AddPermission,
  renderMenuItem,
  applicationPermission,
  roles,
  rtl,
  dataUserById,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "ministries",
      headerName: t("userManager.Ministry name"),
      flex: 1,
    },
    {
      field: "Entities_name",
      headerName: t("userManager.Entity name"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "user_name",
      headerName: t("userManager.Username"),
      flex: 1,
    },
    {
      field: "governorate_name",
      headerName: t("userManager.Entity address"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "email",
      headerName: t("userManager.Email"),
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: t("userManager.Phone number"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "role_label",
      headerName: t("userManager.group name"),
      flex: 1,
    },
    {
      field: "warehouse_type",
      headerName: t("نوع المخزن"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.warehouse_type === "main" ? "المخزن الرئيسي" : params?.row?.warehouse_type === "production" ? "المخزن الانتاج التام" : "----"}</p>;
      },
    },
    {
      field: "warehouse_name",
      headerName: t("المخزن"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.warehouse_name || "----"}</p>;
      },
    },

    {
      field: "Laboratory_name",
      headerName: t("المعمل"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.Laboratory_name || "----"}</p>;
      },
    },
    {
      field: "Factories_name",
      headerName: t("المصنع"),
      flex: 1,
      renderCell: (params) => {
        return <p>{params?.row?.Factories_name || "----"}</p>;
      },
    },
    {
      field: "Action",
      headerName: t("userManager.Action"),
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <DropDownGrid>
          <EntityCreateUser
            editInfo={true}
            DataUsers={params?.row}
            DataGovernorate={DataGovernorate}
            DataJobTitle={DataJobTitle}
            dataGroup={dataGroup}
            setRefreshButton={setRefreshButton}
            rtl={rtl.dir}
            applicationPermission={applicationPermission}
            roles={roles}
            dataUserById={dataUserById}
          />
          {/* {renderMenuItem(
          "permission",
          () => AddPermission(params?.row?.user_id),
          EnhancedEncryption,
          t("userManager.permission management")
        )} */}
          {/* <Divider sx={{ my: 0.5 }} /> */}
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.user_id,
                setDelete,
                setAnchorEl,
                token,
                "deleteDataUserManage",
                roles?.show_all_data_users?._id,
                applicationPermission?.materialObsolete?._id
              ),
            DeleteOutlined,
            t("delete")
          )}
        </DropDownGrid>
      ),
    },
  ];
export const obsoleteMaterialGrideColumn = ({
  t,
  token,
  setRefreshButton,
  dataMainClass,
  dataSubClass,
  dataUnitMeasuring,
  renderMenuItem,
  applicationPermission,
  roles,
  dataUserById,
  setAnchorEl,
  setDelete,
  openProduct,
  Ministries,
  Entities,
  stateMaterial,
  rtl,
}) => [
    { field: "stagnant_id", headerName: "ID", hideable: false, width: 70 },
    {
      field: "index",
      headerName: "#",
      width: 33,
      renderCell: (params) => params.index,
    },
    {
      field: "main_Class_name",
      headerName: t("Stagnant.mainClass"),
      flex: 1, // Use flex to make the column width flexible
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "sub_class_name",
      headerName: t("Stagnant.subClass"),
      flex: 1.5, // Adjust flex value according to preference
      minWidth: "150px",
      maxWidth: "175px",
    },
    {
      field: "name_material",
      headerName: t("Stagnant.nameMaterial"),
      flex: 1.5, // Adjust flex value according to preference
    },
    {
      field: "measuring_unit",
      headerName: t("Stagnant.measuringUnit"),
      flex: 1, // Adjust flex value according to preference
    },
    {
      field: "Quantity",
      headerName: t("Stagnant.quantity"),
      flex: 1, // Adjust flex value according to preference
    },
    {
      field: "puchase_date",
      headerName: t("MaterialOverview.purchase date"),
      flex: 1, // Adjust flex value according to preference
      renderCell: (params) => <p>{formatDateAr(params.row.puchase_date)}</p>,
    },
    {
      field: "approved_admin",
      headerName: t("MaterialOverview.order status"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {params?.row?.approved_admin ? (
              <DoneOutline color="success" />
            ) : (
              <Close color="error" />
            )}
          </div>
        );
      },
    },
    {
      field: "approve_super_user_root",
      headerName: t("MaterialOverview.Technical support approval"),
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            {params?.row?.approve_super_user_root ? (
              <DoneOutline color="success" />
            ) : (
              <Close color="error" />
            )}
          </div>
        );
      },
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.5,
      renderCell: (params) => (
        <DropDownGrid>
          <FromIsDeleted
            dataUserById={dataUserById}
            dataSubClass={dataSubClass}
            dataMainClass={dataMainClass}
            dataUnitMeasuring={dataUnitMeasuring}
            setRefreshButton={setRefreshButton}
            label={"EditData"}
            DataProject={params?.row}
            token={token}
            roles={roles}
            applicationPermission={applicationPermission}
            Ministries={Ministries}
            Entities={Entities}
            stateMaterial={stateMaterial}
            rtl={rtl}
          />
          <Divider sx={{ my: 0.5 }} />
          {renderMenuItem(
            "delete",
            () =>
              DeleteItem(
                params?.row?.stagnant_id,
                setDelete,
                setAnchorEl,
                token,
                "deleteProjectById",
                roles?.view_data_obsolete?._id,
                applicationPermission?.materialObsolete._id
              ),
            DeleteOutlined,
            "حذف"
          )}
          {renderMenuItem(
            "informationProduct",
            () => openProduct(params?.row?.stagnant_id),
            OpenInNew,
            "معلومات المنتج"
          )}
          <Divider />
          {/* <BookingForm
          obsoleteMaterial={params?.row?.stagnant_id}
          Quantity={params?.row?.Quantity}
          dataUserById={dataUserById}
        /> */}
        </DropDownGrid>
      ),
    },
  ];
export const ApproveAdmainTobsendRequestBookingColumn = ({
  t,
  token,
  setRefreshButton,
  setLoading,
  renderMenuItem,
  applicationPermission,
  roles,
  BackendUrl,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "ministries",
      headerName: t("MaterialOverview.ministry name"),
      flex: 1,
    },
    {
      field: "Entities_name",
      headerName: t("MaterialOverview.entity name"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "name_material",
      headerName: t("MaterialOverview.Material Name"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1.4,
    },
    {
      field: "quantity",
      headerName: t("MaterialOverview.Quantity booked"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 0.9,
    },
    {
      field: "phone_number",
      minWidth: "150px",
      maxWidth: "175px",
      headerName: t("MaterialOverview.phone Number"),
      flex: 1,
    },
    {
      field: "created_book_at",
      minWidth: "150px",
      maxWidth: "175px",
      headerName: t("Stagnant.order date"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {formatDate(params.row.created_book_at)}
        </div>
      ),
    },
    {
      field: "approved_admin_upload_book",
      headerName: t("حالة الكتاب"),
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.approved_admin_to_upload_booked ? (
            <DoneOutline color="success" />
          ) : (
            <Close color="error" />
          )}
        </div>
      ),
    },
    {
      field: "approved_admin_send_request_book",
      headerName: t("حالة الحجز"),
      flex: 0.7,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.approved_admin_send_request_book ? (
            <DoneOutline color="success" />
          ) : (
            <Close color="error" />
          )}
        </div>
      ),
    },
    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) => (
        <div>
          <DropDownGrid>
            <Divider sx={{ my: 0.5 }} />
            {renderMenuItem(
              "delete",
              () =>
                DeleteItem(
                  params?.row?.book_id,
                  setRefreshButton,
                  null,
                  token,
                  "cancelRequest",
                  roles?.Booking_requests?._id,
                  applicationPermission.materialObsolete._id
                ),
              DeleteOutlined,
              t("ألغاء الطلب")
            )}
            {renderMenuItem(
              "contacted entity",
              () =>
                handleContactedData(
                  params.row.book_id,
                  "approvedAdminSendRequestBook"
                ),
              WhereToVote,
              t("Agree to send reservation request")
            )}
            {renderMenuItem(
              "contacted entity",
              () =>
                handleContactedData(
                  params?.row?.book_id,
                  "approvedAdminToUploadBook",
                  setRefreshButton,
                  setLoading,
                  token,
                  roles,
                  applicationPermission,
                  BackendUrl
                ),
              WhereToVote,
              t("Allow sending the official letter of transfer")
            )}
            <Divider />
            <InformationMaterialBooked materialInfo={params?.row} />
          </DropDownGrid>
        </div>
      ),
    },
  ];
// _importManagement
export const inventoryImportManagement = ({
  t,
  setRefreshButton,
  roles,
  applicationPermission,
  setAnchorEl,
  document,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "name_of_material",
      headerName: t("أسم المادة"),
      flex: 1,
    },
    {
      field: "price",
      headerName: "السعر",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.price ? formatCurrency(params?.row?.price) : "---"}
        </div>
      ),
    },
    {
      field: "measuring_unit",
      headerName: "وحدة القياس",
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: t("الكمية"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.quantity ? FormatDataNumber(params?.row?.quantity) : "---"}
        </div>
      ),
    },
    {
      field: "remaining_quantity",
      headerName: t("الكمية المتبقية"),
      minWidth: "150px",
      maxWidth: "175px",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.remaining_quantity ? FormatDataNumber(params?.row?.remaining_quantity) : "---"}
        </div>
      ),
    },
    {
      field: "total_price",
      headerName: t("المبلغ الكلي"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.quantity && params?.row?.price
            ? formatCurrency(params?.row?.quantity * params?.row?.price)
            : "---"}
        </div>
      ),
    },
    {
      field: "purchase_date",
      minWidth: "150px",
      maxWidth: "175px",
      headerName: t("تاريخ الشراء"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {formatDateAr(params?.row?.purchase_date)}
        </div>
      ),
    },

    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 1,
      renderCell: (params) =>

        <div>
          <DropDownGrid>
            <Divider sx={{ my: 0.5 }} />
            {
              !params.row.is_cancelled && (
                renderMenuItem(
                  "delete",
                  () =>
                    DeleteItem(
                      params.row.inventory_id,
                      setRefreshButton,
                      setAnchorEl,
                      null,
                      "warehouse/deleteImportTransactionData",
                      roles?.show_page_sales?._id,
                      applicationPermission?.warehouseSystem._id
                    ),
                  DeleteOutlined,
                  t("ألغاء الطلب")

                ))}

            <Divider />
            <ModelEditImportData inventoryData={params?.row} setRefreshButton={setRefreshButton} />
          </DropDownGrid>
        </div>

    },
  ];
// ============================== export transaction  ===================

export const inventoryExportTransactions = ({
  t,
  roles,
  applicationPermission,
  setRefreshButton,
  setAnchorEl,
  token,
  isInternalTransfer,
}) => [
    { field: "id", headerName: "ID", hideable: false },
    { field: "index", headerName: "#", width: 33 },
    {
      field: "material_name",
      headerName: t("أسم المادة"),
      flex: 1,
    },

    {
      field: "total_quantity",
      headerName: t("الكمية"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.total_quantity ? FormatDataNumber(params?.row?.total_quantity) : "---"}
        </div>
      ),
    },
    {
      field: "price",
      headerName: t(" السعر المفرد"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.price ? formatCurrency(params?.row?.price) : "---"}
        </div>
      ),
    },
    {
      field: "total_price",
      headerName: t(" السعر الكلي"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.total_amount
            ? formatCurrency(params?.row?.total_amount)
            : "---"}
        </div>
      ),
    },
    {
      field: "work_order_number",
      headerName: t("رقم أمر العمل "),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {params?.row?.work_order_number ? params?.row?.work_order_number : "---"}
        </div>
      ),
    },

    {
      field: "export_date",
      headerName: t("تاريخ التصدير"),
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          {formatDateAr(params.row.export_date)}
        </div>
      ),
    },

    {
      field: "Action",
      headerName: t("Action"),
      headerAlign: "center",
      flex: 0.8,
      renderCell: (params) =>


        <div>
          <DropDownGrid>
            <Divider sx={{ my: 0.5 }} />
            {
              // document?.is_complete 
              !params.row.is_cancelled && (
                renderMenuItem(
                  "delete",
                  () =>
                    DeleteItem(
                      params.row.export_id,
                      setRefreshButton,
                      setAnchorEl,
                      token,
                      "warehouse/deleteExportTransactionData",
                      roles?.show_page_sales?._id,
                      applicationPermission?.warehouseSystem._id
                    ),
                  DeleteOutlined,
                  t("ألغاء الطلب")

                ))}

            <Divider />
            <InventoryExportModel inventoryData={params?.row} setRefreshButton={setRefreshButton}  isInternalTransfer={isInternalTransfer} />
          </DropDownGrid>
        </div>
    },
  ];
// ============================== document information  ===================

export const documentArchiveMonthlyGrid = ({ t, openMovement, documentLabel, documentType, warehouseId }) => [
  { field: "id", headerName: "ID", hideable: false },
  { field: "index", headerName: "#", width: 33 },
  {
    field: "document_number",
    headerName: t("رقم الكتاب "),
    flex: 0.7,
  },
  {
    field: "document_type",
    headerName: t("نوع الكتاب"),
    flex: 1,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {params.row.document_type === "in" ? "مستند وارد" : "مستند صادر"}
      </div>
    ),
  },
  {
    field: "beneficiary",
    headerName: t("الجهة المستفيدة"),
    minWidth: "150px",
    maxWidth: "175px",
    flex: 1,
  },

  {
    field: "total_amount",
    headerName: "السعر الكلي",
    minWidth: "150px",
    maxWidth: "175px",
    flex: 1,
  },

  {
    field: "document_date",
    minWidth: "150px",
    maxWidth: "175px",
    headerName: t("تاريخ الكتاب"),
    flex: 1,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {formatDateYearsMonth(params.row.document_date)}
      </div>
    ),
  },

  {
    field: "archived_at",
    minWidth: "150px",
    maxWidth: "175px",
    headerName: t("تاريخ الارشفة"),
    flex: 1,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {formatDateYearsMonth(params.row.archived_at)}
      </div>
    ),
  },

  {
    field: "description",
    headerName: "ملاحظات",
    minWidth: "150px",
    maxWidth: "175px",
    flex: 1,
    renderCell: (params) => (
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        {params.row.description ? params.row.description : "-----"}
      </div>
    ),
  },

  {
    field: "action",
    headerName: "أجراء",
    minWidth: "150px",
    maxWidth: "175px",
    flex: 1,
    renderCell: (params) => (
      warehouseId && documentType && (
        <DropDownGrid
          GridTheme={{
            paperColor: "#ffffff",
            paperTextColor: "#333333",
            gloablTextColor: "#666666",
          }}
        >
          {renderMenuItem(
            "informationProduct",
            () => openMovement(params.row.id, documentType, warehouseId),
            OpenInNew,
            documentLabel
          )}
        </DropDownGrid>
      )
    ),
  },
];
