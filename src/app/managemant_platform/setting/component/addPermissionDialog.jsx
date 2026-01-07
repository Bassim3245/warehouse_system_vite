import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";


/**
 * مكون حوار إضافة صلاحية جديدة
 */
const AddPermissionDialog = ({
  open,
  onClose,
  dialogType,
  selectedCompany,
  onCompanyChange,
  onAdd,
}) => {
  const getDialogTitle = () => {
    switch (dialogType) {
      case "lab":
        return "المعامل";
      case "warehouse":
        return "المخازن الرئيسية";
      case "finishedGoods":
        return "مخازن الإنتاج التام";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">
          إضافة صلاحية جديدة - {getDialogTitle()}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="اختر الشركة"
          select
          value={selectedCompany}
          onChange={onCompanyChange}
          SelectProps={{ native: true }}
          sx={{ mt: 2 }}
        >
          <option value="">اختر شركة...</option>
          <option value="3">شركة الأغذية الصحية</option>
          <option value="4">شركة المستحضرات الطبية</option>
          <option value="5">شركة التصنيع الدوائي</option>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          إلغاء
        </Button>
        <Button onClick={onAdd} variant="contained">
          إضافة
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPermissionDialog;