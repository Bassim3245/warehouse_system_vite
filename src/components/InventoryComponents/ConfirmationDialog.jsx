import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";


const ConfirmationDialog = ({
  open,
  onClose,
  formData,
  loading,
  handleImportSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <InfoIcon color="warning" />
        تأكيد عملية التوريد
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h6" gutterBottom>
            تفاصيل العملية:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                المادة:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" fontWeight="bold">
                {/* {selectedMaterial.name_of_material} */}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                الرقم الرمزي:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" fontWeight="bold">
                {/* {selectedMaterial.cod_material} */}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                الكمية:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" fontWeight="bold">
                {formData.quantity}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                سعر الوحدة:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" fontWeight="bold">
                {formData.price} دينار
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                المورد:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" fontWeight="bold">
                {formData.beneficiary}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                إجمالي التكلفة:
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {(
                  parseFloat(formData.quantity) * parseFloat(formData.price)
                ).toLocaleString()}{" "}
                دينار
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          onClick={handleImportSubmit}
          variant="contained"
          disabled={loading}
          startIcon={<SaveIcon />}
        >
          تأكيد التوريد
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
