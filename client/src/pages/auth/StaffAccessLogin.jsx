import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  Building,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Sparkles,
  School,
  ChevronDown,
} from "lucide-react";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function StaffAccessLogin() {
  const navigate = useNavigate();
  const { collegeIdentifier } = useParams();
  const { switchRole } = useCollege();
  const { showToast } = useToast();

  const [college, setCollege] = useState(null);
  const [loadingCollege, setLoadingCollege] = useState(!!collegeIdentifier);
  const [collegeError, setCollegeError] = useState("");
  const [isInactive, setIsInactive] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Fetch college if collegeIdentifier is present
  useEffect(() => {
    if (!collegeIdentifier) return;
    const fetchCollege = async () => {
      try {
        setLoadingCollege(true);
        const res = await fetch(`/api/colleges/public/${encodeURIComponent(collegeIdentifier)}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Institution not found in system.");
        }
        setCollege(data.college);
        setIsInactive(data.college.status === "inactive");
      } catch (err) {
        setCollegeError(err.message);
      } finally {
        setLoadingCollege(false);
      }
    };
    fetchCollege();
  }, [collegeIdentifier]);

  // Quick root Super Admin credentials helper
  const handleFillSuperAdmin = () => {
    setEmail("superadmin@percentagex.edu");
    setPassword("password123");
    showToast("Loaded root Super Administrator credentials", "info");
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (isInactive) {
      setAuthError("This institution portal is deactivated. Staff logins are suspended.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setAuthError("Please provide both email address and password.");
      return;
    }

    try {
      setSubmitting(true);
      const activeIdentifier = collegeIdentifier || manualCode.trim() || undefined;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          collegeIdentifier: activeIdentifier,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      // Role is determined strictly by Database, NOT user selection!
      const user = data.user;
      const role = user.role;

      // Update CollegeContext session
      switchRole(role);
      localStorage.setItem("percentagex_user", JSON.stringify(user));
      localStorage.setItem("percentagex_role", role);

      showToast(`Welcome back, ${user.name}! Authenticated as ${role.toUpperCase()}.`, "success");

      // Auto-route strictly based on database role
      switch (role) {
        case "super_admin":
          navigate("/super-admin");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "principal":
          navigate("/principal");
          break;
        case "hod":
          navigate("/hod");
          break;
        case "incharge":
          navigate("/incharge");
          break;
        case "faculty":
          navigate("/faculty");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const targetStudentUrl = college
    ? `/student/${college.code.toLowerCase()}`
    : collegeIdentifier
    ? `/student/${collegeIdentifier}`
    : "/student-access";

  return (
    <div className="login-page page-container-animated">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        {/* INSTITUTIONAL BRANDING HEADER */}
        <div className="login-header">
          <div className="login-logo" style={{ background: "#2563eb", color: "#ffffff" }}>
            <School size={28} />
          </div>

          {loadingCollege ? (
            <p className="text-muted" style={{ padding: "12px 0" }}>Verifying institutional gateway...</p>
          ) : college ? (
            <>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: isInactive ? "#fee2e2" : "#eff6ff",
                  color: isInactive ? "#b91c1c" : "#2563eb",
                  marginBottom: "8px",
                }}
              >
                <Building size={13} />
                <span>{college.code} • {college.college_type}</span>
              </div>
              <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>{college.name}</h1>
              <p style={{ color: "#64748b", fontSize: "13px" }}>
                Official Staff & Administration Gateway
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "#eff6ff",
                  color: "#2563eb",
                  marginBottom: "8px",
                }}
              >
                <ShieldCheck size={13} />
                <span>PercentageX Staff Network</span>
              </div>
              <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Staff & Academic Access</h1>
              <p style={{ color: "#64748b", fontSize: "13px" }}>
                Secure authentication for College Administrators, Principals, HODs, Incharges & Faculty
              </p>
            </>
          )}
        </div>

        {/* INACTIVE WARNING NOTICE */}
        {isInactive && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "14px",
              color: "#991b1b",
              fontSize: "13px",
              lineHeight: 1.5,
              marginBottom: "16px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Institution Portal Suspended</strong>
              <p style={{ margin: "4px 0 0", fontSize: "12px" }}>
                This college tenant has been deactivated by the platform Super Administrator. Staff logins and data access are temporarily disabled.
              </p>
            </div>
          </div>
        )}

        {/* NOT FOUND NOTICE */}
        {collegeError && (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fef3c7",
              borderRadius: "10px",
              padding: "12px",
              color: "#92400e",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <AlertCircle size={18} />
            <span>{collegeError}</span>
          </div>
        )}

        {/* AUTH ERROR NOTICE */}
        {authError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "12px",
              color: "#b91c1c",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <AlertCircle size={18} />
            <span>{authError}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleStaffLogin} className="login-form">
          {!collegeIdentifier && (
            <div className="form-group">
              <label>Institutional Tenant Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. SXIT-BTECH"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              />
            </div>
          )}

          <div className="form-group">
            <label>Staff Official Email *</label>
            <div className="search-input-wrapper" style={{ padding: "0 10px" }}>
              <Mail size={16} color="#64748b" />
              <input
                type="email"
                required
                disabled={isInactive}
                placeholder="faculty.name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Staff Password *</label>
            <div className="search-input-wrapper" style={{ padding: "0 10px" }}>
              <Lock size={16} color="#64748b" />
              <input
                type="password"
                required
                disabled={isInactive}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* ROOT SUPER ADMIN LOGIN HELPER */}
          {!collegeIdentifier && (
            <div style={{ margin: "10px 0", textAlign: "center" }}>
              <button
                type="button"
                className="text-btn"
                onClick={handleFillSuperAdmin}
                style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px", color: "#64748b" }}
              >
                <Sparkles size={13} color="#2563eb" />
                <span>Fill Super Admin (superadmin@percentagex.edu)</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={submitting || isInactive}
            style={{ opacity: isInactive ? 0.6 : 1 }}
          >
            <span>{submitting ? "Authenticating Staff..." : "Sign In to Staff Portal"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* STRICT SEPARATION NOTICE: STUDENT LINK */}
        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #f1f5f9",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px" }}>
            Are you an enrolled student?
          </p>
          <Link
            to={targetStudentUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#16a34a",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <GraduationCap size={16} />
            <span>Go to Dedicated Student Verification Portal →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StaffAccessLogin;
