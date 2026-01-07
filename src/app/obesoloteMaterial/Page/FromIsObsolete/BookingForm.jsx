import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import BookOnline from "@mui/icons-material/BookOnline";
import CustomTextField from "../../../../components/CustomTextField";
import CustomeSelectField from "../../../../components/CustomeSelectField";
import PopupForm from "../../../../components/PopupForm";
import { getDataMinistries } from "../../../../redux/MinistriesState/MinistresAction";
import { getDataEntities } from "../../../../redux/EntitiesState/EntitiesAction";
import { setLanguage } from "../../../../redux/LanguageState";
import { getToken } from "../../../../utils/handelCookie";
import { BottomRoot } from "../../../../style/ButtomStyle";
import { BackendUrl } from "../../../../redux/api/axios";
export default function BookingForm({
  Quantity,
  editData,
  obsoleteMaterial,
  dataUserById,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const token = getToken();
  const [open, setOpen] = useState(false);
  const [ministriesId, setMinistriesId] = useState(null);
  const [entitiesId, setEntitiesId] = useState(null);
  const [quantity, setQuantity] = useState(Quantity || "");
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Ministries } = useSelector((state) => state?.Ministries);
  const { Entities } = useSelector((state) => state?.Entities);
  // Fetch Ministries and Entities on component mount
  useEffect(() => {
    dispatch(getDataMinistries());
    dispatch(getDataEntities());
    dispatch(setLanguage());
  }, [dispatch]);
  // Filter entities based on selected ministry
  useEffect(() => {
    if (ministriesId) {
      const filteredEntities = Entities?.filter(
        (entity) => entity?.ministries_id === ministriesId?.id
      );
      setFilterData(filteredEntities || []);
    }
  }, [ministriesId, Entities]);
  // Calculate quantity difference for edit
  // Handle form submission for new booking
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!ministriesId || !entitiesId || !quantity) {
      toast.error(t("Please fill all required fields"));
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("user_id", dataUserById?.user_id);
    formData.append("material_id", obsoleteMaterial);
    formData.append("entities_id_buy", entitiesId.entities_id);
    formData.append("entities_id", dataUserById?.entity_id);
    formData.append("Quantity", quantity);
    formData.append("originalQuantity", Quantity);
    try {
      const response = await axios.post(`${BackendUrl}/api/bookRegister`, formData, {
        headers: { authorization: token, "Content-Type": "application/json" },
      });
      if (response) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      toast.error(t("Booking failed. Please try again."));
      console.error("Error booking material:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [ministriesId, entitiesId, quantity, Quantity, dataUserById, obsoleteMaterial, token, t]);
  // Handle form submission for editing booking
  // Render form content
  const renderFormContent = () => (
    <Box component="form" sx={{ margin: "10px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: 2, mt: 2 }} dir="rtl">
        <CustomTextField
          label={t("Stagnant.quantity")}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onClearClick={() => setQuantity("")}
          customWidth="100%"
          required
        />
        <CustomeSelectField
          label={t("Select Ministry")}
          value={ministriesId}
          customWidth="100%"
          list={Ministries || []}
          customGetOptionLabel={(option) => option?.ministries || ""}
          onChange={(e, newValue) => setMinistriesId(newValue)}
          onClearClick={() => setMinistriesId("")}
          required
        />
        <CustomeSelectField
          label={t("Select Entity")}
          value={entitiesId}
          customWidth="100%"
          list={filterData || []}
          customGetOptionLabel={(option) => option?.Entities_name || ""}
          onChange={(e, newValue) => setEntitiesId(newValue)}
          onClearClick={() => setEntitiesId("")}
          required
        />
      </Box>
    </Box>
  );
  // Render form actions
  const renderFormActions = () => (
    <>
      <BottomRoot onClick={() => setOpen(false)}>{t("close")}</BottomRoot>
      <BottomSend type="submit" onClick={handleSubmit} disabled={loading}>
        {loading ? t("loading") : editData ? t("saveChange") : t("save")}
      </BottomSend>
    </>
  );

  return (
    <div>
      <MenuItem onClick={() => setOpen(true)} disableRipple>
        <BookOnline sx={{ fontSize: "20px" }} />
        <span className="ms-2">{t("حجز المادة")}</span>
      </MenuItem>
      <PopupForm
        title={t("PopupInfo.Book Material for Entity")}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        width="50%"
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
}
