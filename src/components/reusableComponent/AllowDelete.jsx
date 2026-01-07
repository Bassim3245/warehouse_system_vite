import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { HelpOutlineOutlined } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { BackendUrl } from "../../redux/api/axios";
import { ButtonClearState, ButtonSave } from "../../style/ButtomStyle";
import { getToken } from "../../utils/handelCookie";

// ثابت لا يتغير — يتم حسابه مرة واحدة
const modalStyle = Object.freeze({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
});

export default function AllowDelete({
  path_delete = "",
  delete_id = "",
  setOpen: setParentOpen,
  setRefresh,
  setRefresh3,
}) {
  const [open, setOpen] = useState(false);
  const token = getToken();
  const { t } = useTranslation();

  /** فتح/غلق المودال */
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  /** تنفيذ الحذف */
  const handleDelete = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BackendUrl}/api/${path_delete}/${delete_id}`,
        { headers: { authorization: token } }
      );

      toast.success(response?.data?.message);

      setOpen(false);
      setParentOpen?.(false);
      setRefresh?.((prev) => !prev);
      setRefresh3?.((prev) => !prev);
    } catch (error) {
      toast.error(error?.response?.data?.message || "خطأ أثناء الحذف");
    }
  }, [path_delete, delete_id, token, setParentOpen, setRefresh, setRefresh3]);

  /** جزء المودال (Memoized) */
  const modalContent = useMemo(
    () => (
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        BackdropProps={{
          style: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(3px)",
          },
        }}
      >
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <IconButton disableRipple>
              <HelpOutlineOutlined
                sx={{ fontSize: "100px", mb: 2, color: "#444" }}
              />
            </IconButton>

            <h3>هل أنت موافق على الحذف؟</h3>
          </Box>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <ButtonClearState onClick={handleDelete}>
              {t("delete")}
            </ButtonClearState>

            <ButtonSave onClick={handleClose}>{t("close")}</ButtonSave>
          </div>
        </Box>
      </Modal>
    ),
    [open, handleClose, handleDelete, t]
  );

  // ====================
  // RENDER
  // ====================
  return (
    <div>
      <ButtonClearState onClick={handleOpen}>حذف</ButtonClearState>

      {modalContent}
    </div>
  );
}
