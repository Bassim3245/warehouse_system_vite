import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
const PrivateRoutes = () => {
  const token = Cookies.get("refreshToken");
  if (!token) {
    // Redirect to login page instead of root
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
export default PrivateRoutes;
