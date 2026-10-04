import { useState, useEffect } from "react";
import {
  Edit,
  Save,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Phone,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function Profile() {
  const { currentUser, updateUserProfile } = useCollege();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Sync formData with currentUser when user changes or edit mode toggles
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        department: currentUser.department || "",
      });
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  }, [currentUser, isEditing]);

  const handleSave = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Name and Email are required fields.", "error");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError("New password and confirm password do not match.");
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const result = await updateUserProfile(payload);

      if (result && result.error) {
        showToast(result.error, "error");
        return;
      }

      setIsEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      showToast(
        newPassword
          ? "Profile details & login password updated successfully!"
          : "Profile credentials updated successfully!",
        "success"
      );
    } catch (err) {
      showToast("Failed to save credentials: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const isSuperAdmin = currentUser?.role === "super_admin" && !currentUser?.collegeId;
  const isCollegeAdmin = currentUser?.role === "admin";
  const avatarInitials = currentUser?.avatar || (isSuperAdmin ? "SA" : isCollegeAdmin ? "CA" : "PX");

  return (
    <AppLayout>
      <div className="profile-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">
              {currentUser?.role?.toUpperCase()} / Profile
            </p>
            <h1>User Profile & Credentials</h1>
            <p className="page-description">
              Manage personal details, contact information, and account login credentials.
            </p>
          </div>

          <button
            className={isEditing ? "outline-button" : "primary-button"}
            onClick={() => {
              setIsEditing(!isEditing);
              setPasswordError("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            <Edit size={16} />
            <span>{isEditing ? "Cancel" : "Edit Profile & Credentials"}</span>
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-main-card">
          <div className="profile-header-banner">
            <div className="profile-avatar-large">
              {avatarInitials}
            </div>
            <div className="profile-title-area">
              <h2>{currentUser?.name || "Administrator"}</h2>
              <span className="profile-role-tag">
                {currentUser?.roleLabel || (
                  isSuperAdmin
                    ? "Platform Super Administrator"
                    : isCollegeAdmin
                    ? `${currentUser?.collegeName || "College"} Administrator`
                    : currentUser?.role?.toUpperCase()
                )}
              </span>
              <p className="profile-id-text">
                ID: {currentUser?.id || (isSuperAdmin ? "usr-superadmin" : "usr-admin")}
              </p>
            </div>
          </div>

          {/* SUPER ADMIN CREDENTIAL BADGE */}
          {isSuperAdmin && (
            <div
              style={{
                margin: "20px 24px 0",
                padding: "14px 18px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#166534",
              }}
            >
              <ShieldCheck size={22} color="#15803d" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "13px" }}>
                <strong>Platform Super Administrator Authority</strong>
                <p style={{ margin: "2px 0 0", color: "#14532d" }}>
                  Your login email (<strong>{currentUser?.email}</strong>) controls platform-level governance, college activation, and global settings.
                </p>
              </div>
            </div>
          )}

          {/* COLLEGE ADMIN CREDENTIAL BADGE */}
          {isCollegeAdmin && (
            <div
              style={{
                margin: "20px 24px 0",
                padding: "14px 18px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#1e40af",
              }}
            >
              <ShieldCheck size={22} color="#2563eb" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "13px" }}>
                <strong>College Administrator Authority & Scope</strong>
                <p style={{ margin: "2px 0 0", color: "#1d4ed8" }}>
                  Institution: <strong>{currentUser?.collegeName || "Assigned Institution"}</strong>
                  {currentUser?.collegeCode ? ` (${currentUser.collegeCode})` : ""}.
                  You manage academic programs, faculty, students, timetable, and attendance strictly scoped to this college.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="profile-form-grid" style={{ padding: "24px" }}>
            {/* FULL NAME */}
            <div className="profile-field-item">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={14} color="#64748b" />
                <span>Full Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter full name"
                  required
                />
              ) : (
                <p>{currentUser?.name || "Not specified"}</p>
              )}
            </div>

            {/* OFFICIAL / LOGIN EMAIL */}
            <div className="profile-field-item">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="#64748b" />
                <span>Login Email Address</span>
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter official email"
                    required
                  />
                  <span style={{ fontSize: "11.5px", color: "#64748b", marginTop: "4px", display: "block" }}>
                    Used as your primary login identifier on Staff & Super Admin portals.
                  </span>
                </div>
              ) : (
                <p>
                  <strong>{currentUser?.email || "Not specified"}</strong>
                </p>
              )}
            </div>

            {/* PHONE NUMBER */}
            <div className="profile-field-item">
              <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#64748b" />
                <span>Phone Number</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98888 00000"
                />
              ) : (
                <p>{currentUser?.phone || "Not specified"}</p>
              )}
            </div>

            {/* ROLE DISPLAY */}
            <div className="profile-field-item">
              <label>System Role</label>
              <p>{currentUser?.roleLabel || currentUser?.role?.toUpperCase()}</p>
            </div>

            {/* AFFILIATED INSTITUTION (FOR COLLEGE ADMIN & STAFF) */}
            {(currentUser?.collegeName || currentUser?.collegeId) && (
              <div className="profile-field-item">
                <label>Affiliated Institution</label>
                <p>
                  <strong>{currentUser.collegeName || "Assigned Institution"}</strong>
                  {currentUser.collegeCode ? ` (${currentUser.collegeCode})` : ""}
                  {currentUser.collegeId ? ` • [${currentUser.collegeId}]` : ""}
                </p>
              </div>
            )}

            {/* OPTIONAL DEPARTMENT / ORG METADATA */}
            {currentUser?.department && (
              <div className="profile-field-item">
                <label>Department / Office</label>
                <p>{currentUser?.department}</p>
              </div>
            )}

            {currentUser?.course && (
              <div className="profile-field-item">
                <label>Program / Course</label>
                <p>{currentUser?.course}</p>
              </div>
            )}

            {currentUser?.year && (
              <div className="profile-field-item">
                <label>Year & Section</label>
                <p>
                  {currentUser?.year} • {currentUser?.section}
                </p>
              </div>
            )}

            {/* EDITING MODE: PASSWORD CREDENTIALS UPDATE */}
            {isEditing && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  marginTop: "12px",
                  paddingTop: "20px",
                  borderTop: "1.5px dashed #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <KeyRound size={18} color="#2563eb" />
                  <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#0f172a" }}>
                    Update Login Password
                  </h3>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    (Leave blank if you don't wish to change your password)
                  </span>
                </div>

                {passwordError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#b91c1c",
                      fontSize: "12.5px",
                      marginBottom: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                  <div className="profile-field-item">
                    <label>New Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new login password"
                        style={{ paddingRight: "40px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "transparent",
                          border: "none",
                          color: "#64748b",
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="profile-field-item">
                    <label>Confirm New Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new login password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SAVE BUTTON ROW */}
            {isEditing && (
              <div
                className="profile-save-btn-row"
                style={{
                  gridColumn: "1 / -1",
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  <Save size={16} />
                  <span>{saving ? "Saving Credentials..." : "Save Credentials & Details"}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
