import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Grid,
  ClipboardCheck,
  BarChart3,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import StatCounter from "../../components/common/StatCounter";

function PrincipalDashboard() {
  const navigate = useNavigate();
  const { students, facultyMembers, courses } = useCollege();

  const totalStudents = students.length;
  const totalFaculty = facultyMembers.length;

  const totalSections = courses.reduce((acc, c) => {
    let count = 0;
    Object.values(c.sections || {}).forEach((arr) => {
      count += arr.length;
    });
    return acc + count;
  }, 0);

  // College-wide daily attendance stats
  const collegePresentCount = 186;
  const collegeAbsentCount = 24;
  const collegeTotalToday = collegePresentCount + collegeAbsentCount;
  const collegeAttendancePct = Math.round(
    (collegePresentCount / collegeTotalToday) * 100
  );

  const deptStats = [
    {
      name: "Computer Science & Engineering",
      students: 118,
      faculty: 3,
      attendance: 88.5,
    },
    {
      name: "Electronics & Communication",
      students: 75,
      faculty: 2,
      attendance: 85.0,
    },
    {
      name: "Sciences & Mathematics",
      students: 40,
      faculty: 1,
      attendance: 91.2,
    },
  ];

  return (
    <AppLayout>
      <div className="principal-dashboard-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Principal / Executive Dashboard</p>
            <h1>College Leadership Overview</h1>
            <p className="page-description">
              Institutional performance, academic governance, and campus attendance metrics.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="primary-button"
              onClick={() => navigate("/principal/attendance")}
            >
              <ClipboardCheck size={16} />
              <span>Audit Attendance</span>
            </button>
            <button
              className="outline-button"
              onClick={() => navigate("/principal/reports")}
            >
              <BarChart3 size={16} />
              <span>Institutional Reports</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon-box blue">
              <GraduationCap size={24} />
            </div>
            <div className="stat-details">
              <span>Total Students</span>
              <strong><StatCounter value={totalStudents} /></strong>
              <small className="stat-sub">Across All Programs</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box green">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <span>Teaching Faculty</span>
              <strong><StatCounter value={totalFaculty} /> Professors</strong>
              <small className="stat-growth green-text">Full Staffing</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box purple">
              <Grid size={24} />
            </div>
            <div className="stat-details">
              <span>Class Sections</span>
              <strong><StatCounter value={totalSections} /> Active</strong>
              <small className="stat-sub">Fully Supervised</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon-box orange">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <span>College Attendance</span>
              <strong><StatCounter value={collegeAttendancePct} suffix="%" /> Today</strong>
              <small className="stat-sub">
                {collegePresentCount} Present • {collegeAbsentCount} Absent
              </small>
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="admin-grid-two-columns">
          {/* DEPARTMENT PERFORMANCE TABLE */}
          <div className="card-box">
            <div className="card-box-header">
              <div>
                <h2>Department Academic Benchmark</h2>
                <p>Enrollment and attendance statistics by academic department</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Average Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {deptStats.map((d, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{d.name}</strong>
                      </td>
                      <td>{d.students} Students</td>
                      <td>{d.faculty} Faculty</td>
                      <td>
                        <span className="attendance-pill high">
                          {d.attendance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE: RECENT ATTENDANCE SESSIONS & ACTIONS */}
          <div className="admin-sidebar-cards">
            {/* AUDIT SUMMARY */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Today's Attendance Summary</h2>
              </div>
              <div className="principal-att-summary-box">
                <div className="att-count-badge green-bg">
                  <CheckCircle size={20} className="green-text" />
                  <div>
                    <strong>{collegePresentCount}</strong>
                    <span>Students Present</span>
                  </div>
                </div>

                <div className="att-count-badge red-bg">
                  <XCircle size={20} className="red-text" />
                  <div>
                    <strong>{collegeAbsentCount}</strong>
                    <span>Students Absent</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  className="full-width-btn primary-button"
                  onClick={() => navigate("/principal/attendance")}
                >
                  <span>Open Full College Attendance View</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Administrative Navigation</h2>
              </div>
              <div className="quick-actions-list">
                <button
                  className="quick-action-item"
                  onClick={() => navigate("/principal/faculty")}
                >
                  <Users size={18} className="blue-text" />
                  <div>
                    <strong>Faculty Roster</strong>
                    <small>Inspect credentials and workloads</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/principal/students")}
                >
                  <GraduationCap size={18} className="green-text" />
                  <div>
                    <strong>Student Registry</strong>
                    <small>Enrollment and compliance metrics</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/principal/reports")}
                >
                  <BarChart3 size={18} className="purple-text" />
                  <div>
                    <strong>Reports & Archives</strong>
                    <small>Institutional accreditation summaries</small>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default PrincipalDashboard;
