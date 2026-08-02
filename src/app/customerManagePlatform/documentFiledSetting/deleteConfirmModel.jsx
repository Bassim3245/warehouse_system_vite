import { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const DeleteConfirmDialog = memo(
  ({ open, onClose, onConfirm, fieldLabel, loading }) => (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>تأكيد الحذف</DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          هل تريد حذف الحقل <strong>«{fieldLabel}»</strong>؟
          <br />
          سيتم حذف جميع القيم المخزنة لهذا الحقل في المستندات القديمة.
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ borderRadius: 2 }}
        >
          حذف
        </Button>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          إلغاء
        </Button>
      </DialogActions>
    </Dialog>
  ),
);
DeleteConfirmDialog.displayName = "DeleteConfirmDialog";

export default DeleteConfirmDialog;
