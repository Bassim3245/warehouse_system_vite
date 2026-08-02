import { useMemo } from "react";
import { getUserInformation } from "../utils/handelCookie";
import { useGetWarehouseDataByUserIdQuery } from "../redux/wharHosueState/WarehouseApi";

export const useGetWarehouseByUserId = () => {
  const dataUserById = getUserInformation();
  const userId = dataUserById?.user_id;

  const { data: wareHouseData = [] } = useGetWarehouseDataByUserIdQuery(
    userId,
    { skip: !userId }
  );

  return useMemo(
    () => ({
      wareHouseData,
    }),
    [wareHouseData]
  );
};
