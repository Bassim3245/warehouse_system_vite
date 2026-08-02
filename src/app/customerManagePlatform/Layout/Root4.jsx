import { useSelector } from "react-redux";
import Root from "../../../components/Layout/Root";
import AccountBox from "@mui/icons-material/AccountBox";
import Info from "@mui/icons-material/Info";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import NotificationAdd from "@mui/icons-material/NotificationAdd";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/image/computer-design-colorful-vector.png";
import { Draw } from "@mui/icons-material";
import { Settings } from "lucide-react";
export default function Root4() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();
  const Route1 = [
    {
      text: t("layout.MangePermission"),
      icon: <ManageAccounts />,
      path: "user-management-from-entity", // Fixed path to include a leading slash
      checkPermission: roles?.management_user_from_entity?._id,
    },
    {
      text: t("layout.companyInformation"),
      icon: <AccountBox />,
      path: "profile", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
  ];
  const Route2 = [
    {
      text: t("layout.Notification"),
      icon: <NotificationAdd />,
      path: "Notification", // Fixed path to include a leading slash
      checkPermission: roles?.management_Nonfiction?._id,
    },
    // {
    //   text: t("layout.logEntity"),
    //   icon: <EventAvailable />,
    //   path: "Log-stagnant-entity", // Fixed path to include a leading slash
    //   checkPermission: roles?.show_log_entity?._id,
    // },
    {
      text: t("layout.User Manual"),
      icon: <Info />,
      path: "help-platform", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
    {
      text: t("تصميم قالب الفاتورة"),
      icon: < Draw />,
      path: "invoice-template-designer", // Fixed path to include a leading slash
      checkPermission: roles?.show_page_design_invoice_document?._id,
    },
    {
      text: t("إعدادات الحقول"),
      icon: <Settings />,
      path: "document-field-settings",
      checkPermission: roles?.show_page_manage_document_field_dynamically?._id,
    },
  ];

  return (
    <Root
      Route2={Route2}
      Route1={Route1}
      urlApi="getNotification"
      permission={roles.management_Nonfiction?._id}
      category_id={4}
      title={t("أدارة المنصة")}
      logo={logo}
    />
  );
}
