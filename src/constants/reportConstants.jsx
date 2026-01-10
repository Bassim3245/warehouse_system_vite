import Inventory from "@mui/icons-material/Inventory";
import DateRange from "@mui/icons-material/DateRange";
import Assessment from "@mui/icons-material/Assessment";
import Search from "@mui/icons-material/Search";
import TrendingUp from "@mui/icons-material/TrendingUp";
import FileUpload from "@mui/icons-material/FileUpload";
import FileDownload from "@mui/icons-material/FileDownload";

import { formatCurrency } from "../utils/formatData";
// بيانات التقارير الجديدة
export const warehouseReports = [
  {
    id: "import_inventory",
    title: "تقرير حول المواد الواردة ",
  },
  {
    id: "internal_consumption",
    title: "تقرير حول الصرف  الداخلي",
  },

  {
    id: "export_inventory",
    title: "تقرير حول المواد الصادرة ",
  },

  {
    id: "materials_balance",
    title: "تقرير حول ارصدة المواد",
  },
  {
    id: "materials_zero_value",
    title: "المواد ذات القيمة المصفرة",
  },
  {
    id: "users_operations",
    title: "تقرير المستخدمين والعمليات",
  },
  // {
  //   id: "critical_quantities",
  //   title: "تقرير الكميات الحرجة",
  //   description: "يظهر المواد التي وصلت إلى الحد الأدنى أو نفدت",
  //   icon: <Warning />,
  //   color: "error",
  //   category: "alerts",
  // },
  {
    id: "Warehouse_Information",
    title: "تقرير حول عدد  المخازن",
  },
  {
    id: "laboratories_Information",
    title: "تقرير حول عدد المعامل",
  },
  {
    id: "factories_Information",
    title: "تقرير حول عدد المصانع ",
  },
];


// فئات التقارير
export const reportCategories = [
  { id: "all", label: "جميع التقارير", color: "default" },
  { id: "inventory", label: "تقارير الجرد", color: "primary" },
  { id: "operations", label: "تقارير العمليات", color: "info" },
  { id: "analysis", label: "تقارير التحليل", color: "secondary" },
  { id: "alerts", label: "تقارير التنبيهات", color: "error" },
  { id: "security", label: "تقارير الأمان", color: "warning" },
];

// الحالة الأولية للمعلومات المحددة
export const initialSelectedInfo = {
  reportNumber: "",
  reportTitle: "",
  reportDescription: "",
  reportFormat: "display",
  reportCategory: "inventory",
  warehouses: [],
  labs: [],
  factories: [],
  reportTypes: [],
  materials: [],
  dateFrom: null,
  dateTo: null,
  notes: "",
  entityName: "", // اسم الجهة لتقرير المصروفات
};

