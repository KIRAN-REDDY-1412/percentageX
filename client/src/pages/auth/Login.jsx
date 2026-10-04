import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  GraduationCap,
  Award,
  Lock,
  Mail,
  ArrowRight,
  School,
} from "lucide-react";
import { useCollege } from "../../context/CollegeContext";

function Login() {
  const navigate = useNavigate();
  const { switchRole } = useCollege();

  const [selectedRole, setSelectedRole] = useState("faculty");
  const [email, setEmail] = useState("rajesh.cse@percentagex.edu");
  const [password, setPassword] = useState("password123");

  const roleProfiles = [
    {
      role: "super_admin",
      title: "Super Admin",
      desc: "Global platform & multi-college",
      email: "superadmin@percentagex.edu",
      icon: Shield,
      color: "#d97706",
      bg: "#fef3c7",
      path: "/super-admin",
    },
    {
      role: "admin",
      title: "College Admin",
      desc: "Full management & assignments",
      email: "admin@percentagex.edu",
      icon: Shield,
      color: "#dc2626",
      bg: "#fef2f2",
      path: "/admin",
    },
    {
      role: "principal",
      title: "Principal",
      desc: "College-wide analytics & audit",
      email: "principal@percentagex.edu",
      icon: Award,
      color: "#7c3aed",
      bg: "#f5f3ff",
      path: "/principal",
    },
    {
      role: "hod",
      title: "HOD (B.Tech)",
      desc: "Department-level CSE authority",
      email: "hod.cse@percentagex.edu",
      icon: School,
      color: "#4f46e5",
      bg: "#e0e7ff",
      path: "/hod",
    },
    {
      role: "incharge",
      title: "Section Incharge",
      desc: "Assigned section supervision",
      email: "incharge@percentagex.edu",
      icon: School,
      color: "#0891b2",
      bg: "#ecfeff",
      path: "/incharge",
    },
    {
      role: "faculty",
      title: "Faculty",
      desc: "Schedule, Attendance & Marks",
      email: "rajesh.cse@percentagex.edu",
      icon: Users,
      color: "#2563eb",
      bg: "#eff6ff",
      path: "/",
    },
  ];

  const handleRoleSelect = (p) => {
    setSelectedRole(p.role);
    setEmail(p.email);
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    switchRole(selectedRole);
    const profile = roleProfiles.find((p) => p.role === selectedRole);
    navigate(profile ? profile.path : "/");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LOGO & TITLE */}
        <div className="login-header">
          <div className="login-logo-mark">P</div>
          <h1>PercentageX</h1>
          <p>College Management System Portal</p>
        </div>

        {/* ROLE SELECTION TABS */}
        <div className="login-role-selection">
          <label className="login-label">Select Demo Role to Login</label>
          <div className="role-cards-grid">
            {roleProfiles.map((p) => {
              const Icon = p.icon;
              const isSelected = selectedRole === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  className={`role-select-card ${isSelected ? "selected" : ""}`}
                  onClick={() => handleRoleSelect(p)}
                >
                  <div
                    className="role-card-icon"
                    style={{ background: p.bg, color: p.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="role-card-text">
                    <strong>{p.title}</strong>
                    <small>{p.desc}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CREDENTIALS FORM */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={17} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            <span>Continue to Staff Dashboard</span>
            <ArrowRight size={17} />
          </button>
        </form>

        {/* STUDENT ACCESS DIRECT LINK */}
        <div style={{ marginTop: "20px", padding: "14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "#166534", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>
            <GraduationCap size={18} />
            <span>Looking for Student Portal?</span>
          </div>
          <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#15803d" }}>
            Students access individual attendance, marks & timetables using Hall Ticket & Mobile Number verification.
          </p>
          <button
            type="button"
            className="outline-button"
            style={{ width: "100%", background: "#ffffff", borderColor: "#16a34a", color: "#166534", fontWeight: "600", justifyContent: "center" }}
            onClick={() => navigate("/student-access")}
          >
            <span>Enter Student Access Portal</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="login-footer">
          <p>PercentageX • Unified Academic Management System</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
