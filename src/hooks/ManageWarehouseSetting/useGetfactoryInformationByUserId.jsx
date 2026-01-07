import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataUserWithFactoryById } from "../../redux/getDataProjectById/getActions";
import { getUserInformation } from "../../utils/handelCookie";

const useGetfactoryInformationByUserId = () => {
  const { dataUserFactory } = useSelector(
    (state) => state?.dataHandelUserAction
  );
  const dispatch = useDispatch();
  const dataUserById = getUserInformation();
  const dispatchUserWithFactoryById = useCallback(() => {
    if (dataUserById.user_id && dataUserById.entity_id) {
      dispatch(
        getDataUserWithFactoryById({
          user_id: dataUserById.user_id,
          entity_id: dataUserById.entity_id,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    dispatchUserWithFactoryById();
  }, [dispatchUserWithFactoryById]);

  return {
    dataUserFactory,
  };
};

export default useGetfactoryInformationByUserId;
