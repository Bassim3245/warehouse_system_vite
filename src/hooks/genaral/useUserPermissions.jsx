import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetRoleAndUserIdQuery } from "../../redux/RoleSlice/RoleApi";
import { getToken } from "../../utils/handelCookie";

export const useUserPermissions = () => {
  const { roles, applicationPermission } = useSelector(
    (state) => state?.RolesData
  );


  const token = useMemo(() => getToken(), []);
  const [permissionData, setPermissionData] = useState([]);

  // RTK Query: fetch Permission data and cache it
  const { data: Permission } = useGetRoleAndUserIdQuery(undefined, {
    skip: !token,
  });

  const parsePermissionData = useCallback(() => {
    if (Permission?.permission_id) {
      try {
        setPermissionData(JSON.parse(Permission.permission_id));
      } catch (error) {
        console.error("Error parsing permission_id:", error);
      }
    }
  }, [Permission?.permission_id]);

  useEffect(() => {
    parsePermissionData();
  }, [parsePermissionData]);

  return {
    permissionData,
    roles,
    applicationPermission,
  };
};

export default useUserPermissions;
