import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventAvailableTwoToneIcon from "@mui/icons-material/EventAvailableTwoTone";
import GridViewIcon from "@mui/icons-material/GridView";
import HomeIcon from "@mui/icons-material/Home";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import WarehouseIconMUI from "@mui/icons-material/Warehouse";
import LockClockIcon from "@mui/icons-material/LockClock";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";

import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import Root from "../../../components/Layout/Root";
import logo from "../../../assets/image/1671635909.png";

import { Factory, WarehouseIcon } from "lucide-react";
import { usePermissionsStructure } from "../../../hooks/useStructureCompany";

export default function RootWarehouse() {
  const { roles } = useSelector((state) => state?.RolesData);
  const { t } = useTranslation();
  const { has_lab, has_factory, has_warehouse } = usePermissionsStructure();
  /** -------------------------------------
   *  Route1
   --------------------------------------*/
  const Route1 = useMemo(
    () => [
      {
        text: t(" الصفحة الرئيسية"),
        icon: <HomeIcon sx={{ transition: "transform 0.2s" }} />,
        path: "warehouse-home",
        checkPermission: roles?.show_main_page?._id,
      },
      {
        text: t("التقارير"),
        icon: <LeaderboardIcon sx={{ transition: "transform 0.2s" }} />,
        path: "main-page-report",
        checkPermission: roles?.show_page_report_warehouse?._id,
      },
      {
        text: t("المخازن"),
        icon: <WarehouseIconMUI sx={{ transition: "transform 0.2s" }} />,
        path: "management-data-store",
        checkPermission: roles?.warehouse_page?._id,
      },
      {
        text: t("إغلاق الأشهر"),
        icon: <LockClockIcon sx={{ transition: "transform 0.2s" }} />,
        path: "monthly-locks",
        checkPermission: roles?.show_page_monthly_lock?._id,
      },
      {
        text: t("الارشفة الشهرية"),
        icon: <CalendarTodayIcon sx={{ transition: "transform 0.2s" }} />,
        path: "monthly-inventory",
        checkPermission: roles?.show_page_monthly_inventory?._id,
      },
      {
        text: t("ارشفة المواد"),
        icon: <CalendarTodayIcon sx={{ transition: "transform 0.2s" }} />,
        path: "inventory-archive-monthly",
        checkPermission: roles?.show_page_monthly_inventory?._id,
      },
    ],
    [roles, t]
  );

  /** -------------------------------------
   *  Route2
   --------------------------------------*/
  const Route2 = useMemo(() => {
    const routes = [];

    if (roles?.show_page_purchase?._id) {
      routes.push({
        text: t("الوارد"),
        icon: <GridViewIcon sx={{ transition: "transform 0.2s" }} />,
        path: "document-purchase",
        checkPermission: roles?.show_page_purchase?._id,
      });
    }

    if (roles?.show_page_sales?._id) {
      routes.push({
        text: t("أدارة الصرف"),
        icon: <GridViewIcon sx={{ transition: "transform 0.2s" }} />,
        path: "document-sales",
        checkPermission: roles?.show_page_sales?._id,
      });
    }

    return routes;
  }, [roles, t]);

  /** -------------------------------------
   *  Route3
   --------------------------------------*/
  const Route3 = useMemo(() => {
    const routes = [];

    if (has_factory && roles?.management_factory?._id) {
      routes.push({
        text: t("أدارة المصانع"),
        icon: <Factory sx={{ transition: "transform 0.2s" }} />,
        path: "Factory-manage",
        checkPermission: roles?.management_factory?._id,
      });
    }

    if (has_lab && roles?.management_lab?._id) {
      routes.push({
        text: t("أدارة المعامل"),
        icon: <WarehouseIcon />,
        path: "lab-manage",
        checkPermission: roles?.management_lab?._id,
      });
    }

    if (has_warehouse && roles?.management_store?._id) {
      routes.push({
        text: t("أدارة المخازن"),
        icon: <WarehouseIconMUI sx={{ transition: "transform 0.2s" }} />,
        path: "warehouse-mange",
        checkPermission: roles?.management_store?._id,
      });
    }

    return routes;
  }, [has_factory, has_lab, has_warehouse, roles, t]);

  /** -------------------------------------
   *  Route4
   --------------------------------------*/
  const Route4 = useMemo(
    () => [
      {
        text: t("ارشفة المواد المستندات"),
        icon: <CalendarTodayIcon sx={{ transition: "transform 0.2s" }} />,
        path: "annual-inventory",
        checkPermission: roles?.show_page_monthly_inventory?._id,
      },
      {
        text: t("ارشفة المواد"),
        icon: <AssessmentIcon sx={{ transition: "transform 0.2s" }} />,
        path: "inventory-archive-annual",
        checkPermission: roles?.show_page_annual_inventory?._id,
      },
      // {
      //   text: t("طلبات التعديل"),
      //   icon: <EditIcon sx={{ transition: "transform 0.2s" }} />,
      //   path: "unlock-requests",
      //   checkPermission: roles?.show_main_page?._id,
      // },
      {
        text: t("سجل التدقيق"),
        icon: <HistoryIcon sx={{ transition: "transform 0.2s" }} />,
        path: "audit-log",
        checkPermission: roles?.show_pag_auditLog?._id,
      },
      {
        text: t("layout.companyInformation"),
        icon: <AccountBoxIcon sx={{ transition: "transform 0.2s" }} />,
        path: "profile",
        checkPermission: roles?.show_profile?._id,
      },
      {
        text: t("layout.log"),
        icon: <EventAvailableTwoToneIcon sx={{ transition: "transform 0.2s" }} />,
        path: "AllLog",
        checkPermission: roles?.show_log?._id,
      },
      {
        text: t("layout.Notification"),
        icon: <NotificationAddIcon sx={{ transition: "transform 0.2s" }} />,
        path: "warehouse-Notification",
        checkPermission: roles?.management_Nonfiction?._id,
      },
      {
        text: t("layout.logEntity"),
        icon: <EventAvailableIcon sx={{ transition: "transform 0.2s" }} />,
        path: "log-warehouse-entity",
        checkPermission: roles?.show_log_entity?._id,
      },
    ],
    [roles, t]
  );

  return (
    <Root
      Route1={Route1}
      Route2={Route2}
      Route3={Route3}
      Route4={Route4}
      logo={logo}
      urlApi="getNotification"
      permission={roles?.management_Nonfiction?._id}
      category_id={2}
      title={t("نظام أدارة الخزين في المخازن")}
    />
  );
}
