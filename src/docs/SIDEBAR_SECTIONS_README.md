# دليل استخدام الأقسام الفرعية في SideBar

## نظرة عامة
تم تحديث مكون SideBar ليدعم تنظيم العناصر في أقسام فرعية منظمة، مما يحسن من تجربة المستخدم وسهولة التنقل.

## البنية الجديدة لـ Route2

### الطريقة القديمة (Array بسيط)
```javascript
const Route2 = [
  {
    text: t("الجرد السنوي"),
    icon: <Assessment />,
    path: "inventory-navigation",
    checkPermission: roles?.show_page_annual_inventory?._id,
  },
  {
    text: t("التعريفات الاساسية"),
    icon: <Settings />,
    path: "general-Setting",
    checkPermission: roles?.store_general_setting?._id,
  },
];
```

### الطريقة الجديدة (أقسام فرعية)
```javascript
const Route2 = [
  // قسم الأرشفة
  {
    title: t("قسم الأرشفة"),
    items: [
      {
        text: t("الجرد السنوي"),
        icon: <Assessment />,
        path: "inventory-navigation",
        checkPermission: roles?.show_page_annual_inventory?._id,
      },
      {
        text: t("أرشفة المواد"),
        icon: <NotificationAdd />,
        path: "warehouse-Notification",
        checkPermission: roles?.management_Nonfiction?._id,
      },
    ],
  },
  // قسم المخزن
  {
    title: t("قسم المخزن"),
    items: [
      {
        text: t("التعريفات الاساسية"),
        icon: <Settings />,
        path: "general-Setting",
        checkPermission: roles?.store_general_setting?._id,
      },
    ],
  },
];
```

## المزايا الجديدة

### 1. تنظيم أفضل
- تجميع العناصر المترابطة في أقسام منطقية
- عناوين واضحة لكل قسم
- تحسين التنقل والعثور على الوظائف

### 2. مرونة في الاستخدام
- يمكن خلط الأقسام الفرعية مع العناصر المفردة
- دعم للطريقة القديمة والجديدة في نفس الوقت
- سهولة الإضافة والتعديل

### 3. تصميم محسن
- عناوين أقسام بتصميم مميز
- تباعد مناسب بين الأقسام
- تجربة مستخدم محسنة

## كيفية الاستخدام

### إضافة قسم جديد
```javascript
const Route2 = [
  // الأقسام الموجودة...
  
  // قسم جديد
  {
    title: t("اسم القسم الجديد"),
    items: [
      {
        text: t("عنصر 1"),
        icon: <YourIcon />,
        path: "path-1",
        checkPermission: roles?.permission_1?._id,
      },
      {
        text: t("عنصر 2"),
        icon: <YourIcon2 />,
        path: "path-2",
        checkPermission: roles?.permission_2?._id,
      },
    ],
  },
];
```

### إضافة عنصر مفرد (بدون قسم)
```javascript
const Route2 = [
  // الأقسام الفرعية...
  
  // عنصر مفرد
  {
    text: t("عنصر مستقل"),
    icon: <IndependentIcon />,
    path: "independent-path",
    checkPermission: roles?.independent_permission?._id,
  },
];
```

## ملاحظات مهمة

1. **التوافق العكسي**: الكود الحالي سيعمل بدون تغيير
2. **الصلاحيات**: تطبق صلاحيات العرض على كل عنصر فردي
3. **الترجمة**: استخدم دالة `t()` لترجمة عناوين الأقسام والعناصر
4. **الأيقونات**: يمكن استخدام أي أيقونة من Material-UI

## مثال كامل
```javascript
const Route2 = [
  {
    title: t("قسم الأرشفة"),
    items: [
      {
        text: t("الجرد السنوي"),
        icon: <Assessment />,
        path: "inventory-navigation",
        checkPermission: roles?.show_page_annual_inventory?._id,
      },
      {
        text: t("أرشفة المواد"),
        icon: <NotificationAdd />,
        path: "warehouse-Notification",
        checkPermission: roles?.management_Nonfiction?._id,
      },
    ],
  },
  {
    title: t("قسم المخزن"),
    items: [
      {
        text: t("التعريفات الاساسية"),
        icon: <Settings />,
        path: "general-Setting",
        checkPermission: roles?.store_general_setting?._id,
      },
    ],
  },
  // عنصر مستقل
  {
    text: t("صفحة خاصة"),
    icon: <SpecialIcon />,
    path: "special-page",
    checkPermission: roles?.special_permission?._id,
  },
];
```

هذا التحديث يوفر مرونة أكبر في تنظيم القوائم الجانبية ويحسن من تجربة المستخدم العامة.