import { useState } from "react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ShowGovernorate from "../ShowData/showGovernorate";
import { getToken } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";
import TextField from "@mui/material/TextField";
import useLanguageRtl from "../../../../hooks/genaral/useLanguageRtl";
function Governorate({ BackendUrl }) {
  const { rtl } = useLanguageRtl();
  const [governorateData, setGovernorateData] = useState({
    governorate_name: "",
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/api/governorateRegister`,
        governorateData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken()
          },
        }
      );
      if (response && response.data) {
        toast.success(response.data.message);
        setGovernorateData({ governorate_name: "" });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("unexpected_error"));
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setGovernorateData({ ...governorateData, governorate_name: e.target.value });
  };
  return (
    <div>
      {loading && <Loader />}
      <Header title={t("enter_governorate")} dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
          dir={rtl?.dir}
        >
          <TextField
            label={t("governorate_name")}
            fullWidth
            value={governorateData.governorate_name}
            required
            onChange={handleChange}
          />
        </Box>
        <div
          className="mt-3"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ButtonTheme
            className="me-3"
            type="submit"
            disabled={loading}
          >
            {loading ? t("loading") : t("save")}
          </ButtonTheme>
          <ShowGovernorate />
        </div>
      </form>
    </div>
  );
}

export default Governorate;
