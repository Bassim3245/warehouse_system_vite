import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWarehouseDataByUserId } from "../redux/wharHosueState/WareHouseAction";
import { getUserInformation } from "../utils/handelCookie";

export const useGetWarehouseByUserId = () => {
  const { wareHouseData } = useSelector((state) => state?.wareHouse);
  const dataUserById = getUserInformation();
  const dispatch = useDispatch();
  const getWarehouseDataIfUserId = useCallback(() => {
    const userId = dataUserById?.user_id;
    if (userId) {
      dispatch(getWarehouseDataByUserId(userId));
    }
  }, [dispatch]);
  useEffect(() => {
    getWarehouseDataIfUserId();
  }, [getWarehouseDataIfUserId]);

  return useMemo(
    () => ({
      wareHouseData,
    }),
    [wareHouseData]
  );
};
