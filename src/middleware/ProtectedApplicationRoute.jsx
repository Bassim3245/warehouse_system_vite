import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { setPermissions, getPermissions } from "../utils/handelCookie";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const ProtectedApplicationRoute = ({
  applicationId,
  redirectPath = "/unauthorized",
}) => {
  const location = useLocation();
  const [localPermissions] = React.useState(() => getPermissions());
  // Check if we have valid permissions data either from props or cookies
  const isPermissionsValid = React.useMemo(() => {
    const permissions = localPermissions?.length > 0 ? localPermissions : [];
    return Array.isArray(permissions) && permissions.length > 0;
  }, [localPermissions]);

  // Store permissions in cookies when they change
  React.useEffect(() => {
    if (localPermissions?.length > 0) {
      setPermissions(localPermissions);
    }
  }, [localPermissions]);

  // Check permission for current application using either props or stored permissions
  const hasPermission = React.useMemo(() => {
    if (!isPermissionsValid) return false;
    const permissions = localPermissions?.length > 0 ? localPermissions : [];
    return permissions?.some(
      (permission) =>
        Number(permission?.user_id_application__permission_id) ===
        Number(applicationId)
    );
  }, [localPermissions, applicationId, isPermissionsValid]);

  // Only redirect if we're not loading and don't have permission
  if (!hasPermission && !localPermissions?.length > 0) {
    return <LoadingSpinner />;
  }
  if (!hasPermission) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{
          from: location,
          applicationId,
          message: "لا تمتلك الصلاحيات للوصول إلى هذا التطبيق",
        }}
      />
    );
  }
  // Render authorized content
  return <Outlet />;
};
export default React.memo(ProtectedApplicationRoute);
