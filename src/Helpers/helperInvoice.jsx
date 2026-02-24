import { formatCurrency, FormatDataNumber, formatDateAr } from "../utils/formatData";

/* ──────────────────────────────────────────────────────────
   Resolve a header field key → actual document value
   Works for both import and export documents
   ────────────────────────────────────────────────────────── */
const resolveHeaderValue = (key, doc, documentNumber) => {
    switch (key) {
        case "document_number": return documentNumber || doc?.document_number;
        case "document_date": return formatDateAr(doc?.document_date);
        case "warehouse_name": return doc?.warehouse_name;
        case "beneficiary": return doc?.beneficiary;
        default: return doc?.[key];
    }
};

/* ──────────────────────────────────────────────────────────
   Resolve a column key → value from material row item
   Covers all possible columns for both in/out documents
   ────────────────────────────────────────────────────────── */
const resolveColumnValue = (key, item, index) => {
    switch (key) {
        case "index": return index + 1;
        case "work_order_number": return item?.work_order_number || "---";
        case "item_code": return item?.cod_material || "---";
        case "item_name": return item?.name_of_material || "---";
        case "specification": return item?.specification || "---";
        case "quantity": return item?.total_quantity ?? item?.quantity ?? 0;
        case "measuring_unit": return item?.measuring_unit || "---";
        case "price": return item?.price ?? "---";
        case "total_price": {
            const qty = FormatDataNumber(item?.total_quantity ?? item?.quantity ?? 0);
            const price = formatCurrency(item?.price ?? 0);
            return price && qty
                ? formatCurrency(price * qty)
                : "---";
        }
        case "purchase_date": return formatDateAr(item?.purchase_date);
        case "supplier": return item?.beneficiary || "---";
        default: return item?.[key] ?? "---";
    }
};
export { resolveHeaderValue, resolveColumnValue };