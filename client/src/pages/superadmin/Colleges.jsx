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
  ExternalLink,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function Colleges() {
  const navigate = useNavigate();
  const { colleges, updateCollegeStatus } = useCollege();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedKey, setCopiedKey] = useState("");

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
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
            const staffUrl = `${window.location.origin}/staff/${col.code.toLowerCase()}`;
            const studentUrl = `${window.location.origin}/student/${col.code.toLowerCase()}`;
            const isInactive = col.status === "inactive";

            return (
              <div className="admin-course-card" key={col.id}>
                <div className="course-card-top">
                  <div className="course-icon-box" style={{ background: isInactive ? "#f1f5f9" : "#eff6ff", color: isInactive ? "#94a3b8" : "#2563eb" }}>
                    <Building size={22} />
                  </div>
                  <div>
                    <div className="course-badge">{col.code}</div>
                    <h2>{col.name}</h2>
                    <p>{col.address || "Main Campus"}</p>
                  </div>
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
                        /staff/{col.code.toLowerCase()}
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
                        /student/{col.code.toLowerCase()}
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

                <div className="form-actions-modal" style={{ marginTop: "10px", padding: 0 }}>
                  <button
                    className="outline-button"
                    style={{ flex: 1, padding: "8px", justifyContent: "center" }}
                    onClick={() => handleToggle(col)}
                  >
                    {col.status === "active" ? "Deactivate Institution" : "Activate Institution"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Colleges;
