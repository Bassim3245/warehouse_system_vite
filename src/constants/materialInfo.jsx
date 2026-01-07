import { FormatDataNumber, formatDateAr } from "../utils/formatData";

export const tableHeaderImport = [
  "رقم المستند",
  "الكمية",
  "السعر",
  "تاريخ الشراء",
  "تاريخ الانتهاء",
  "الكمية المتبقية",
  "المستفيد",
];
export const tableHeaderInvoiceImport = [
  "ت",
  "رمز المادة",
  "اسم المادة",
  "الكمية",
  "السعر",
  "السعر الكلي",
  "تاريخ الشراء",
  "الجهة الموردة",
];

export const tableHeaderExport = [
  "رقم المستند",
  "الكمية",
  "السعر",
  "تاريخ التصدير",
  "المستفيد",
];
export const tableBodyImport = (dataItem) =>
  dataItem?.imports?.map((importItem) => ({
    document_number: importItem?.document_number,
    quantity: FormatDataNumber(importItem?.quantity),
    price: importItem?.price,
    purchase_date: formatDateAr(importItem?.import_date),
    expiration_date: formatDateAr(importItem?.expiry_date),
    remaining_quantity: FormatDataNumber(importItem?.remaining_quantity),
    beneficiary: importItem?.beneficiary,
    measuring_unit: importItem?.measuring_unit,
    style: {
      textAlign: "center",
      border: "1px solid #000",
    },
  }));
export const tableBodyInvoiceImport = (dataItem) =>
  dataItem?.map((importItem, index) => ({
    index: index + 1,
    item_code: importItem?.cod_material,
    item_name: importItem?.name_of_material,
    quantity: FormatDataNumber(importItem?.quantity),
    price: importItem?.price,
    purchase_date: formatDateAr(importItem?.purchase_date),
    expiration_date: formatDateAr(importItem?.expiry_date),
    remaining_quantity: FormatDataNumber(importItem?.remaining_quantity),
    beneficiary: importItem?.beneficiary,
    measuring_unit: importItem?.measuring_unit,
    style: {
      textAlign: "center",
      border: "1px solid #000",
    },
  }));
export const tableBodyExport = (dataItem) =>
  dataItem?.exports?.map((exportItem) => ({
    document_number: exportItem?.document_number,
    quantity: FormatDataNumber(
      exportItem?.export_details.reduce(
        (sum, item) => sum + parseFloat(item?.quantity),
        0
      )
    ),
    price: exportItem?.price,
    export_date: formatDateAr(exportItem?.export_date),
    beneficiary: exportItem?.beneficiary,
    measuring_unit: exportItem?.measuring_unit,
    style: {
      textAlign: "center",
      border: "1px solid #000",
    },
  }));
export const totalImportQuantity = (dataItem) =>
  dataItem?.imports?.reduce((sum, item) => sum + parseFloat(item?.quantity), 0);
export const totalImportValue = (dataItem) =>
  dataItem?.imports?.reduce((sum, item) => sum + parseFloat(item?.price), 0);
