import { Grid, Shield, School, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";

function AdminSections() {
  const navigate = useNavigate();
  const { courses, facultyMembers, students } = useCollege();

  // Aggregate sections dynamically from courses
  const sectionCards = [];
  courses.forEach((c) => {
    Object.entries(c.sections || {}).forEach(([yr, secs]) => {
      secs.forEach((sec) => {
        const matchingStudents = students.filter(
          (s) => s.course === c.name && s.year === yr && s.section === sec
        );
        const inchargeFac = facultyMembers.find((f) =>
          (f.assignedSections || []).some(
            (as) => as.includes(c.name) && as.includes(sec)
          )
        );
        sectionCards.push({
          course: c.name,
          year: yr,
          section: sec,
          incharge: inchargeFac?.name || "Not Assigned",
          studentsCount: matchingStudents.length || 0,
          room: "Assigned Room",
          subjectsCount: 5,
        });
      });
    });
  });

  return (
    <AppLayout>
      <div className="admin-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Academic Structure</p>
            <h1>Class Sections & Incharges</h1>
            <p className="page-description">
              Class sections, designated room locations, and assigned faculty incharges.
            </p>
          </div>
        </div>

        {/* SECTIONS GRID */}
        {sectionCards.length === 0 ? (
          <div className="card-box" style={{ textAlign: "center", padding: "48px 24px" }}>
            <Grid size={40} color="#94a3b8" style={{ marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#1e293b" }}>No Class Sections Configured Yet</h3>
            <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: "14px" }}>
              Configure your academic programs and sections under Courses to view class sections here.
            </p>
            <button
              className="primary-button"
              onClick={() => navigate("/admin/courses")}
              style={{ margin: "0 auto" }}
            >
              <Plus size={16} />
              <span>Configure Courses & Sections</span>
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {sectionCards.map((sec, idx) => (
              <div className="admin-course-card" key={idx}>
                <div className="course-card-top">
                  <div className="course-icon-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                    <Grid size={22} />
                  </div>
                  <div>
                    <div className="course-badge" style={{ background: "#dcfce7", color: "#15803d" }}>
                      {sec.section}
                    </div>
                    <h2>{sec.course}</h2>
                    <p>{sec.year}</p>
                  </div>
                </div>

                <div className="course-details-box">
                  <div className="detail-row">
                    <span>Section Incharge:</span>
                    <strong style={{ color: "#2563eb", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <Shield size={13} />
                      {sec.incharge}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Enrolled Strength:</span>
                    <strong>{sec.studentsCount} Students</strong>
                  </div>
                  <div className="detail-row">
                    <span>Room:</span>
                    <strong>{sec.room}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default AdminSections;
