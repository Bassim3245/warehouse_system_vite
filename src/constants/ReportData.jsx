import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";


export const exportData = [
  {
    label: "تقرير المستخدمين",
    value: "users",
    id: "1",
  },
  {
    label: "عدد الوزارات والجهات التابعة لها",
    value: "ministriesAndEntities",
    id: "2",
  },
  { label: "عدد أجمالي المواد المدخلة", value: "material", id: "3" },
  { label: "عدد الاصناف الرئيسية وتفرعاتها", value: "mainClass", id: "4" },
  {
    label: "عدد المواد خلال شهر معين",
    value: "materialOfDataWithinGivenDate",
    id: "5",
  },
  { label: "عدد الصفقات المكتملة", value: "completedTransactions", id: "6" },
];
export const exportData2 = [
  { label: "عدد أجمالي المواد المدخلة", value: "material", id: "3" },
  {
    label: "عدد المواد خلال شهر معين",
    value: "materialOfDataWithinGivenDate",
    id: "5",
  },
  { label: "عدد الصفقات المكتملة", value: "completedTransactions", id: "6" },
];
export const InformationSelectUser = [
  {
    label: "أسم المستخدم ",
    value: "user_name",
    id: "1",
  },
  {
    label: "رقم الهاتف",
    value: "phone_number",
    id: "2",
  },
  {
    label: "أيميل",
    value: "email",
    id: "3",
  },
  {
    label: "الجهة المستفيدة",
    value: "Entities_name",
    id: "4",
  },
  {
    label: "الوزارة ",
    value: "ministries",
    id: "5",
  },
  {
    label: "تاريخ الانشاء ",
    value: "create_At",
    id: "6",
  },
  {
    label: "العنوان",
    value: "governorate_name",
    id: "7",
  },
  {
    label: "العنوان الوظيفي",
    value: "job_name",
    id: "8",
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
  { value: "pdf", label: "تنزيل على شكل Pdf" },
  { value: "excel", label: "تنزيل على شكل Excel" },
  { value: "displayData", label: "عرض المعلومات" },
];
export const ReportCheckboxGroup = ({
  items,
  activeItems,
  handleChange,
  color,
}) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "divider",
      p: 2,
    }}
  >
    <FormGroup sx={{ p: "20px" }}>
      {items.map((item) => (
        <FormControlLabel
          key={item.id}
          control={
            <Checkbox
              checked={activeItems.includes(item.id)}
              onChange={handleChange(item.id)}
              sx={{
                color: color[800],
                "&.Mui-checked": {
                  color: color[600],
                },
              }}
            />
          }
          label={item.label}
        />
      ))}
    </FormGroup>
  </Box>
);
