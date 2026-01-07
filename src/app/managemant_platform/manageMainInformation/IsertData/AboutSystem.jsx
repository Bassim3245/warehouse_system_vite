import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import axios from "axios";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import ShowDataAboutSystem from "../ShowData/AboutSystem";
import { BackendUrl } from "../../../../redux/api/axios";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import { getToken } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";
import { TextField } from "@mui/material";
function AboutSystem() {
  const { rtl } = useSelector((state) => state.language);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading,setLoading]=useState(false)
  const [aboutSystem, setAboutSystem] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      const response = await axios.post(
        `${BackendUrl}/api/aboutSystemAdd`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: getToken(),
          },
        }
      );
      if (response) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
    }finally{
      setLoading(false)
    }
  };
  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataAbout`, {
        headers: {
          authorization: getToken(),
        },
      });
      setAboutSystem(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    fetchAboutData();
  }, []);
  return (
    <div>
      {loading&&<Loader/>}
      <Header title="عن النظام" dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2, mt: 2 }} dir="rtl">
          <TextField
            label="عنوان "
            fullWidth
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <Box sx ={{mb:"10px"}}/>
          <TextField
            label="النص "
            fullWidth
            value={text}
            required
            onChange={(e) => setText(e.target.value)}
          />
        </Box>
      </form>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        {aboutSystem?.length !== 3 && (
          <ButtonTheme onClick={handleSubmit}>أدخال معلومات</ButtonTheme>
        )}
        <ShowDataAboutSystem />
      </Box>
    </div>
  );
}

export default AboutSystem;
