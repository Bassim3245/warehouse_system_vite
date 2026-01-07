// Report handlers and business logic functions

import { toast } from "react-toastify";
import { BackendUrl } from "../../redux/api/axios";
import { axiosInstance } from "../../redux/api/axiosConfig";
import { getToken } from "../handelCookie";

// معالج اختيار التقرير
export const handleReportSelect = (
  report,
  setSelectedReport,
  setShowReportModel
) => {
  setSelectedReport(report);
  setShowReportModel(true);
};

// معالج إغلاق نموذج التقرير
export const handleCloseReportModel = (
  setShowReportModel,
  setSelectedReport
) => {
  setShowReportModel(false);
  setSelectedReport(null);
};

// معالج فتح حوار اختيار المعلومات
export const handleOpenInfoDialog = (setShowInfoDialog) => {
  setShowInfoDialog(true);
};

// معالج إغلاق حوار اختيار المعلومات
export const handleCloseInfoDialog = (setShowInfoDialog) => {
  setShowInfoDialog(false);
};

// معالج تغيير الـ checkbox للمعلومات
// معالج تغيير الـ checkbox للمعلومات
export const handleInfoCheckboxChange = (
  category,
  itemId,
  setSelectedInfo,
  itemName = null
) => {
  if (
    [
      "dateFrom",
      "dateTo",
      "reportTitle",
      "reportDescription",
      "reportFormat",
      "typeDocument",
      "notes",
      "material_code",
      "selectReportType",
      "quantities_all_warehouses"

    ].includes(category)
  ) {
    setSelectedInfo((prev) => ({
      ...prev,
      [category]: itemId,
    }));
  } else if (category === "selectedReportTypesLable") {
    // Set selectedReportTypesLable as itemName (the label) instead of itemId for this special case
    setSelectedInfo((prev) => ({
      ...prev,
      selectedReportTypesLable: itemName,
    }));
  } else if (category === "warehouses" && itemName !== null) {
    // Special handling for warehouses to include both id and name
    setSelectedInfo((prev) => {
      const warehouseItem = { id: itemId, name: itemName };
      // Check if the item already exists in the array
      const existingIndex = prev[category].findIndex((item) =>
        typeof item === "object" ? item.id === itemId : item === itemId
      );
      if (existingIndex >= 0) {
        // Remove if already exists
        return {
          ...prev,
          [category]: prev[category].filter(
            (_, index) => index !== existingIndex
          ),
        };
      } else {
        // Add if doesn't exist
        return {
          ...prev,
          [category]: [...prev[category], warehouseItem],
        };
      }
    });
  } else {
    // التعامل مع المصفوفات (checkboxes) for other categories
    setSelectedInfo((prev) => ({
      ...prev,
      [category]: prev[category].includes(itemId)
        ? prev[category].filter((id) => id !== itemId)
        : [...prev[category], itemId],
    }));
  }
};
// معالج توسيع/طي الأقسام
export const handleToggleSection = (section, setExpandedSections) => {
  setExpandedSections((prev) => ({
    ...prev,
    [section]: !prev[section],
  }));
};
// دالة إنشاء التقرير للعرض على الشاشة
export const generateDisplayReport = async (reportData) => {
  try {
    // يمكن استخدام API call هنا لإنشاء التقرير
    const response = await axiosInstance.get(
      `${BackendUrl}/api/warehouse/getReportToSingleItem?searchKey=${reportData.material_code}`,
      {
        headers: { authorization: getToken() },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("خطأ في إنشاء التقرير للعرض:", error);
    throw error;
  }
};

// دالة تصدير التقرير كملف
export const exportReportFile = async (reportData) => {
  try {
    const response = await axiosInstance.post(
      `${BackendUrl}/api/warehouse/register-report-history`,
      reportData,
      {
        responseType: "blob", // مهم للملفات الثنائية
        headers: { authorization: getToken() },
      }
    );

    if (response && response.data) {
      // إنشاء Blob من البيانات المستلمة
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // توليد اسم الملف - إصلاح المشكلة هنا
      const fileName = `${reportData.reportNumber}_${reportData.reportTitle || "report"
        }.xlsx`;

      // إنشاء رابط وتحميل الملف
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // تنظيف الذاكرة
      link.remove();
      window.URL.revokeObjectURL(link.href);

      return { success: true, fileName };
    } else {
      throw new Error("لم يتم استلام بيانات من الخادم");
    }
  } catch (error) {
    console.error("خطأ في تصدير التقرير:", error);

    // معالجة أفضل للأخطاء
    let errorMessage = "فشل إنشاء التقرير";
    if (error.response) {
      errorMessage = `خطأ من الخادم: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = "لا يمكن الوصول للخادم";
    }

    toast.error(errorMessage);
    throw error;
  }
};

// معالج تطبيق الاختيارات
export const handleApplySelections = async (
  selectedInfo,
  setShowInfoDialog,
  dataUserById
) => {
  try {
    // console.log("selectedInfo", selectedInfo);

    // التحقق من صحة البيانات المدخلة
    const targets = [
      "Warehouse_Information",
      "laboratories_Information",
      "factories_Information",
    ];

    // Check if NONE of the selected report types are in the target array
    const requiresDate = !selectedInfo.reportTypes?.some((type) =>
      targets.includes(type)
    );
    if (selectedInfo.selectReportType === "material_search") {
      if (!selectedInfo.material_code) {
        toast.error("يرجى تحديد المادة");
        return;
      }
    }
    if (selectedInfo.selectReportType === "general") {
      if (requiresDate && (!selectedInfo.dateFrom || !selectedInfo.dateTo)) {
        toast.error("يرجى تحديد فترة التقرير");
        return;
      }
    }


    // إعداد بيانات التقرير
    const reportData = {
      selectReportType: selectedInfo.selectReportType,
      // معلومات التقرير الأساسية
      reportTitle: selectedInfo.reportTitle,
      reportDescription: selectedInfo.reportDescription,
      reportFormat: selectedInfo.reportFormat,
      // المصادر المحددة
      selectedWarehouses: selectedInfo.warehouses,
      selectedLabs: selectedInfo.labs,
      selectedFactories: selectedInfo.factories,
      selectedReportTypes: selectedInfo.reportTypes,
      selectedReportTypesLable: selectedInfo.reportTypes,

      selectedMaterials: selectedInfo.materials,
      // معلومات التاريخ
      dateFrom: selectedInfo.dateFrom,
      dateTo: selectedInfo.dateTo,
      // معلومات المستخدم
      createdBy: dataUserById?.user_id,
      entity_id: dataUserById?.entity_id,
      // ملاحظات إضافية
      notes: selectedInfo.notes,
      // معاملات إضافية
      typeDocument: selectedInfo.typeDocument,
      material_code: selectedInfo.material_code,
      reportParameters: {
        entityId: dataUserById?.entity_id,
        generatedAt: new Date().toISOString(),
      },
      reportStatus: "generated",
    };

    console.log("بيانات التقرير المعدة:", reportData);

    // إغلاق حوار الاختيار
    setShowInfoDialog(false);

    // معالجة التقرير حسب الصيغة المختارة
    if (selectedInfo.selectReportType === "material_search") {
      const data = await generateDisplayReport(reportData);
      return data;
    } else {
      if (selectedInfo.reportFormat === "display") {
        await generateDisplayReport(reportData);
      } else {
        await exportReportFile(reportData);
      }
    }
  } catch (error) {
    console.error("خطأ في إنشاء التقرير:", error);
    alert("حدث خطأ أثناء إنشاء التقرير. يرجى المحاولة مرة أخرى.");
  }
};

// دالة تصفية التقارير حسب الفئة المختارة
export const getFilteredReports = (warehouseReports, selectedCategory) => {
  return selectedCategory === "all"
    ? warehouseReports
    : warehouseReports.filter((report) => report.category === selectedCategory);
};
export const handleCheckboxChangeMaterial = (id, setIsActiveMaterial) => () => {
  setIsActiveMaterial((prevState) =>
    prevState.includes(id)
      ? prevState.filter((itemId) => itemId !== id)
      : [...prevState, id]
  );
  // Update informationMaterial state when checkbox changes
};
