import { useEffect, useMemo, useState, useCallback } from "react";
import { getRoleAndUserId } from "../redux/RoleSlice/rolAction";
import { useDispatch, useSelector } from "react-redux";
import { getToken, getUserInformation } from "../utils/handelCookie";
import { setLanguage } from "../redux/LanguageState";
import { getDataUserWithWareHouseDataById } from "../redux/getDataProjectById/getActions";
import { getDataStateName } from "../redux/StateMartrialState/stateMatrialAction";
import { getDataMinistries } from "../redux/MinistriesState/MinistresAction";
import { getDataEntities } from "../redux/EntitiesState/EntitiesAction";

function usePermissionUser() {
  const dispatch = useDispatch();
  // Memoize selectors to prevent unnecessary re-renders
  const { Permission, roles, applicationPermission } = useSelector(
    (state) => state?.RolesData
  );
  const { dataUserLab } = useSelector((state) => state?.dataHandelUserAction);
  const { Ministries } = useSelector((state) => state?.Ministries);
  const { Entities } = useSelector((state) => state?.Entities);
  const { rtl } = useSelector((state) => state?.language);
  const { stateMaterial } = useSelector((state) => state?.StateMaterial);

  // Memoize user data to prevent unnecessary re-computations
  const token = useMemo(() => getToken(), []);
  const dataUserById = useMemo(() => getUserInformation(), []);

  // Memoize user ID and entity ID to prevent unnecessary effect triggers
  const user_id = useMemo(() => dataUserById?.user_id, [dataUserById?.user_id]);
  const entity_id = useMemo(() => dataUserById?.entity_id, [dataUserById?.entity_id]);

  const [permissionData, setPermissionData] = useState([]);


  const dispatchRoleAndUserId = useCallback(() => {
    if (token) {
      dispatch(getRoleAndUserId(token));
    }
  }, [dispatch, token]);

  const dispatchUserWithWareHouseData = useCallback(() => {
    if (user_id && entity_id && dataUserById?.group_name === "warehouse_Manager") {
      dispatch(getDataUserWithWareHouseDataById({ user_id: user_id, entity_id: entity_id }));
    }
  }, [dispatch, user_id, entity_id, dataUserById?.group_name]);



  const dispatchStaticData = useCallback(() => {
    dispatch(setLanguage());
    dispatch(getDataMinistries());
    dispatch(getDataEntities());
  }, [dispatch])
    ;
  const parsePermissionData = useCallback(() => {
    if (Permission?.permission_id) {
      try {
        setPermissionData(JSON.parse(Permission.permission_id));
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission?.permission_id]);

  // Effects with optimized dependencies
  useEffect(() => {
    dispatchStaticData();
  }, [dispatchStaticData]);

  useEffect(() => {
    dispatchRoleAndUserId();
  }, [dispatchRoleAndUserId]);

  useEffect(() => {
    dispatchUserWithWareHouseData();
  }, [dispatchUserWithWareHouseData]);
  useEffect(() => {
    dispatchUserWithWareHouseData();
  }, [dispatchUserWithWareHouseData]);
  useEffect(() => {
    dispatch(getDataStateName());
  }, [dispatch]);
  useEffect(() => {
    parsePermissionData();
  }, [parsePermissionData]);


  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      permissionData,
      dataUserById,
      roles,
      applicationPermission,
      dataUserLab,
      Ministries,
      Entities,
      rtl,
      stateMaterial,
    }),
    [
      permissionData,
      dataUserById,
      roles,
      applicationPermission,
      dataUserLab,
      Ministries,
      Entities,
      rtl,
      stateMaterial,
    ]
  );
}

export default usePermissionUser;