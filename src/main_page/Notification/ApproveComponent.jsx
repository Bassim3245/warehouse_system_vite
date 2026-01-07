import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Button  from "@mui/material/Button";
import { BackendUrl } from "../../redux/api/axios";
import { BottomRoot, ButtonTheme } from "../../style/ButtomStyle";
import { getToken } from "../../utils/handelCookie";
import PopupForm from "../../components/reusableComponent/PopupForm";
import InformationMaterial from "./InformtionMaterial";
import RequestDenied from "./RequestDeined";
import Loader from "../../components/reusableComponent/Loader";
export default function ApproveComponent(props) {
  const { t } = useTranslation();
  const token = getToken();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handelApprove = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/${props?.path}`,
        data: { dataId: props?.book_id },
        headers: {
          authorization: token,
        },
      });
      if (response) {
        toast.success(response?.data?.message);
        props?.setRefresh((prev) => !prev);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const renderFormContent = () => (
    <Box>
      <InformationMaterial material_id={props?.material_id} />
    </Box>
  );
  const renderFormActions = () => (
    <>
      {loading && <Loader />}
      <BottomRoot onClick={handleClose}>{t("close")}</BottomRoot>
      <ButtonTheme type="submit" onClick={handelApprove} disabled={loading}>
        {loading ? t("loading") : t("موافقة")}
      </ButtonTheme>
      <RequestDenied setOpen={setOpen} book_id={props?.book_id} edit={false} entity_Buy_id={props?.entity_Buy_id} material_id={props?.material_id} />
    </>
  );
  return (
    <div>
      <Button onClick={handleOpen}>
        {t("!أذا كنت موافق على الطلب أضغط هنا")}
      </Button>
      <PopupForm
        title={t("!أدارة الطلب المرسل")}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
