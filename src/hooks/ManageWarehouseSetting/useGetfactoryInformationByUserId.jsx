import { useMemo } from "react";
import { getUserInformation } from "../../utils/handelCookie";
import { useGetDataUserWithFactoryByIdQuery } from "../../redux/getDataProjectById/getDataUserApi";

const useGetfactoryInformationByUserId = () => {
  const dataUserById = useMemo(() => getUserInformation(), []);
  const user_id = dataUserById?.user_id;
  const entity_id = dataUserById?.entity_id;

  const shouldFetch = user_id && entity_id;

  const { data: dataUserFactory } = useGetDataUserWithFactoryByIdQuery(
    { user_id, entity_id },
    { skip: !shouldFetch }
  );

  return {
    dataUserFactory,
  };
};

export default useGetfactoryInformationByUserId;
