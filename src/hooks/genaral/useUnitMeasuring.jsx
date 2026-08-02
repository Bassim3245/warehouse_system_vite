import React, { useCallback, useEffect, useState } from "react";
import { BackendUrl } from "../../redux/api/axios";
import { axiosInstance } from "../../redux/api/axiosConfig";

function useUnitMeasuring() {
  const [dataUnitMeasuring, setDataUnitMeasuring] = useState([]);
  const fetchData = useCallback(async () => {
    await axiosInstance
      .get(`${BackendUrl}/api/getAllDataUnits`)
      .then((res) => {
        setDataUnitMeasuring(res?.data?.response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  return { dataUnitMeasuring };
}

export default useUnitMeasuring;
