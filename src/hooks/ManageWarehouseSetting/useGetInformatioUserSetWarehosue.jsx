import React, { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../../redux/api/axiosConfig";
import useGetfactoryInformationByUserId from "./useGetfactoryInformationByUserId";
import { getToken } from "../../utils/handelCookie";
import useUserData from "../genaral/useUserData";

const useGetInformationUserWarhosue = () => {
  const [userWarehouse, setUserWarehouse] = useState([]);
  const { dataUserFactory } = useGetfactoryInformationByUserId();
  const { dataUserLab } = useUserData();
  const getInformationUserWarehouse = useCallback(async () => {
    const params = new URLSearchParams();

    if (dataUserLab?.lab_id) {
      params.append("lab_id", dataUserLab.lab_id);
    } else if (dataUserFactory?.factory_id) {
      params.append("factory_id", dataUserFactory.factory_id);
    } else {
      params.append("isMainWarehouse", true);
    }

    if (!params.toString()) return;
    try {
      const res = await axiosInstance.get(
        `/api/getInformationUsersWhenSetToLab?${params.toString()}`,
        {},
        {
          headers: {
            Authorization: `${getToken()}`,
          },
        }
      );
      setUserWarehouse(res.data.data || []);
    } catch (error) {
      console.error("Error fetching user warehouse:", error);
      setUserWarehouse([]);
    }
  }, [
    dataUserLab?.lab_id,
    dataUserFactory?.factory_id,
  ]);

  useEffect(() => {
    getInformationUserWarehouse();
  }, [getInformationUserWarehouse]);

  return { userWarehouse };
};

export default useGetInformationUserWarhosue;
