import { Navigate, useLocation } from "react-router-dom";
import { useCollege } from "../../context/CollegeContext";

function RequireSuperAdmin({ children }) {
  const { currentUser } = useCollege();
  const location = useLocation();

  const isSuperAdmin =
    currentUser &&
    currentUser.role === "super_admin" &&
    !currentUser.collegeId &&
    localStorage.getItem("percentagex_role") === "super_admin";

  if (!isSuperAdmin) {
    return <Navigate to="/super-admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireSuperAdmin;