// الحالة الأولية للأقسام الموسعة
export const initialExpandedSections = {
  warehouses: true,
  labs: true,
  factories: true,
  materials: true,
  reportTypes: true,
};
export const InformationMaterialImport = [
  {
    label: "أسم المادة ",
    value: "material_name",
    id: 1,
  },
  {
    label: "الرقم الرمزي للمادة",
    value: "code_material",
    id: 2,
  },
  {
    label: "المخزن",
    value: "store",
    id: 3,
  },
  {
    label: "الرصيد",
    value: "balance",
    id: 4,
  },
  {
    label: "حالة المادة",
    value: "state_name",
    id: 5,
  },
  {
    label: "وحدة قياس المادة",
    value: "measuring_unit",
    id: 6,
  },
  {
    label: "المواصفات الفنية للمادة",
    value: "specifications",
    id: 7,
  },
  {
    label: "تاريخ الانتاج",
    value: "production_date",
    id: 8,
  },
  {
    label: "تاريخ الادخال",
    value: "entry_date",
    id: 9,
  },
  {
    label: "تاريخ الصلاحية",
    value: "expiration_date",
    id: 10,
  },
  {
    label: "رقم المستند",
    value: "document_number",
    id: 11,
  },
  {
    label: "الجهة الموردة او المستفيدة ",
    value: "supplier",
    id: 12,
  },

  {
    label: "تاريخ المستند",
    value: "document_date",
    id: 13,
  },
  {
    label: "الكمية الواردة او الصادرة",
    value: "quantity_received",
    id: 14,
  },
  {
    label: "تاريخ الشراء",
    value: "purchase_date",
    id: 15,
  },
  {
    label: "أسم المخزن",
    value: "warehouse_name",
    id: 16,
  },
  {
    label: "الرقم الرمزي للمخزن ",
    value: "warehouse_code",
    id: 17,
  },
  {
    label: "قيمة شراء الوحدة الواحدة",
    value: "price_per_unit",
    id: 18,
  },
  {
    label: "تاريخ التصدير",
    value: "export_date",
    id: 19,
  },
];
export const InformationMaterialExport = [
  {
    label: "أسم المادة ",
    value: "material_name",
    id: 1,
  },
  {
    label: "الرقم الرمزي للمادة",
    value: "code_material",
    id: 2,
  },
  {
    label: "المخزن",
    value: "store",
    id: 3,
  },
  {
    label: "حالة المادة",
    value: "state_name",
    id: 4,
  },
  {
    label: "وحدة قياس المادة",
    value: "measuring_unit",
    id: 5,
  },
  {
    label: "المواصفات الفنية للمادة",
    value: "specifications",
    id: 6,
  },
  {
    label: "تاريخ الانتاج",
    value: "production_date",
    id: 7,
  },
  {
    label: "تاريخ الادخال",
    value: "entry_date",
    id: 8,
  },
  {
    label: "تاريخ الصلاحية",
    value: "expiration_date",
    id: 9,
  },
  {
    label: "رقم المستند",
    value: "document_number",
    id: 10,
  },
  {
    label: "الجهة المصدرة   ",
    value: "supplier",
    id: 11,
  },

  {
    label: "تاريخ المستند",
    value: "document_date",
    id: 12,
  },
  {
    label: "الكمية الصادرة",
    value: "quantity_received",
    id: 13,
  },

  {
    label: "أسم المخزن",
    value: "warehouse_name",
    id: 14,
  },

  {
    label: "قيمة شراء الوحدة الواحدة",
    value: "price_per_unit",
    id: 15,
  },

  {
    label: "تاريخ التصدير",
    value: "export_date",
    id: 16,
  },
];
export const InformationSelectMaterial = [
  {
    label: "اسم المادة",
    value: "name_material",
    id: "1",
  },
  {
    label: "حالة المادة",
    value: "state_name",
    id: "2",
  },
  {
    label: "كمية المادة",
    value: "Quantity",
    id: "3",
  },
  {
    label: "تاريخ الادخال",
    value: "created_at",
    id: "4",
  },
];
export const options = [
  // { value: "pdf", label: "تنزيل على شكل Pdf" },
  { value: "excel", label: "تنزيل على شكل Excel" },
  // { value: "displayData", label: "عرض المعلومات" },
];
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const softColors = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  light: "#f8fafc",
  dark: "#1e293b",
  neutral: "#64748b",
};
export const statisticDataBox = (statisticData) => [
  {
    icon: DateRange,
    value: statisticData?.totalCountMonthlyLocks || 0,
    label: "الأشهر المكتملة",
    subtitle: "من أصل 12 شهر",
    color: softColors.primary,
  },
  {
    icon: Inventory,
    value: statisticData?.totalCount || 0,
    label: "إجمالي المواد",
    subtitle: "شهرياً",
    color: softColors.secondary,
  },
  {
    icon: TrendingUp,
    value: formatCurrency(statisticData?.totalAmount || 0), // استخدم الخاصية الصحيحة هنا
    label: "القيمة الإجمالية",
    subtitle: "للمخزون السنوي",
    color: softColors.info,
  },
  {
    icon: FileUpload,
    value: statisticData?.totalCountDocumentExport || 0,
    label: "المستندات الصادرة",
    subtitle: "الشهرية",
    color: softColors.accent,
  },
  {
    icon: FileDownload,
    value: statisticData?.totalCountDocumentImport || 0,
    label: "المستندات الواردة",
    subtitle: "الشهرية",
    color: softColors.success,
  },
  {
    icon: FileUpload,
    value: statisticData?.totalCountDocumentExportInternal || 0,
    label: "المستندات الصرف الداخلي",
    subtitle: "الشهرية",
    color: softColors.success,
  },
];

export const reportTypeOptions = [
  {
    value: "general",
    label: "تقرير عام",
    description: "تقرير شامل لجميع البيانات",
    icon: <Assessment />,
    color: "#00C49F",
  },
  {
    value: "material_search",
    label: "البحث عن مادة بستخدام رمز المادة",
    description: "البحث عن مادة محددة باستخدام رمز المادة",
    icon: <Search />,
    color: "#00C49F",
  },

  // {
  //   value: "financial_reports",
  //   label: "التقارير المالية",
  //   description: "عرض التقارير المالية بالتفصيل",
  //   icon: <BarChart />,
  //   color: "#00C49F",
  // },
];
// handle check ware house
