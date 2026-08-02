import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import Box from "@mui/material/Box";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import axios from "axios";
import { BackendUrl } from "../../../../redux/api/axios";
import ShowDataBanner from "../ShowData/ShowBanner";
import { getToken } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";
import TextField from "@mui/material/TextField";
import useLanguageRtl from "../../../../hooks/genaral/useLanguageRtl";
function Banner() {
  const { rtl } =useLanguageRtl();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerData, setBannerData] = useState([])
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    try {
      const response = await axios({
        method: "post",
        url: `${BackendUrl}/api/BannerRegister`,
        headers: {
          "Content-Type": "application/json",
          authorization: getToken()
        },
        data: formData,
      });
      if (response && response.data) {
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false)
    }
  };
  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataBanner`, {
        header: {
          authorization: getToken()
        }
      });
      setBannerData(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchBannerData();
  }, []);
  return (
    <div>
      {loading && <Loader />}
      <Header title="أدخال أعلان" dir={rtl?.dir} />
      <form onSubmit={(e) => handleSubmit(e)}>
        <Box
          sx={{ mb: "20px", mt: "20px", }}
          dir={"rtl"}
        >
          <TextField
            label={"عنوان الاعلان"}
            value={title}
            fullWidth
            required
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          
          />
          <Box sx={{ mb: "10px" }} />
          <TextField
            label={"الوصف"}
            value={description}
            fullWidth
            required
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
      </form>
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
        {
          bannerData.length !== 2 &&
          <ButtonTheme className="me-3" onClick={(e) => handleSubmit(e)}>
            أدخال معلومات
          </ButtonTheme>
        }
        <ShowDataBanner />
      </div>
    </div>
  );
}
export default Banner;
