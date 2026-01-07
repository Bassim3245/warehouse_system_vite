import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../redux/api/axiosConfig";
import { getToken } from "../utils/handelCookie";

function useGetInformationClass() {
  const [dataMainClass, setDataMainClass] = useState([]);
  const [dataSubClass, setDataSubClass] = useState([]);
  const token = getToken();
  const fetchDataClass = useCallback(async () => {
    try {
      const fetchMainClassData = axiosInstance.get(`/api/getDataMainClass`, {
        headers: { authorization: token },
      });
      const fetchSubClassData = axiosInstance.get(`/api/getDataSubClass`, {
        headers: { authorization: token },
      });
      const [mainClassResponse, subClassResponse] = await Promise.allSettled([
        fetchMainClassData,
        fetchSubClassData,
      ]);
      // Set data or handle failures
      if (mainClassResponse.status === "fulfilled") {
        setDataMainClass(mainClassResponse.value?.data?.response || []);
      } else {
        console.error(
          "Failed to fetch main class data:",
          mainClassResponse.reason
        );
      }
      if (subClassResponse.status === "fulfilled") {
        setDataSubClass(subClassResponse.value?.data?.response || []);
      } else {
        console.error(
          "Failed to fetch sub class data:",
          subClassResponse.reason
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token])
  useEffect(() => {

    fetchDataClass();
  }, [fetchDataClass]);
  return {
    dataMainClass,
    dataSubClass,
  };
}

export default useGetInformationClass;
