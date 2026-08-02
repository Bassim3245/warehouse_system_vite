import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import Box from "@mui/material/Box";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import { useTranslation } from "react-i18next";
import { AddStateMaterial } from "../../../../redux/StateMartrialState/stateMatrialAction";
import ShowData from "../ShowData/ShowDataStateMaterial";
import TextField from "@mui/material/TextField";
function StatMaterial(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { stateMaterial,message, isSuccess, isError } = useSelector((state) => state.StateMaterial);
  const { rtl } = useSelector((state) => state?.language);
  const [stateName, setStateName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("stateName", stateName);
    dispatch(AddStateMaterial(formData));
    setRefresh(prv=>!prv)
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
    }
    if (isError) {
      console.error(message);
      toast.error(message);
    }
  }, [isSuccess, isError, message]);
  return (
    <div>
      <Header title={t("أدخال حالة المادة")} dir={rtl?.dir} />
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ mb: "20px", mt: "20px", display: "flex", gap: "10px" }}
          dir={rtl?.dir}
        >
          <TextField
            label={t("أسم الحالة")}
            value={stateName}
            required
            fullWidth
            readOnly={false}
            onChange={(e) => setStateName(e.target.value)}
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
        <ButtonTheme onClick={handleSubmit}>
          {t("أدخال معلومات حالة المادة")}
        </ButtonTheme>
        <ShowData
          DataShowInformationStateMaterial={stateMaterial}
          themeMode={props?.theme}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      </div>
    </div>
  );
}

export default StatMaterial;
