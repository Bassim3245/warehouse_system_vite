import { Box, TextField } from "@mui/material";
import axios from "axios";
import  { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ButtonTheme } from "../../../../style/ButtomStyle";
import Header from "../../../../components/reusableComponent/HeaderComponent";
import SubClassList from "./ShowDataUnitAndSubClass";
import { BackendUrl } from "../../../../redux/api/axios";
import { getToken, getUserInformation } from "../../../../utils/handelCookie";
import Loader from "../../../../components/reusableComponent/Loader";

// Constants
const API_ENDPOINTS = {
  REGISTER: `${BackendUrl}/api/subClassRegister`,
  GET_MAIN_CLASS: `${BackendUrl}/api/getDataMainClass`,
};

const SubClassForm = memo(
  ({
    rtl,
    t,
    dataMainClass,
    selectMainClass,
    subClassName,
    onMainClassChange,
    onSubClassNameChange,
    onSubmit,
  }) => (
    <form onSubmit={onSubmit}>
      <Header title={t("Subclass of the main class")} dir={rtl?.dir} />

      <Box sx={{ mb: "15px" }}>
        <TextField
          label="أختيار الصنف الرئيسي"
          select
          fullWidth
          haswidth={true}
          value={selectMainClass}
          required
          readOnly={false}
          onChange={onMainClassChange}
        />
        {dataMainClass?.map((option) => (
          <MenuItem key={option?.mainClass_id} value={option?.mainClass_id}>
            {option?.main_Class_name}
          </MenuItem>
        ))}
      </Box>

      <Box sx={{ mb: "15px" }}>
        <TextField
          label="الصنف الخاص بالرئيسي"
          fullWidth
          haswidth={true}
          value={subClassName}
          required
          readOnly={false}
          onChange={onSubClassNameChange}
        />
      </Box>
    </form>
  )
);

SubClassForm.displayName = "SubClassForm";

function SubClass({ dataSubClass, setRefreshButton }) {
  // Selectors
  const { rtl } = useSelector((state) => state?.language);

  // State
  const [open, setOpen] = useState(false);
  const [dataMainClass, setDataMainClass] = useState([]);
  const [selectMainClass, setSelectMainClass] = useState("");
  const [subClassName, setSubClassName] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoized values
  const token = useMemo(() => getToken(), []);
  const dataUserById = useMemo(() => getUserInformation(), []);
  const { t } = useTranslation();

  // API configuration memoization
  const apiConfig = useMemo(
    () => ({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: token,
      },
    }),
    [token]
  );

  // Fetch main class data with useCallback
  const fetchMainClassData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axios.get(API_ENDPOINTS.GET_MAIN_CLASS, {
        headers: {
          token: token,
        },
      });

      if (response?.data?.response) {
        setDataMainClass(response.data.response);
      }
    } catch (error) {
      console.error(
        "Error fetching main class:",
        error?.response?.data?.message
      );
      toast.error("فشل في تحميل الأصناف الرئيسية");
    }
  }, [token]);

  // Effect to fetch data when dialog opens
  useEffect(() => {
    if (open) {
      fetchMainClassData();
    }
  }, [open, fetchMainClassData]);

  // Reset form handler
  const resetForm = useCallback(() => {
    setSubClassName("");
    setSelectMainClass("");
  }, []);

  // Submit handler with optimizations
  const handleSubmitSubClass = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (!selectMainClass?.mainClass_id) {
        toast.error("الرجاء اختيار الصنف الرئيسي");
        return;
      }

      if (!subClassName.trim()) {
        toast.error("الرجاء إدخال اسم الصنف الفرعي");
        return;
      }

      setLoading(true);

      // Prepare data
      const formData = new FormData();
      formData.append("subClassName", subClassName.trim());
      formData.append("entities_id", dataUserById?.entity_id);
      formData.append("mainClass_id", selectMainClass.mainClass_id);

      try {
        const response = await axios.post(
          API_ENDPOINTS.REGISTER,
          formData,
          apiConfig
        );

        if (response?.data) {
          toast.success(response.data.message || "تم حفظ البيانات بنجاح");
          resetForm();
          setRefreshButton((prev) => !prev);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "حدث خطأ أثناء حفظ البيانات";
        toast.error(errorMessage);
        console.error("Submit error:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      selectMainClass,
      subClassName,
      dataUserById,
      apiConfig,
      resetForm,
      setRefreshButton,
    ]
  );

  // Memoized event handlers
  const handleMainClassChange = useCallback((e, newValue) => {
    setSelectMainClass(newValue);
  }, []);

  const handleMainClassClear = useCallback(() => {
    setSelectMainClass("");
  }, []);

  const handleSubClassNameChange = useCallback((e) => {
    setSubClassName(e.target.value);
  }, []);

  const handleSubClassNameClear = useCallback(() => {
    setSubClassName("");
  }, []);

  // Memoized button handler
  const handleSaveClick = useCallback(
    (e) => {
      handleSubmitSubClass(e);
    },
    [handleSubmitSubClass]
  );

  return (
    <div>
      {loading && <Loader />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="form-outline mb-3 w-100" dir={rtl?.dir}>
          <SubClassForm
            rtl={rtl}
            t={t}
            dataMainClass={dataMainClass}
            selectMainClass={selectMainClass}
            subClassName={subClassName}
            onMainClassChange={handleMainClassChange}
            onMainClassClear={handleMainClassClear}
            onSubClassNameChange={handleSubClassNameChange}
            onSubClassNameClear={handleSubClassNameClear}
            onSubmit={handleSubmitSubClass}
          />

          <div className="d-flex justify-content-center gap-4">
            <ButtonTheme onClick={handleSaveClick}>حفظ البيانات</ButtonTheme>

            <SubClassList
              dataSubClass={dataSubClass}
              dataMainClass={dataMainClass}
              setOpen1={setOpen}
            />
          </div>
        </div>
      </Box>
    </div>
  );
}

export default memo(SubClass);
