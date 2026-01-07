import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import Root from "../../../components/Layout/Root";
import Archive from "@mui/icons-material/Archive";
import Bookmarks from "@mui/icons-material/Bookmarks";
import ChecklistRtl from "@mui/icons-material/ChecklistRtl";
import ContentPasteOff from "@mui/icons-material/ContentPasteOff";
import Dashboard from "@mui/icons-material/Dashboard";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Grading from "@mui/icons-material/Grading";
import Home from "@mui/icons-material/Home";
import NotificationAdd from "@mui/icons-material/NotificationAdd";
import Rule from "@mui/icons-material/Rule";
import Streetview from "@mui/icons-material/Streetview";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function Root2() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();

  /** --------------------------------------------------------
   *  Memoized Route Lists (No re-render unless roles change)
   ----------------------------------------------------------*/
  const Route1 = useMemo(
    () => [
      {
        text: t("layout.nationalBank"),
        icon: <Home />,
        path: "stagnant-materials_home",
        checkPermission: roles?.Show_obSolete?._id,
      },
      {
        text: t("layout.Main class"),
        icon: <Streetview />,
        path: "All-Category",
        checkPermission: roles?.Show_obSolete?._id,
      },
      {
        text: t("layout.Statistics"),
        icon: <Dashboard />,
        path: "Dashboard",
        checkPermission: roles?.show_statistics?._id,
      },
      {
        text: t("layout.StatisticsEntity"),
        icon: <Dashboard />,
        path: "dashboard-Entity",
        checkPermission: roles?.show_statistics_entity?._id,
      },
      {
        text: t("layout.formObsoleteMartial"),
        icon: <ContentPasteOff />,
        path: "ListOfObsoleteItems",
        checkPermission: roles?.view_data_obsolete?._id,
      },
      {
        text: t("layout.Authorized approval"),
        icon: <Grading />,
        path: "Obsolete-Material-Approve-Admin",
        checkPermission: roles?.approve_admin_to_request?._id,
      },
      {
        text: t("layout.System Administrators Approval"),
        icon: <Grading />,
        path: "Obsolete-Material-Approve-Super-Admin",
        checkPermission: roles?.approve_Super_admin_root_to_request?._id,
      },
      {
        text: t("layout.Booking requests"),
        icon: <Rule />,
        path: "Approval-reservations",
        checkPermission: roles?.Booking_requests?._id,
      },
      {
        text: t("layout.Order management"),
        icon: <Bookmarks />,
        path: "BookObsoleteMaterial",
        checkPermission: roles?.management_order_entity?._id,
      },
    ],
    [roles, t]
  );

  const Route2 = useMemo(
    () => [
      {
        text: t("layout.Notification"),
        icon: <NotificationAdd />,
        path: "Notification",
        checkPermission: roles?.management_Nonfiction?._id,
      },
      {
        text: t("layout.Manage sent reservation requests"),
        icon: <ChecklistRtl />,
        path: "approve-Admin-To-send-Request-Booking",
        checkPermission: roles?.Booking_requests?._id,
      },
      {
        text: t("layout.material movement"),
        icon: <Archive />,
        path: "archive",
        checkPermission: roles?.show_archive?._id,
      },
      {
        text: t("layout.logEntity"),
        icon: <EventAvailable />,
        path: "Log-stagnant-entity",
        checkPermission: roles?.show_log_entity?._id,
      },
    ],
    [roles, t]
  );

  return (
    <Root
      Route2={Route2}
      Route1={Route1}
      urlApi="getNotification"
      permission={roles?.management_Nonfiction?._id}
      category_id={1}
      title={t("نظام إدارة المواد الراكدة والبطيئة")}
    />
  );
}
