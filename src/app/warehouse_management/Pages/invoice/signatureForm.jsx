import React, { useState, useCallback, useMemo } from "react";
import Add from "@mui/icons-material/Add";
import Print from "@mui/icons-material/Print";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import Typography from "@mui/material/Typography";

import { ButtonClose, ButtonTheme } from "../../../../style/ButtomStyle";
import PopupForm from "../../../../components/reusableComponent/PopupForm";
import { axiosInstance } from "../../../../redux/api/axiosConfig";
import { toast } from "react-toastify";

const SignatureForm = ({ documentId, setRefresh, signauterData = [] }) => {
  const [open, setOpen] = useState(false);
  const [signatureTitle, setSignatureTitle] = useState("");
  const [editSignature, setEditSignature] = useState(null);

  // ------------------------------------
  // OPEN/CLOSE MEMOIZED
  // ------------------------------------
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setSignatureTitle("");
    setEditSignature(null);
  }, []);

  // ------------------------------------
  // SAVE SIGNATURE
  // ------------------------------------
  const handleSave = useCallback(async () => {
    if (!signatureTitle.trim()) {
      toast.error("الرجاء إدخال عنوان التوقيع");
      return;
    }

    const url = editSignature ? "/api/warehouse/signatureEdit" : "/api/warehouse/signatureRegister";
    const payload = editSignature
      ? { signature_id: editSignature.id, signature_title: signatureTitle }
      : { document_id: documentId, title: signatureTitle };

    try {
      const res = await axiosInstance.post(url, payload);

      if (res.status === 201 || res.status === 200) {
        toast.success(editSignature ? "تم تعديل التوقيع بنجاح" : "تم إضافة التوقيع بنجاح");
        setRefresh((prev) => !prev);
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(editSignature ? "خطأ في تعديل التوقيع" : "خطأ في إضافة التوقيع");
    }
  }, [signatureTitle, editSignature, documentId, handleClose, setRefresh]);

  // ------------------------------------
  // DELETE SIGNATURE
  // ------------------------------------
  const handleDelete = useCallback(
    async (id, title) => {
      if (!window.confirm(`هل أنت متأكد من حذف التوقيع "${title}"؟`)) return;

      try {
        const res = await axiosInstance.get(`/api/warehouse/deleteSignatureById/${id}`);
        if (res.data) {
          toast.success("تم حذف التوقيع بنجاح");
          setRefresh((prev) => !prev);
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("حدث خطأ أثناء الحذف");
      }
    },
    [setRefresh]
  );

  const onEditSignature = useCallback((item) => {
    setEditSignature(item);
    setSignatureTitle(item.title || "");
    setOpen(true);
  }, []);

  // ------------------------------------
  // TABLE CONTENT (MEMOIZED)
  // ------------------------------------
  const tableRows = useMemo(() => {
    if (!signauterData?.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={3}
            align="center"
            sx={{
              py: 3,
              color: "#7f8c8d",
              fontStyle: "italic",
              border: "1px solid #ddd",
            }}
          >
            لا توجد توقيعات مسجلة
          </TableCell>
        </TableRow>
      );
    }

    return signauterData.map((item, index) => (
      <TableRow
        key={item.id || index}
        sx={{
          "&:hover": { backgroundColor: "#f9f9f9" },
        }}
      >
        <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
          {index + 1}
        </TableCell>

        <TableCell
          align="center"
          sx={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#2c3e50",
            textTransform: "uppercase",
            border: "1px solid #ddd",
          }}
        >
          {item?.title || "---"}
        </TableCell>

        <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Button variant="outlined" color="primary" size="small" onClick={() => onEditSignature(item)}>
              تعديل
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(item.id, item.title)}
            >
              حذف
            </Button>
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [signauterData, onEditSignature, handleDelete]);

  // ------------------------------------
  // POPUP CONTENT (MEMOIZED)
  // ------------------------------------
  const renderFormContent = useMemo(
    () => (
      <>
        <Box sx={{ p: 1 }}>
          <TextField
            label={editSignature ? "تعديل عنوان التوقيع" : "إضافة عنوان التوقيع"}
            value={signatureTitle}
            onChange={(e) => setSignatureTitle(e.target.value)}
            size="small"
            fullWidth
          />
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            إدارة التوقيعات
          </Typography>

          <Table sx={{ mt: 2, border: "1px solid #ddd" }} size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                {["#", "عنوان التوقيع", "إجراءات"].map((head, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{ fontWeight: "bold", border: "1px solid #ddd" }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>{tableRows}</TableBody>
          </Table>
        </Box>
      </>
    ),
    [signatureTitle, editSignature, tableRows]
  );

  // ------------------------------------
  // POPUP FOOTER (MEMOIZED)
  // ------------------------------------
  const renderFormActions = useMemo(
    () => (
      <>
        <ButtonTheme
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={<Print />}
        >
          {editSignature ? "تحديث" : "حفظ"}
        </ButtonTheme>

        <Button onClick={handleClose} variant="outlined">
          إغلاق
        </Button>
      </>
    ),
    [handleSave, handleClose, editSignature]
  );

  return (
    <div>
      <ButtonClose variant="outlined" onClick={handleOpen} disableRipple>
        <Add sx={{ fontSize: "20px" }} />
        <span className="ms-2">إضافة توقيع جديد</span>
      </ButtonClose>

      <PopupForm
        title={editSignature ? "تعديل التوقيع" : "إضافة توقيع جديد"}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="40%"
        content={renderFormContent}
        footer={renderFormActions}
      />
    </div>
  );
};

export default React.memo(SignatureForm);
