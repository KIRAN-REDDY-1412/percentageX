import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Building,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Pencil,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function Colleges() {
  const navigate = useNavigate();
  const { colleges, updateCollegeStatus, updateCollegeDetails } = useCollege();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState("");

  // Edit College Modal State
  const [editingCollege, setEditingCollege] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    college_type: "BTECH",
    address: "",
    phone: "",
    email: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || c.college_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleToggle = async (col) => {
    const newStatus = col.status === "active" ? "inactive" : "active";
    if (updateCollegeStatus) {
      await updateCollegeStatus(col.id, newStatus);
      showToast(
        `Institution "${col.name}" has been ${newStatus === "active" ? "activated" : "deactivated"}. Access links are now ${newStatus === "active" ? "live" : "suspended"}.`,
        newStatus === "active" ? "success" : "warning"
      );
    }
  };

  const copyLink = (url, key, label) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    showToast(`${label} copied to clipboard!`, "info");
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleOpenEdit = (col) => {
    setEditingCollege(col);
    setEditFormData({
      name: col.name || "",
      code: col.code || "",
      college_type: col.college_type || "BTECH",
      address: col.address || "",
      phone: col.phone || "",
      email: col.email || "",
      logo: col.logo || "",
      status: col.status || "active",
    });
    setFormError("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!editFormData.name.trim() || !editFormData.code.trim()) {
      setFormError("Institution Name and Code are required.");
      return;
    }

    try {
      setSaving(true);
      const res = await updateCollegeDetails(editingCollege.id, {
        name: editFormData.name.trim(),
        code: editFormData.code.trim().toUpperCase(),
        college_type: editFormData.college_type,
        address: editFormData.address.trim(),
        phone: editFormData.phone.trim(),
        email: editFormData.email.trim(),
        logo: editFormData.logo || null,
        status: editFormData.status,
      });

      if (res && res.error) {
        setFormError(res.error);
        return;
      }

      showToast(`Institution "${editFormData.name.trim()}" updated successfully!`, "success");
      setEditingCollege(null);
    } catch (err) {
      setFormError("Failed to update college: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Super Admin / Colleges</p>
            <h1>Institutional Directory</h1>
            <p className="page-description">
              Manage multi-tenant colleges, separate Staff & Student access links, and campus activation.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/super-admin/colleges/create")}
          >
            <Plus size={16} />
            <span>Create College</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="filter-card">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by college name, code, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-selects-row">
            <div className="filter-select-wrapper">
              <Filter size={16} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Institutional Types</option>
                <option value="BTECH">B.Tech Engineering Colleges</option>
                <option value="DEGREE">Degree Colleges</option>
                <option value="JUNIOR_COLLEGE">Junior Colleges</option>
              </select>
            </div>
          </div>
        </div>

        {/* COLLEGES GRID */}
        {filtered.length === 0 ? (
          <div className="card-box" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Building size={40} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No Institutions Registered Yet</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "14px" }}>
              Get started by provisioning your first college institution and primary administrator.
            </p>
            <button className="primary-button" onClick={() => navigate("/super-admin/colleges/create")} style={{ margin: "0 auto" }}>
              <Plus size={16} />
              <span>Create First College</span>
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((col) => {
              const staffUrl = `${window.location.origin}/staff/${(col.code || "").toLowerCase()}`;
              const studentUrl = `${window.location.origin}/student/${(col.code || "").toLowerCase()}`;
              const isInactive = col.status === "inactive";

              return (
                <div className="admin-course-card" key={col.id}>
                  {/* TOP CARD HEADER WITH TITLE & EDIT BUTTON */}
                  <div
                    className="course-card-top"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                      {col.logo ? (
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                          }}
                        >
                          <img src={col.logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                      ) : (
                        <div
                          className="course-icon-box"
                          style={{
                            background: isInactive ? "#f1f5f9" : "#eff6ff",
                            color: isInactive ? "#94a3b8" : "#2563eb",
                            flexShrink: 0,
                          }}
                        >
                          <Building size={22} />
                        </div>
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div className="course-badge">{col.code}</div>
                        <h2 style={{ wordBreak: "break-word" }}>{col.name}</h2>
                        <p style={{ wordBreak: "break-word" }}>{col.address || "Main Campus"}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="outline-button"
                      onClick={() => handleOpenEdit(col)}
                      title="Edit College Details"
                      style={{
                        padding: "6px 12px",
                        fontSize: "12px",
                        gap: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="course-details-box">
                    <div className="detail-row">
                      <span>Institutional Category:</span>
                      <span
                        className={`attendance-pill ${
                          col.college_type === "BTECH"
                            ? "high"
                            : col.college_type === "DEGREE"
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {col.college_type === "BTECH"
                          ? "B.Tech (Department / HOD Model)"
                          : col.college_type === "DEGREE"
                          ? "Degree (B.Sc / B.Com / B.A)"
                          : "Junior College (Intermediate)"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Portal Status:</span>
                      <span
                        className={`status-badge ${
                          col.status === "active" ? "active" : "inactive"
                        }`}
                      >
                        {col.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Contact:</span>
                      <strong>{col.email || "info@percentagex.edu"}</strong>
                    </div>
                  </div>

                  {/* DEDICATED ACCESS LINKS SECTION */}
                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "8px",
                      padding: "12px",
                      margin: "12px 0",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {/* STAFF LINK */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1e293b", overflow: "hidden" }}>
                        <ShieldCheck size={14} color="#2563eb" />
                        <span style={{ fontWeight: 600 }}>Staff:</span>
                        <span style={{ color: "#64748b", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          /staff/{(col.code || "").toLowerCase()}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isInactive}
                        className="text-btn"
                        onClick={() => copyLink(staffUrl, `staff-${col.id}`, "Staff Access Link")}
                        title="Copy Staff Login Link"
                        style={{ padding: "4px 8px", fontSize: "11px", color: isInactive ? "#94a3b8" : "#2563eb" }}
                      >
                        {copiedKey === `staff-${col.id}` ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{copiedKey === `staff-${col.id}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>

                    {/* STUDENT LINK */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#1e293b", overflow: "hidden" }}>
                        <GraduationCap size={14} color="#10b981" />
                        <span style={{ fontWeight: 600 }}>Student:</span>
                        <span style={{ color: "#64748b", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          /student/{(col.code || "").toLowerCase()}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isInactive}
                        className="text-btn"
                        onClick={() => copyLink(studentUrl, `student-${col.id}`, "Student Access Link")}
                        title="Copy Student Verification Link"
                        style={{ padding: "4px 8px", fontSize: "11px", color: isInactive ? "#94a3b8" : "#10b981" }}
                      >
                        {copiedKey === `student-${col.id}` ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                        <span>{copiedKey === `student-${col.id}` ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS: EDIT DETAILS & DEACTIVATE */}
                  <div className="form-actions-modal" style={{ marginTop: "12px", padding: 0, gap: "10px" }}>
                    <button
                      className="primary-button"
                      style={{ flex: 1, padding: "8px 12px", justifyContent: "center", fontSize: "13px" }}
                      onClick={() => handleOpenEdit(col)}
                    >
                      <Pencil size={14} />
                      <span>Edit Details</span>
                    </button>
                    <button
                      className="outline-button"
                      style={{ flex: 1, padding: "8px 12px", justifyContent: "center", fontSize: "13px" }}
                      onClick={() => handleToggle(col)}
                    >
                      {col.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ----------------------------------------------------
            EDIT COLLEGE DETAILS MODAL
            ---------------------------------------------------- */}
        {editingCollege && (
          <div className="slot-modal-backdrop" onClick={() => setEditingCollege(null)}>
            <div
              className="slot-modal"
              style={{ maxWidth: "540px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="slot-modal-header">
                <div>
                  <h3>Edit College Details</h3>
                  <p>Update institution information, code, category and contact records.</p>
                </div>
                <button
                  type="button"
                  className="slot-modal-close"
                  onClick={() => setEditingCollege(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="modal-form-body">
                {formError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#b91c1c",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label>Institution Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="e.g., St. Xavier Institute of Technology"
                    required
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>College Code / Slug *</label>
                    <input
                      type="text"
                      value={editFormData.code}
                      onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., SXIT"
                      required
                    />
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      Staff & Student URLs: /staff/{(editFormData.code || "").toLowerCase()}
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Institutional Category *</label>
                    <select
                      value={editFormData.college_type}
                      onChange={(e) => setEditFormData({ ...editFormData, college_type: e.target.value })}
                      required
                    >
                      <option value="BTECH">B.Tech Engineering (HOD Model)</option>
                      <option value="DEGREE">Degree College (B.Sc / B.Com / B.A)</option>
                      <option value="JUNIOR_COLLEGE">Junior College (Intermediate)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Campus Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    placeholder="e.g., Knowledge Park, Hi-Tech City, Hyderabad"
                  />
                </div>

                <div className="form-row-two">
                  <div className="form-group">
                    <label>Official Contact Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="admin@institution.edu"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      placeholder="+91 98888 12345"
                    />
                  </div>
                </div>

                {/* INSTITUTIONAL LOGO */}
                <div className="form-group">
                  <label>Institutional Logo (Image URL or File)</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="https://example.com/logo.png or browse file"
                      value={editFormData.logo || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, logo: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <label
                      style={{
                        padding: "9px 14px",
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#334155",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setEditFormData((prev) => ({ ...prev, logo: ev.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editFormData.logo && (
                      <button
                        type="button"
                        onClick={() => setEditFormData((prev) => ({ ...prev, logo: "" }))}
                        style={{
                          padding: "9px 12px",
                          background: "#fee2e2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {editFormData.logo && (
                    <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          padding: "3px",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img src={editFormData.logo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Logo preview</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Portal Access Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  >
                    <option value="active">Active (Staff & Student access live)</option>
                    <option value="inactive">Suspended (Access disabled)</option>
                  </select>
                </div>

                <div className="form-actions-modal" style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setEditingCollege(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button" disabled={saving}>
                    <Save size={16} />
                    <span>{saving ? "Saving Changes..." : "Save College Details"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Colleges;
