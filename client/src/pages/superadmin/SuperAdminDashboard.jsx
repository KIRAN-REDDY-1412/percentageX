import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  School,
  Plus,
  Users,
  GraduationCap,
  ShieldCheck,
  Building,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import StatCounter from "../../components/common/StatCounter";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { colleges, fetchColleges, updateCollegeStatus } = useCollege();

  useEffect(() => {
    if (fetchColleges) {
      fetchColleges();
    }
  }, []);

  const totalColleges = colleges.length;
  const btechColleges = colleges.filter((c) => c.college_type === "BTECH").length;
  const degreeColleges = colleges.filter((c) => c.college_type === "DEGREE").length;
  const juniorColleges = colleges.filter(
    (c) => c.college_type === "JUNIOR_COLLEGE"
  ).length;

  const handleToggleStatus = async (col) => {
    const newStatus = col.status === "active" ? "inactive" : "active";
    if (updateCollegeStatus) {
      await updateCollegeStatus(col.id, newStatus);
    }
  };

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <div className="incharge-badge" style={{ background: "#fef3c7", color: "#92400e" }}>
              <ShieldCheck size={14} />
              <span>Platform Multi-Tenant Master Control</span>
            </div>
            <h1>Super Admin Global Portal</h1>
            <p className="page-description">
              Manage all institutions across B.Tech, Degree, and Junior College structures.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/super-admin/colleges/create")}
          >
            <Plus size={16} />
            <span>Register New College</span>
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-box purple">
              <Building size={24} />
            </div>
            <div className="stat-details">
              <span>Total Colleges</span>
              <strong><StatCounter value={totalColleges} /> Institutions</strong>
              <small className="stat-sub">
                {colleges.filter((c) => c.status === "active").length} Active on Platform
              </small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box blue">
              <School size={24} />
            </div>
            <div className="stat-details">
              <span>B.Tech Colleges</span>
              <strong><StatCounter value={btechColleges} /> Institutes</strong>
              <small className="stat-sub">HOD & Branch System</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box green">
              <GraduationCap size={24} />
            </div>
            <div className="stat-details">
              <span>Degree Colleges</span>
              <strong><StatCounter value={degreeColleges} /> Institutes</strong>
              <small className="stat-sub">B.Sc, B.Com, B.A Programs</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box orange">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <span>Junior Colleges</span>
              <strong><StatCounter value={juniorColleges} /> Institutes</strong>
              <small className="stat-sub">Intermediate & Junior High</small>
            </div>
          </div>
        </div>

        {/* REGISTERED COLLEGES TABLE */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h2>Institutional Network Registry ({colleges.length})</h2>
              <p>Platform colleges with tenant isolation and role permissions</p>
            </div>
            <button
              className="outline-button"
              onClick={() => navigate("/super-admin/colleges")}
            >
              <span>Manage Colleges</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>College Name</th>
                  <th>Code</th>
                  <th>Institutional Type</th>
                  <th>Contact Info</th>
                  <th>Faculty Count</th>
                  <th>Students Enrolled</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-table-cell">
                      No colleges registered yet. Click "Register New College" to add one.
                    </td>
                  </tr>
                ) : (
                  colleges.map((col) => (
                    <tr key={col.id}>
                      <td>
                        <strong>{col.name}</strong>
                        <small className="text-muted d-block">{col.address || "Main Campus"}</small>
                      </td>
                      <td>
                        <span className="roll-badge">{col.code}</span>
                      </td>
                      <td>
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
                            ? "B.Tech Engineering"
                            : col.college_type === "DEGREE"
                            ? "Degree College"
                            : "Junior College"}
                        </span>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <small>{col.email || "info@college.edu"}</small>
                          <small className="text-muted">{col.phone || "N/A"}</small>
                        </div>
                      </td>
                      <td>
                        <strong>{col.faculty_count || 4} Faculty</strong>
                      </td>
                      <td>
                        <strong>{col.students_count || 40} Students</strong>
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            col.status === "active" ? "active" : "inactive"
                          }`}
                        >
                          {col.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions-cell">
                          <button
                            className="outline-button"
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            onClick={() => handleToggleStatus(col)}
                          >
                            {col.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default SuperAdminDashboard;
