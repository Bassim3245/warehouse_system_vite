import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ShowJobTitle from "../ShowData/showJobTitle";
import { getToken } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";
import { TextField } from "@mui/material";
function JobTitle({ BackendUrl }) {
  const { rtl } = useSelector((state) => state?.language);
  const [jobTitle, setJobTitle] = useState({
    job: "",
  });
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BackendUrl}/api/jopTitleRegister`,
        jobTitle,
        { headers: { "Content-Type": "application/json",authorization:getToken() } }
      );
      if (response && response.data) {
        toast.success(response.data.message);
        setJobTitle({ job: "" });
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
    setJobTitle({ ...jobTitle, job: e.target.value });
  };
  return (
    <div>
      {loading&&<Loader/>}
      <Header title={t("العناوين الوظيفية")} dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
          dir={rtl?.dir}
        >
          <TextField
            label={t("job")}
            fullWidth
            value={jobTitle.job}
            required
            onChange={handleChange}
            onClearClick={() => setJobTitle({ job: "" })}
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
          <ShowJobTitle/>
        </div>
      </form>
    </div>
  );
}

export default JobTitle;
