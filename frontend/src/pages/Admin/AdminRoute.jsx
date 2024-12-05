import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && (userInfo.isSeller || userInfo.isAdmin) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
export default AdminRoute;
