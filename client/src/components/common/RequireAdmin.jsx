import { Navigate, useLocation } from "react-router-dom";
import { useCollege } from "../../context/CollegeContext";

function RequireAdmin({ children }) {
  const { currentUser } = useCollege();
  const location = useLocation();

  const isCollegeAdmin =
    currentUser &&
    currentUser.role === "admin" &&
    Boolean(currentUser.collegeId);

  if (!isCollegeAdmin) {
    if (currentUser?.role === "super_admin") {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/staff" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAdmin;
