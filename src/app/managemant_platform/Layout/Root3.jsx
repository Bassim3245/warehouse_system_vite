import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import Root from "../../../components/Layout/Root";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Grading from "@mui/icons-material/Grading";
import GroupAdd from "@mui/icons-material/GroupAdd";
import Home from "@mui/icons-material/Home";
import Info from "@mui/icons-material/Info";
import Monitor from "@mui/icons-material/Monitor";
import NotificationAdd from "@mui/icons-material/NotificationAdd";
import Settings from "@mui/icons-material/Settings";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/image/computer-design-colorful-vector.png";
import { View } from "lucide-react";
export default function Root3() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();
  const Route1 = [
    {
      text: t("layout.nationalBank"),
      icon: <Home />,
      path: "stagnant-materials_home",
      checkPermission: roles?.Show_obSolete?._id,
    },

    {
      text: t("layout.MangeUser"),
      icon: <GroupAdd />,
      path: "UserManagementAllUsers", // Fixed path to include a leading slash
      checkPermission: roles?.show_all_data_users?._id,
    },
    {
      text: t("layout.System Administrators Approval"),
      icon: <Grading />,
      path: "Obsolete-Material-Approve-Super-Admin", // Fixed path to include a leading slash
      checkPermission: roles?.approve_Super_admin_root_to_request?._id,
    },
    {
      text: t("layout.BasicInformation"),
      icon: <Settings />,
      path: "MainInformation", // Fixed path to include a leading slash
      checkPermission: roles?.setting_information?._id,
    },
    {
      text: t("layout.Notification"),
      icon: <NotificationAdd />,
      path: "Notification", // Fixed path to include a leading slash
      checkPermission: roles?.management_Nonfiction?._id,
    },
  ];
  const Route2 = [
    {
      text: t("أدارة الشركت"),
      icon: <View />,
      path: "entity-management", // Fixed path to include a leading slash
      checkPermission: roles?.management_Nonfiction?._id,
    },
    {
      text: t("layout.log"),
      icon: <EventAvailable />,
      path: "AllLog", // Fixed path to include a leading slash
      checkPermission: roles?.show_log?._id,
    },
    {
      text: t("layout.log"),
      icon: <Monitor />,
      path: "monitoring", // Fixed path to include a leading slash
      checkPermission: roles?.show_log?._id,
    },
    {
      text: t("تعديل المستندات"),
      icon: <Grading />,
      path: "document-edit",
      checkPermission: roles?.setting_information?._id,
    },
    {
      text: t("عداد المستندات"),
      icon: <Settings />,
      path: "document-count",
      checkPermission: roles?.setting_information?._id,
    },
    {
      text: t("layout.User Manual"),
      icon: <Info />,
      path: "help-platform", // Fixed path to include a leading slash
      checkPermission: roles?.show_profile?._id,
    },
  ];

  return (
    <Root
      Route2={Route2}
      Route1={Route1}
      urlApi="getNotification"
      permission={roles.management_Nonfiction?._id}
      category_id={3}
      title={t("أدارة المنصة")}
      logo={logo}
    />
  );
}
