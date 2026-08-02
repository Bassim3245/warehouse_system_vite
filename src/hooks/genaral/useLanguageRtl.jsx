import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../redux/LanguageState";

export const useLanguageRtl = () => {
  const dispatch = useDispatch();
  const { rtl } = useSelector((state) => state?.language);

  useEffect(() => {
    dispatch(setLanguage());
  }, [dispatch]);

  return { rtl };
};

export default useLanguageRtl;
