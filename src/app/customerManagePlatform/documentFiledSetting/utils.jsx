const DOCUMENT_TYPES = [
  { value: "in", label: "وارد" },
  { value: "out", label: "صادر" },
  { value: "internal_transfer", label: "تحويل داخلي" },
  { value: "production_entry", label: "إنتاج" },
  { value: "internal_consumption", label: "استهلاك داخلي" },
];

const FIELD_TYPES = [
  { value: "text", label: "نص" },
  { value: "number", label: "رقم" },
  { value: "date", label: "تاريخ" },
  { value: "select", label: "قائمة اختيار" },
  { value: "textarea", label: "نص متعدد الأسطر" },
];

const EMPTY_FORM = {
  document_type: "in",
  field_key: "",
  field_label: "",
  field_type: "text",
  is_required: false,
  display_order: 0,
  is_active: true,
};


export { DOCUMENT_TYPES, FIELD_TYPES, EMPTY_FORM };
    