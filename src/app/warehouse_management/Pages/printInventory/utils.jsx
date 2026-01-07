import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import { useMemo } from "react";
import { StyledTableCell, StyledTableRow } from "../../../../style/generalStyle";

// تبسيط الستايلات
const cellStyles = {
  fontSize: "11px !important",
  fontFamily: "Times New Roman, sans-serif !important",
  padding: "4px",
  borderBottom: "1px solid rgba(224, 224, 224, 0.4)",
  direction: "rtl !important",
  whiteSpace: "normal",
  wordBreak: "break-word",
  fontWeight: "bold",
};

const getTableHeaders = (filterDocument) => [
  { id: 1, label: "رمز المادة", align: "right" },
  { id: 2, label: "اسم المادة", align: "right" },
  { id: 3, label: "وحدة القياس", align: "center" },
  { id: 4, label: "رقم المستند", align: "center" },
  { id: 5, label: "تاريخ المستند", align: "center" },
  { id: 6, label: "نوع المستند", align: "center" },
  {
    id: 7,
    label: filterDocument === "out" ? "الكمية الصادرة" : "الكمية الواردة",
    align: "center",
  },
  { id: 8, label: " الرصيد", align: "center" },
  { id: 9, label: "المواصفة الفنية", align: "right" },
  { id: 10, label: "تاريخ الإنتاج", align: "center" },
  { id: 11, label: "تاريخ انتهاء الصلاحية", align: "center" },
  { id: 12, label: "المنشأ", align: "right" },
  { id: 13, label: "تاريخ الشراء", align: "center" },
  { id: 14, label: "السعر", align: "center" },
  { id: 15, label: "السعر الكلي", align: "center" },
  { id: 16, label: "الحد الأدنى", align: "center" },
  { id: 17, label: "حالة المخزون", align: "center" },
];

const TableHeader = ({ filterDocument }) => {
  const headers = useMemo(
    () => getTableHeaders(filterDocument),
    [filterDocument]
  );

  return (
    <TableHead>
      <StyledTableRow>
        {headers.map((header) => (
          <StyledTableCell
            key={header.id}
            align={header.align}
            sx={{
              ...cellStyles,
              textAlign: `${header.align} !important`,
              fontWeight: "bold",
              backgroundColor: "#f5f5f5",
              "@media print": {
                backgroundColor: "white !important",
              },
            }}
          >
            {header.label}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
};

const InfoRow = ({ label, value }) => (
  <Typography
    component="div"
    sx={{
      fontSize: "12px",
      fontWeight: "bold",
      marginBottom: "4px",
      fontFamily: "Times New Roman, sans-serif !important",
      "& span": {
        color: "#000",
      },
    }}
  >
    {label}: <span>{value || "---"}</span>
  </Typography>
);
export { InfoRow, TableHeader, getTableHeaders, cellStyles };
