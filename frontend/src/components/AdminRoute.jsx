// AdminRoute component
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);

  // Check if the user is logged in as admin (user category =1). if true renders the admin content else redirect to login
  return userInfo && userInfo.userCat===1 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};
export default AdminRoute;
