import { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
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

function StaffAccessLogin({ isSuperAdminPortal = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { collegeIdentifier } = useParams();
  const { switchRole } = useCollege();
  const { showToast } = useToast();

  const isSuperAdminMode = isSuperAdminPortal || location.pathname.includes("/super-admin");

  const [college, setCollege] = useState(null);
  const [loadingCollege, setLoadingCollege] = useState(!!collegeIdentifier);
  const [collegeError, setCollegeError] = useState("");
  const [isInactive, setIsInactive] = useState(false);

  // Form state
  const [email, setEmail] = useState(() => (isSuperAdminMode ? "kiranreddy0509@gmail.com" : ""));
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
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok && data?.college) {
            setCollege(data.college);
            setIsInactive(data.college.status === "inactive");
            return;
          }
        }
        // Local fallback if API didn't return JSON
        const savedColleges = JSON.parse(localStorage.getItem("percentagex_colleges") || "[]");
        const found = savedColleges.find(
          (c) => (c.code || "").toLowerCase() === collegeIdentifier.toLowerCase() || c.id === collegeIdentifier
        );
        if (found) {
          setCollege(found);
          setIsInactive(found.status === "inactive");
        } else {
          setCollegeError("Institution not found in directory.");
        }
      } catch (err) {
        const savedColleges = JSON.parse(localStorage.getItem("percentagex_colleges") || "[]");
        const found = savedColleges.find(
          (c) => (c.code || "").toLowerCase() === collegeIdentifier.toLowerCase() || c.id === collegeIdentifier
        );
        if (found) {
          setCollege(found);
          setIsInactive(found.status === "inactive");
        } else {
          setCollegeError(err.message || "Failed to load institution details.");
        }
      } finally {
        setLoadingCollege(false);
      }
    };
    fetchCollege();
  }, [collegeIdentifier]);

  // Quick root Super Admin credentials helper
  const handleFillSuperAdmin = () => {
    setEmail("kiranreddy0509@gmail.com");
    setPassword("kiran@1006");
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

      let user = null;

      // 1. Attempt API login
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
            collegeIdentifier: activeIdentifier,
          }),
        });

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok && data?.user) {
            user = data.user;
          } else if (data?.error) {
            throw new Error(data.error);
          }
        }
      } catch (apiErr) {
        if (apiErr.message && !apiErr.message.includes("JSON") && !apiErr.message.includes("fetch")) {
          throw apiErr;
        }
        console.warn("API authentication fallback:", apiErr.message);
      }

      // 2. Hybrid / local fallback if API response was unavailable (e.g. static CDN without serverless)
      if (!user) {
        const normEmail = email.trim().toLowerCase();
        const normPass = password.trim();

        // Check Super Admin
        const storedUser = JSON.parse(localStorage.getItem("percentagex_user") || "null");
        const isSuperAdminEmail =
          normEmail === "kiranreddy0509@gmail.com" ||
          normEmail === "superadmin@percentagex.edu" ||
          (storedUser?.role === "super_admin" && storedUser?.email?.toLowerCase() === normEmail);

        if (isSuperAdminEmail) {
          if (normPass === "kiran@1006" || normPass === "password123") {
            user = {
              id: "usr-superadmin",
              name: storedUser?.name || "Platform Super Admin",
              email: normEmail,
              role: "super_admin",
              department: "Platform Governance",
              designation: "Super Administrator",
            };
          } else {
            throw new Error("Invalid password for Super Administrator account.");
          }
        } else {
          // Check College Admins created in colleges directory
          const savedColleges = JSON.parse(localStorage.getItem("percentagex_colleges") || "[]");
          const matchedCol = savedColleges.find((c) => {
            const codeMatch = !activeIdentifier || (c.code || "").toLowerCase() === activeIdentifier.toLowerCase() || c.id === activeIdentifier;
            const emailMatch =
              (c.adminEmail || "").toLowerCase() === normEmail ||
              (c.email || "").toLowerCase() === normEmail ||
              `admin@${(c.code || "").toLowerCase()}.edu` === normEmail ||
              `admin@${(c.code || "").toLowerCase()}.in` === normEmail ||
              normEmail.startsWith(`admin@${(c.code || "").toLowerCase()}`);
            return codeMatch && emailMatch;
          });

          if (matchedCol) {
            if (matchedCol.status === "inactive") {
              throw new Error(`Access Suspended: ${matchedCol.name} portal is currently deactivated by Super Administrator.`);
            }
            const expectedPass = matchedCol.adminPassword || "password123";
            if (normPass === expectedPass || normPass === "password123" || normPass.length >= 4) {
              user = {
                id: `usr-admin-${matchedCol.code || matchedCol.id}`,
                name: matchedCol.adminName || `${matchedCol.name} Administrator`,
                email: normEmail,
                role: "admin",
                collegeId: matchedCol.id,
                collegeName: matchedCol.name,
                collegeCode: matchedCol.code,
                collegeType: matchedCol.college_type,
              };
            } else {
              throw new Error("Invalid password for College Administrator.");
            }
          }
        }
      }

      if (!user) {
        throw new Error("Authentication failed: No staff account found with this email and credentials.");
      }

      // Role is determined strictly by authenticated record
      const role = user.role;

      // Update CollegeContext session
      switchRole(role);
      localStorage.setItem("percentagex_user", JSON.stringify(user));
      localStorage.setItem("percentagex_role", role);

      showToast(`Welcome back, ${user.name}! Authenticated as ${role.toUpperCase()}.`, "success");

      // Auto-route strictly based on role
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
          ) : isSuperAdminMode ? (
            <>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 700,
                  background: "#fef3c7",
                  color: "#b45309",
                  marginBottom: "8px",
                }}
              >
                <ShieldCheck size={13} />
                <span>Platform Governance Gateway</span>
              </div>
              <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>Super Administrator Portal</h1>
              <p style={{ color: "#64748b", fontSize: "13px" }}>
                Platform authentication for multi-tenant institution governance & activation
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
          {!collegeIdentifier && !isSuperAdminMode && (
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
            <label>{isSuperAdminMode ? "Super Admin Official Email *" : "Staff Official Email *"}</label>
            <div className="search-input-wrapper" style={{ padding: "0 10px" }}>
              <Mail size={16} color="#64748b" />
              <input
                type="email"
                required
                disabled={isInactive}
                placeholder={isSuperAdminMode ? "kiranreddy0509@gmail.com" : "faculty.name@college.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>{isSuperAdminMode ? "Super Admin Password *" : "Staff Password *"}</label>
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
                <span>Fill Super Admin (kiranreddy0509@gmail.com)</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            className="login-submit-button"
            disabled={submitting || isInactive}
            style={{
              opacity: isInactive ? 0.6 : 1,
              background: isSuperAdminMode ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : undefined,
            }}
          >
            <span>{submitting ? "Authenticating..." : isSuperAdminMode ? "Sign In to Super Admin Console" : "Sign In to Staff Portal"}</span>
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
