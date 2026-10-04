import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import StatCounter from "../../components/common/StatCounter";

function HodDashboard() {
  const navigate = useNavigate();
  const { currentUser, students, facultyMembers, attendanceLogs } =
    useCollege();

  const deptName = currentUser?.department || "Computer Science & Engineering";

  // Department-specific filtered data
  const deptFaculty = facultyMembers.filter(
    (f) => !f.department || f.department.toLowerCase().includes("computer") || f.department === deptName
  );
  const deptStudents = students.filter(
    (s) => s.course.includes("CSE") || s.course.includes("Computer")
  );
  const deptAttendance = attendanceLogs.filter(
    (l) => l.course.includes("CSE") || l.course.includes("Computer")
  );

  return (
    <AppLayout>
      <div className="incharge-dashboard-page page-container-animated">
        {/* BANNER */}
        <div className="incharge-banner">
          <div>
            <div className="incharge-badge" style={{ background: "#e0e7ff", color: "#3730a3" }}>
              <Shield size={14} />
              <span>Department Head Portal (B.Tech Authority)</span>
            </div>
            <h1>Department of {deptName}</h1>
            <p className="page-description">
              HOD: {currentUser?.name || "Dr. Anand Raman"} • Academic, Faculty & Student Governance
            </p>
          </div>

          <div className="incharge-quick-stat">
            <span>Dept. Attendance Rate</span>
            <strong><StatCounter value={88.4} decimals={1} suffix="%" /></strong>
            <small>{deptStudents.length} Students Across All Batches</small>
          </div>
        </div>

        {/* METRICS */}
        <div className="admin-stats-grid">
          <div
            className="admin-stat-card"
            onClick={() => navigate("/hod/faculty")}
          >
            <div className="stat-icon-box blue">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <span>Department Faculty</span>
              <strong><StatCounter value={deptFaculty.length} /> Professors</strong>
              <small className="stat-growth green-text">
                <TrendingUp size={12} /> Active Teaching Staff
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/hod/students")}
          >
            <div className="stat-icon-box green">
              <GraduationCap size={24} />
            </div>
            <div className="stat-details">
              <span>Enrolled Students</span>
              <strong><StatCounter value={deptStudents.length} /> Students</strong>
              <small className="stat-sub">B.Tech CSE Batches</small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/hod/attendance")}
          >
            <div className="stat-icon-box orange">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <span>Attendance Sessions</span>
              <strong><StatCounter value={deptAttendance.length} /> Audited Logs</strong>
              <small className="stat-sub">Daily Department Oversight</small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/hod/reports")}
          >
            <div className="stat-icon-box purple">
              <BarChart3 size={24} />
            </div>
            <div className="stat-details">
              <span>Academic Performance</span>
              <strong><StatCounter value={89} suffix="%" /> Pass Metric</strong>
              <small className="stat-growth green-text">Mid Assessment Benchmark</small>
            </div>
          </div>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="admin-grid-two-columns">
          {/* DEPARTMENT CLASSES SCHEDULE */}
          <div className="card-box">
            <div className="card-box-header">
              <div>
                <h2>Active Department Classes (Thursday)</h2>
                <p>Ongoing lectures across CSE sections</p>
              </div>
              <button
                className="text-btn"
                onClick={() => navigate("/hod/schedule")}
              >
                <span>Full Timetable</span>
              </button>
            </div>

            <div className="student-classes-timeline">
              <div className="timeline-class-item">
                <div className="timeline-time">
                  <span>09:00 AM</span>
                  <small>Period 1</small>
                </div>
                <div className="timeline-details">
                  <h3>Database Management Systems</h3>
                  <p>Prof. Rajesh Kumar • Room 204 • 2nd Year Sec A</p>
                </div>
                <div className="timeline-badge">
                  <span className="live-status-pill">Active</span>
                </div>
              </div>

              <div className="timeline-class-item">
                <div className="timeline-time">
                  <span>10:00 AM</span>
                  <small>Period 2</small>
                </div>
                <div className="timeline-details">
                  <h3>Database Management Systems</h3>
                  <p>Prof. Rajesh Kumar • Room 205 • 2nd Year Sec B</p>
                </div>
                <div className="timeline-badge">
                  <span className="live-status-pill">Active</span>
                </div>
              </div>

              <div className="timeline-class-item">
                <div className="timeline-time">
                  <span>11:15 AM</span>
                  <small>Period 3</small>
                </div>
                <div className="timeline-details">
                  <h3>Operating Systems</h3>
                  <p>Prof. Rajesh Kumar • Room 301 • 3rd Year Sec A</p>
                </div>
                <div className="timeline-badge">
                  <span className="live-status-pill">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* FACULTY WORKLOAD SNAPSHOT */}
          <div className="admin-sidebar-cards">
            <div className="card-box">
              <div className="card-box-header">
                <h2>Teaching Staff Allocation</h2>
                <button
                  className="text-btn"
                  onClick={() => navigate("/hod/faculty")}
                >
                  View All
                </button>
              </div>

              <div className="mini-marks-list">
                {deptFaculty.map((f) => (
                  <div className="mini-mark-row" key={f.id}>
                    <div>
                      <strong>{f.name}</strong>
                      <small className="text-muted d-block">{f.designation}</small>
                    </div>
                    <span className="section-pill">{f.subjects?.length || 2} Subjects</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default HodDashboard;
