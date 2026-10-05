import {
  Home,
  CalendarDays,
  ClipboardCheck,
  Users,
  FileText,
  ClipboardList,
  BarChart3,
  UserCircle,
  LogOut,
  GraduationCap,
  Layers,
  BookOpen,
  Grid,
  Shield,
  ArrowLeftRight,
  Building,
  School,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useCollege } from "../context/CollegeContext";

const ROLE_MENUS = {
  super_admin: [
    { label: "Dashboard", icon: Home, path: "/super-admin" },
    { label: "Colleges", icon: Building, path: "/super-admin/colleges" },
    { label: "Register College", icon: School, path: "/super-admin/colleges/create" },
    { label: "Profile", icon: UserCircle, path: "/super-admin/profile" },
  ],
  admin: [
    { label: "Dashboard", icon: Home, path: "/admin" },
    { label: "Faculty", icon: Users, path: "/admin/faculty" },
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Courses", icon: Layers, path: "/admin/courses" },
    { label: "Subjects", icon: BookOpen, path: "/admin/subjects" },
    { label: "Sections", icon: Grid, path: "/admin/sections" },
    { label: "Timetable", icon: CalendarDays, path: "/admin/timetable" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
    { label: "Profile", icon: UserCircle, path: "/admin/profile" },
  ],
  hod: [
    { label: "Dashboard", icon: Home, path: "/hod" },
    { label: "Dept Faculty", icon: Users, path: "/hod/faculty" },
    { label: "Dept Students", icon: GraduationCap, path: "/hod/students" },
    { label: "Dept Sections", icon: Grid, path: "/hod/sections" },
    { label: "Timetable", icon: CalendarDays, path: "/hod/schedule" },
    { label: "Attendance", icon: ClipboardCheck, path: "/hod/attendance" },
    { label: "Dept Reports", icon: BarChart3, path: "/hod/reports" },
    { label: "Profile", icon: UserCircle, path: "/hod/profile" },
  ],
  faculty: [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "View Schedule", icon: CalendarDays, path: "/faculty/schedule" },
    { label: "My Classes", icon: Users, path: "/faculty/classes" },
    { label: "Attendance", icon: ClipboardCheck, path: "/faculty/attendance" },
    { label: "Internal Marks", icon: FileText, path: "/faculty/internal-marks" },
    { label: "Assignments", icon: ClipboardList, path: "/faculty/assignments" },
    { label: "Reports", icon: BarChart3, path: "/faculty/reports" },
    { label: "Profile", icon: UserCircle, path: "/faculty/profile" },
  ],
  student: [
    { label: "Dashboard", icon: Home, path: "/student" },
    { label: "Schedule", icon: CalendarDays, path: "/student/schedule" },
    { label: "Attendance", icon: ClipboardCheck, path: "/student/attendance" },
    { label: "Internal Marks", icon: FileText, path: "/student/internal-marks" },
    { label: "Assignments", icon: ClipboardList, path: "/student/assignments" },
    { label: "Profile", icon: UserCircle, path: "/student/profile" },
  ],
  principal: [
    { label: "Dashboard", icon: Home, path: "/principal" },
    { label: "Attendance", icon: ClipboardCheck, path: "/principal/attendance" },
    { label: "Faculty", icon: Users, path: "/principal/faculty" },
    { label: "Students", icon: GraduationCap, path: "/principal/students" },
    { label: "Reports", icon: BarChart3, path: "/principal/reports" },
    { label: "Profile", icon: UserCircle, path: "/principal/profile" },
  ],
  incharge: [
    { label: "Dashboard", icon: Home, path: "/incharge" },
    { label: "My Section", icon: Shield, path: "/incharge/section" },
    { label: "Attendance", icon: ClipboardCheck, path: "/incharge/attendance" },
    { label: "Students", icon: GraduationCap, path: "/incharge/students" },
    { label: "Schedule", icon: CalendarDays, path: "/incharge/schedule" },
    { label: "Reports", icon: BarChart3, path: "/incharge/reports" },
    { label: "Profile", icon: UserCircle, path: "/incharge/profile" },
  ],
};

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, switchRole, logout } = useCollege();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Detect active role from path or currentUser
  let activeRole = currentUser?.role || "faculty";
  if (location.pathname.startsWith("/super-admin")) activeRole = "super_admin";
  else if (location.pathname.startsWith("/admin")) activeRole = "admin";
  else if (location.pathname.startsWith("/hod")) activeRole = "hod";
  else if (location.pathname.startsWith("/student")) activeRole = "student";
  else if (location.pathname.startsWith("/principal")) activeRole = "principal";
  else if (location.pathname.startsWith("/incharge")) activeRole = "incharge";
  else if (location.pathname.startsWith("/faculty") || location.pathname === "/") activeRole = "faculty";

  const menuItems = ROLE_MENUS[activeRole] || ROLE_MENUS.faculty;

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setShowRoleSwitcher(false);
    if (onClose) onClose();
    if (newRole === "super_admin") navigate("/super-admin");
    else if (newRole === "admin") navigate("/admin");
    else if (newRole === "hod") navigate("/hod");
    else if (newRole === "faculty") navigate("/");
    else if (newRole === "student") navigate("/student");
    else if (newRole === "principal") navigate("/principal");
    else if (newRole === "incharge") navigate("/incharge");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "super_admin": return "#d97706";
      case "admin": return "#dc2626";
      case "principal": return "#7c3aed";
      case "hod": return "#4f46e5";
      case "incharge": return "#0891b2";
      case "student": return "#16a34a";
      default: return "#2563eb";
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? "mobile-open" : ""}`}>
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-mark">P</div>
        <div style={{ flex: 1 }}>
          <h2>PercentageX</h2>
          <span>College Management</span>
        </div>
        {isOpen && (
          <button
            type="button"
            className="sidebar-mobile-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* USER & ROLE BADGE */}
      <div className="sidebar-user-badge">
        <div className="user-avatar" style={{ background: getRoleColor(activeRole) }}>
          {currentUser?.avatar || "PX"}
        </div>
        <div className="user-details">
          <strong>{currentUser?.name || "User"}</strong>
          <span style={{ color: getRoleColor(activeRole) }}>
            {currentUser?.roleLabel || activeRole.toUpperCase()}
          </span>
        </div>
      </div>

      {/* QUICK ROLE SWITCHER TRIGGER (DEV TESTING ONLY) */}
      {import.meta.env.DEV && (
        <div className="role-switch-wrapper">
          <button
            type="button"
            className="role-switcher-btn"
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            title="Switch Active Role for Testing"
          >
            <ArrowLeftRight size={14} />
            <span>Switch Role ({activeRole})</span>
          </button>

          {showRoleSwitcher && (
            <div className="role-dropdown">
              <div className="role-dropdown-header">Select User Role (Dev Only)</div>
              {[
                "super_admin",
                "admin",
                "principal",
                "hod",
                "incharge",
                "faculty",
                "student",
              ].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-option ${activeRole === role ? "active" : ""}`}
                  onClick={() => handleRoleChange(role)}
                >
                  <span
                    className="role-dot"
                    style={{ background: getRoleColor(role) }}
                  ></span>
                  <span className="role-name">
                    {role === "super_admin"
                      ? "Super Admin"
                      : role === "hod"
                      ? "HOD (B.Tech)"
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                  {activeRole === role && <span className="active-tag">Current</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MENU */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && item.path !== "/admin" && item.path !== "/student" && item.path !== "/principal" && item.path !== "/incharge" && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.label}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        className="sidebar-item logout"
        onClick={() => {
          if (onClose) onClose();
          if (logout) logout();
          if (activeRole === "super_admin") {
            navigate("/super-admin/login");
          } else if (activeRole === "student") {
            navigate("/student");
          } else {
            navigate("/staff");
          }
        }}
      >
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
    </>
  );
}

export default Sidebar;