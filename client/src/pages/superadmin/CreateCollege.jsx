import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ArrowLeft,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  KeyRound,
  UserCheck,
  LogIn,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function CreateCollege() {
  const navigate = useNavigate();
  const { createCollege } = useCollege();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Access Links & Credentials Confirmation
  const [createdCollege, setCreatedCollege] = useState(null);
  const [copiedStaff, setCopiedStaff] = useState(false);
  const [copiedStudent, setCopiedStudent] = useState(false);
  const [copiedCreds, setCopiedCreds] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    college_type: "BTECH",
    address: "",
    phone: "",
    email: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "password123",
  });

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      adminName: prev.adminName ? prev.adminName : name ? `${name} Admin` : "",
    }));
  };

  const handleCodeChange = (e) => {
    const rawCode = e.target.value.toUpperCase();
    const codeSlug = rawCode.toLowerCase().replace(/[^a-z0-9]/g, "");
    setFormData((prev) => ({
      ...prev,
      code: rawCode,
      adminEmail: prev.adminEmail && !prev.adminEmail.endsWith(".edu")
        ? prev.adminEmail
        : codeSlug ? `admin@${codeSlug}.edu` : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast("Please provide both college name and institutional code.", "warning");
      return;
    }

    try {
      setLoading(true);
      let result = null;
      if (createCollege) {
        result = await createCollege(formData);
      }
      const finalized = result || {
        ...formData,
        id: `col-${Date.now()}`,
        adminCredentials: {
          email: formData.adminEmail || `admin@${formData.code.toLowerCase()}.edu`,
          password: formData.adminPassword || "password123",
          name: formData.adminName || `${formData.name} Admin`,
        },
      };
      setCreatedCollege(finalized);
      setStep(2);
      showToast(`Institution "${formData.name}" successfully provisioned!`, "success");
    } catch (err) {
      showToast("Error creating college: " + (err.message || "Failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "staff") {
      setCopiedStaff(true);
      showToast("Staff Portal login link copied to clipboard!", "info");
      setTimeout(() => setCopiedStaff(false), 2000);
    } else if (type === "student") {
      setCopiedStudent(true);
      showToast("Student Access verification link copied to clipboard!", "info");
      setTimeout(() => setCopiedStudent(false), 2000);
    } else if (type === "creds") {
      setCopiedCreds(true);
      showToast("Admin credentials copied to clipboard!", "info");
      setTimeout(() => setCopiedCreds(false), 2000);
    }
  };

  const codeSlug = (createdCollege?.code || formData.code || "").toLowerCase();
  const staffLoginUrl = `${window.location.origin}/staff/${codeSlug}`;
  const studentAccessUrl = `${window.location.origin}/student/${codeSlug}`;

  const adminCreds = createdCollege?.adminCredentials || {
    email: formData.adminEmail || `admin@${codeSlug}.edu`,
    password: formData.adminPassword || "password123",
    name: formData.adminName || `${formData.name} Administrator`,
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Super Admin / Colleges / New</p>
            <h1>Register New Institution</h1>
            <p className="page-description">
              Provision a new college tenant with dedicated segregation, primary Administrator credentials, and access links.
            </p>
          </div>

          <button
            className="outline-button"
            onClick={() => navigate("/super-admin/colleges")}
          >
            <ArrowLeft size={16} />
            <span>Back to Colleges</span>
          </button>
        </div>

        {/* STEP 1: PROVISIONING FORM */}
        {step === 1 && (
          <div className="card-box" style={{ maxWidth: "820px", margin: "0 auto" }}>
            <div className="card-box-header">
              <div>
                <h2>Institution Provisioning Form</h2>
                <p>Configure institutional category, tenant code, and initial College Administrator</p>
              </div>
              <span className="badge badge-primary">Step 1 of 2</span>
            </div>

            <form onSubmit={handleSubmit} className="modal-form-body">
              <div className="form-group">
                <label>Institutional Category / College Type *</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginTop: "6px" }}>
                  {[
                    { type: "BTECH", title: "B.Tech Engineering", desc: "4 Years • HODs • Branches & Sections" },
                    { type: "DEGREE", title: "Degree College", desc: "3 Years • B.Sc / B.Com / B.A" },
                    { type: "JUNIOR_COLLEGE", title: "Junior College", desc: "2 Years • Inter MPC / BiPC / CEC" },
                  ].map((opt) => (
                    <div
                      key={opt.type}
                      onClick={() => setFormData({ ...formData, college_type: opt.type })}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: `2px solid ${formData.college_type === opt.type ? "#2563eb" : "#e2e8f0"}`,
                        background: formData.college_type === opt.type ? "#eff6ff" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <strong style={{ display: "block", color: formData.college_type === opt.type ? "#1e40af" : "#1e293b", fontSize: "13px" }}>
                        {opt.title}
                      </strong>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{opt.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row-two" style={{ marginTop: "12px" }}>
                <div className="form-group">
                  <label>College Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad Institute of Technology"
                    value={formData.name}
                    onChange={handleNameChange}
                  />
                </div>

                <div className="form-group">
                  <label>Institutional Tenant Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HIT-BTECH"
                    value={formData.code}
                    onChange={handleCodeChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Campus Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Tech City, Gachibowli, Hyderabad"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>Official Institutional Email</label>
                  <input
                    type="email"
                    placeholder="admissions@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 40 2345 6789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* PRIMARY ADMIN PROVISIONING SECTION */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <UserCheck size={18} color="#2563eb" />
                  <strong style={{ fontSize: "14px", color: "#1e293b" }}>
                    Primary College Administrator Account
                  </strong>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 14px" }}>
                  This user will manage courses, departments, faculty, students, and timetable for this institution.
                </p>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Administrator Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Administrator Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@college.edu"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: "10px" }}>
                  <label>Initial Login Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="password123"
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                  />
                  <small style={{ color: "#64748b", fontSize: "11px", display: "block", marginTop: "4px" }}>
                    Default initial password for administrator login. Can be changed upon first login.
                  </small>
                </div>
              </div>

              <div className="form-actions-modal" style={{ marginTop: "24px" }}>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => navigate("/super-admin/colleges")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  <CheckCircle size={16} />
                  <span>{loading ? "Provisioning Institution..." : "Provision & Generate Access"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: ACCESS LINKS & CREDENTIALS CONFIRMATION */}
        {step === 2 && createdCollege && (
          <div className="card-box" style={{ maxWidth: "820px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "12px",
                }}
              >
                <Sparkles size={28} />
              </div>
              <h2 style={{ fontSize: "20px", color: "#1e293b", margin: "0 0 6px" }}>
                {createdCollege.name} Successfully Provisioned!
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                Tenant Code: <strong>{createdCollege.code}</strong> • Type: <strong>{createdCollege.college_type}</strong>
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* STAFF ACCESS LINK CARD */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <ShieldCheck size={18} color="#2563eb" />
                  <strong style={{ fontSize: "14px", color: "#1e293b" }}>
                    1. Dedicated Staff & Administration Portal Link
                  </strong>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px" }}>
                  Provide this dedicated URL to the College Administrator, Principal, HODs, Incharges, and Faculty:
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    readOnly
                    value={staffLoginUrl}
                    style={{ background: "#ffffff", fontSize: "13px", color: "#334155", flex: 1 }}
                  />
                  <button
                    className="outline-button"
                    onClick={() => copyToClipboard(staffLoginUrl, "staff")}
                    style={{ minWidth: "100px", justifyContent: "center" }}
                  >
                    {copiedStaff ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                    <span>{copiedStaff ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* ADMIN CREDENTIALS CARD */}
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <KeyRound size={18} color="#2563eb" />
                    <strong style={{ fontSize: "14px", color: "#1e40af" }}>
                      2. College Administrator Login Credentials
                    </strong>
                  </div>
                  <button
                    className="outline-button"
                    onClick={() =>
                      copyToClipboard(
                        `Staff Portal: ${staffLoginUrl}\nAdmin Email: ${adminCreds.email}\nPassword: ${adminCreds.password}`,
                        "creds"
                      )
                    }
                    style={{ fontSize: "11px", padding: "4px 10px" }}
                  >
                    {copiedCreds ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                    <span>{copiedCreds ? "Copied All" : "Copy Credentials"}</span>
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                    <small style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Email</small>
                    <strong style={{ color: "#1e293b", fontSize: "13px" }}>{adminCreds.email}</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                    <small style={{ color: "#64748b", display: "block", fontSize: "11px" }}>Initial Password</small>
                    <strong style={{ color: "#1e293b", fontSize: "13px" }}>{adminCreds.password}</strong>
                  </div>
                </div>
              </div>

              {/* STUDENT VERIFICATION LINK CARD */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <GraduationCap size={18} color="#10b981" />
                  <strong style={{ fontSize: "14px", color: "#1e293b" }}>
                    3. Student Self-Service Access Link
                  </strong>
                </div>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px" }}>
                  Share this zero-password link with students for Hall Ticket & Mobile identity lookup:
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    readOnly
                    value={studentAccessUrl}
                    style={{ background: "#ffffff", fontSize: "13px", color: "#334155", flex: 1 }}
                  />
                  <button
                    className="outline-button"
                    onClick={() => copyToClipboard(studentAccessUrl, "student")}
                    style={{ minWidth: "100px", justifyContent: "center" }}
                  >
                    {copiedStudent ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                    <span>{copiedStudent ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions-modal" style={{ marginTop: "28px" }}>
              <button
                type="button"
                className="outline-button"
                onClick={() => {
                  setStep(1);
                  setFormData({
                    name: "",
                    code: "",
                    college_type: "BTECH",
                    address: "",
                    phone: "",
                    email: "",
                    adminName: "",
                    adminEmail: "",
                    adminPassword: "password123",
                  });
                }}
              >
                Register Another College
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => navigate("/super-admin/colleges")}
              >
                <Building2 size={16} />
                <span>Go to College Directory</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default CreateCollege;
