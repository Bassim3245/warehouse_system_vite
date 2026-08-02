import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataMinistries } from "../../redux/MinistriesState/MinistresAction";

export const useMinistries = () => {
  const dispatch = useDispatch();
  const { Ministries } = useSelector((state) => state?.Ministries);

  useEffect(() => {
    dispatch(getDataMinistries());
  }, [dispatch]);

  return { Ministries };
};

export default useMinistries;
