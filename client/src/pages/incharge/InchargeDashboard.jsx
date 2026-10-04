import { useNavigate } from "react-router-dom";
import {
  Shield,
  GraduationCap,
  CalendarDays,
  ClipboardCheck,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { getScheduleForSection } from "../../services/timetableService";
import StatCounter from "../../components/common/StatCounter";

function InchargeDashboard() {
  const navigate = useNavigate();
  const { currentUser, students, attendanceLogs } = useCollege();

  const assignedSection = currentUser?.assignedSection || "B.Tech - CSE • 2nd Year • Section A";
  const course = "B.Tech - CSE";
  const year = "2nd Year";
  const section = "Section A";

  // Section students
  const sectionStudents = students.filter(
    (s) => s.course === course && s.year === year && s.section === section
  );

  // Section attendance average
  const sectionAttendanceLogs = attendanceLogs.filter(
    (l) => l.course === course && l.year === year && l.section === section
  );
  const avgAttendance = 88.2;

  // Today's classes for this section
  const todayClasses = getScheduleForSection(course, year, section, "Thursday");

  return (
    <AppLayout>
      <div className="incharge-dashboard-page page-container-animated">
        {/* BANNER */}
        <div className="incharge-banner">
          <div>
            <div className="incharge-badge">
              <Shield size={14} />
              <span>Section Supervision Portal</span>
            </div>
            <h1>{assignedSection}</h1>
            <p className="page-description">
              Incharge: {currentUser?.name || "Dr. Meera Nambiar"} • Academic & Disciplinary Oversight
            </p>
          </div>

          <div className="incharge-quick-stat">
            <span>Section Attendance</span>
            <strong><StatCounter value={avgAttendance} decimals={1} suffix="%" /></strong>
            <small>{sectionStudents.length} Registered Students</small>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="admin-stats-grid">
          <div
            className="admin-stat-card"
            onClick={() => navigate("/incharge/students")}
          >
            <div className="stat-icon-box blue">
              <GraduationCap size={24} />
            </div>
            <div className="stat-details">
              <span>Class Strength</span>
              <strong><StatCounter value={sectionStudents.length} /> Students</strong>
              <small className="stat-growth green-text">
                <TrendingUp size={12} /> 100% Enrollment
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/incharge/attendance")}
          >
            <div className="stat-icon-box green">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <span>Section Attendance</span>
              <strong><StatCounter value={avgAttendance} decimals={1} suffix="%" /></strong>
              <small className="stat-sub">
                {sectionAttendanceLogs.length} Sessions Logged
              </small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/incharge/schedule")}
          >
            <div className="stat-icon-box orange">
              <CalendarDays size={24} />
            </div>
            <div className="stat-details">
              <span>Today's Lectures</span>
              <strong><StatCounter value={todayClasses.length} /> Classes</strong>
              <small className="stat-sub">Room 204</small>
            </div>
          </div>

          <div
            className="admin-stat-card"
            onClick={() => navigate("/incharge/reports")}
          >
            <div className="stat-icon-box purple">
              <BarChart3 size={24} />
            </div>
            <div className="stat-details">
              <span>Section Health</span>
              <strong>Good Standing</strong>
              <small className="stat-growth green-text">3 Students at Risk</small>
            </div>
          </div>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="admin-grid-two-columns">
          {/* TODAY'S SCHEDULE FOR THIS SECTION */}
          <div className="card-box">
            <div className="card-box-header">
              <div>
                <h2>Section Lecture Schedule (Thursday)</h2>
                <p>Lectures assigned to {year} {section}</p>
              </div>
              <button
                className="text-btn"
                onClick={() => navigate("/incharge/schedule")}
              >
                Full Timetable
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Faculty</th>
                    <th>Classroom</th>
                  </tr>
                </thead>
                <tbody>
                  {todayClasses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-table-cell">
                        No lectures scheduled today.
                      </td>
                    </tr>
                  ) : (
                    todayClasses.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <span className="time-badge">{item.time}</span>
                        </td>
                        <td>
                          <strong>{item.subject}</strong>
                        </td>
                        <td>{item.facultyName}</td>
                        <td>{item.room || "Room 204"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE: SECTION SUPERVISION LINKS */}
          <div className="admin-sidebar-cards">
            <div className="card-box">
              <div className="card-box-header">
                <h2>Incharge Responsibilities</h2>
              </div>
              <div className="quick-actions-list">
                <button
                  className="quick-action-item"
                  onClick={() => navigate("/incharge/attendance")}
                >
                  <ClipboardCheck size={18} className="blue-text" />
                  <div>
                    <strong>Audit Attendance</strong>
                    <small>Review attendance logs & absent lists</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/incharge/students")}
                >
                  <GraduationCap size={18} className="green-text" />
                  <div>
                    <strong>Student Registry</strong>
                    <small>Inspect roll numbers 2301 to 2340</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/incharge/reports")}
                >
                  <BarChart3 size={18} className="purple-text" />
                  <div>
                    <strong>Disciplinary & Marks Report</strong>
                    <small>Identify attendance shortages early</small>
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

export default InchargeDashboard;
