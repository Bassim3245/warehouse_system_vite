import { useMemo } from "react";
import { getToken, getUserInformation } from "../../utils/handelCookie";
import useLanguageRtl from "./useLanguageRtl";
import { useGetDataUserWithWareHouseDataByIdQuery } from "../../redux/getDataProjectById/getDataUserApi";

export const useUserData = () => {
  const { rtl } = useLanguageRtl();
  const token = useMemo(() => getToken(), []);
  const dataUserById = useMemo(() => getUserInformation(), []);
  const user_id = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);
  const entity_id = useMemo(() => dataUserById?.entity_id, [dataUserById?.entity_id]);

  const shouldFetch = user_id && entity_id && dataUserById?.group_name === "warehouse_Manager";

  const { data: dataUserLab } = useGetDataUserWithWareHouseDataByIdQuery(
    { user_id, entity_id },
    { skip: !shouldFetch }
  );

  return {
    token,
    dataUserById,
    dataUserLab,
    user_id,
    entity_id,
    rtl,
  };
};

export default useUserData;
