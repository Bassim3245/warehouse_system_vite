import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataStateName } from "../../redux/StateMartrialState/stateMatrialAction";
function useStateMaterial() {
  const dispatch = useDispatch();
  // Memoize selectors to prevent unnecessary re-renders
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);

  useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch]);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      stateMaterial,
    }),
    [stateMaterial],
  );
}

export default useStateMaterial;
