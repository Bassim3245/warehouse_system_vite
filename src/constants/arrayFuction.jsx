import { Building, Factory, FlaskConical, Package } from "lucide-react";

export const arrayDataInventory = [
  " الرقم الرمزي",
  "أسم المادة",
  "المنشأ",
  "وحدة القياس",
  "المواصفات الفنية",
  "حالة المادة",
  "الرصيد الافتتاحي",
  "السعر المفرد",
  "الحد الادنا للمخزون",

];

export const typeDocument = [
  {
    value: "in",
    label: "مستند وارد",
  },
  {
    value: "internal_consumption",
    label: "مستند مصرف داخلي",
  },
  {
    value: "out",
    label: "مستند صادر",
  },

  // {
  //   value: "internal_transfer",
  //   label: "مستند نقل داخلي",
  // },
];

// select type report
export const hierarchyTypes = [
  {
    value: "full",
    label: "بنية كاملة (شركة + مصانع + معامل + مخازن)",
    icon: <Building className="w-5 h-5" />,
    color: "primary",
  },
  {
    value: "simple",
    label: "بنية بسيطة (شركة + مخازن فقط)",
    icon: <Package className="w-5 h-5" />,
    color: "secondary",
  },
  {
    value: "factory_only",
    label: "مصنع فقط (مصنع + مخازن)",
    icon: <Factory className="w-5 h-5" />,
    color: "warning",
  },
  {
    value: "lab_only",
    label: "معمل فقط (معمل + مخازن)",
    icon: <FlaskConical className="w-5 h-5" />,
    color: "info",
  },
];
