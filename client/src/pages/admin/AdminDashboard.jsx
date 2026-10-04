import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Layers,
  CalendarDays,
  ClipboardCheck,
  Plus,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import StatCounter from "../../components/common/StatCounter";
import CollegeLogoManager from "../../components/common/CollegeLogoManager";

function AdminDashboard() {
  const navigate = useNavigate();
  const {
    students,
    facultyMembers,
    courses,
    assignments,
    attendanceLogs,
  } = useCollege();

  // Aggregate stats
  const totalStudents = students.length;
  const totalFaculty = facultyMembers.length;
  const totalCourses = courses.length;

  const totalSections = courses.reduce((acc, c) => {
    let count = 0;
    Object.values(c.sections || {}).forEach((arr) => {
      count += arr.length;
    });
    return acc + count;
  }, 0);

  // Today's classes (Thursday demo date)
  const todayDay = "Thursday";
  const todaysClasses = [];
  assignments.forEach((cls) => {
    cls.schedule?.forEach((s) => {
      if (s.day === todayDay) {
        todaysClasses.push({
          subject: cls.subject,
          course: cls.course,
          year: cls.year,
          section: cls.section,
          faculty: cls.facultyName || "Assigned Faculty",
          time: s.time,
          period: s.period,
          room: cls.room,
        });
      }
    });
  });

  // Recent attendance
  const recentAttendance = attendanceLogs.slice(0, 3);
  const avgAttendance = 88.5;

  return (
    <AppLayout>
      <div className="admin-dashboard-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Admin / Overview</p>
            <h1>Administrator Dashboard</h1>
            <p className="page-description">
              Campus overview, department management, and academic operations.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="primary-button"
              onClick={() => navigate("/admin/timetable")}
            >
              <Plus size={16} />
              <span>Assign Timetable</span>
            </button>
            <button
              className="outline-button"
              onClick={() => navigate("/admin/faculty")}
            >
              <Users size={16} />
              <span>Manage Faculty</span>
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card" onClick={() => navigate("/admin/students")}>
            <div className="stat-icon-box blue">
              <GraduationCap size={24} />
            </div>
            <div className="stat-details">
              <span>Total Students</span>
              <strong><StatCounter value={totalStudents} /></strong>
              <small className="stat-growth green-text">
                <TrendingUp size={12} /> Active Enrollment
              </small>
            </div>
          </div>

          <div className="admin-stat-card" onClick={() => navigate("/admin/faculty")}>
            <div className="stat-icon-box green">
              <Users size={24} />
            </div>
            <div className="stat-details">
              <span>Faculty Members</span>
              <strong><StatCounter value={totalFaculty} /></strong>
              <small className="stat-sub">Across 3 Departments</small>
            </div>
          </div>

          <div className="admin-stat-card" onClick={() => navigate("/admin/courses")}>
            <div className="stat-icon-box purple">
              <Layers size={24} />
            </div>
            <div className="stat-details">
              <span>Programs & Courses</span>
              <strong><StatCounter value={totalCourses} /></strong>
              <small className="stat-sub">{totalSections} Active Sections</small>
            </div>
          </div>

          <div className="admin-stat-card" onClick={() => navigate("/admin/reports")}>
            <div className="stat-icon-box orange">
              <ClipboardCheck size={24} />
            </div>
            <div className="stat-details">
              <span>Overall Attendance</span>
              <strong><StatCounter value={avgAttendance} decimals={1} suffix="%" /></strong>
              <small className="stat-growth green-text">
                {attendanceLogs.length} Sessions Logged
              </small>
            </div>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="admin-grid-two-columns">
          {/* TODAY'S CLASSES */}
          <div className="card-box">
            <div className="card-box-header">
              <div>
                <h2>Today's College Classes ({todayDay})</h2>
                <p>Real-time class schedules across sections</p>
              </div>
              <button
                className="text-btn"
                onClick={() => navigate("/admin/timetable")}
              >
                <span>View Timetable</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Subject & Faculty</th>
                    <th>Class / Section</th>
                    <th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysClasses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty-table-cell">
                        No classes scheduled for today.
                      </td>
                    </tr>
                  ) : (
                    todaysClasses.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="time-badge">{item.time}</span>
                        </td>
                        <td>
                          <strong>{item.subject}</strong>
                          <span className="sub-faculty-name">{item.faculty}</span>
                        </td>
                        <td>
                          {item.course} • {item.year} ({item.section})
                        </td>
                        <td>
                          <span className="room-badge">{item.room || "Room 204"}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: QUICK STATS & RECENT ATTENDANCE */}
          <div className="admin-sidebar-cards">
            {/* QUICK ACTIONS */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Quick Management</h2>
              </div>
              <div className="quick-actions-list">
                <button
                  className="quick-action-item"
                  onClick={() => navigate("/admin/faculty")}
                >
                  <Users size={18} className="blue-text" />
                  <div>
                    <strong>Add / Manage Faculty</strong>
                    <small>Departments, credentials & assignments</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/admin/students")}
                >
                  <GraduationCap size={18} className="green-text" />
                  <div>
                    <strong>Add / Manage Students</strong>
                    <small>Enrollment, sections & roll numbers</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/admin/timetable")}
                >
                  <CalendarDays size={18} className="purple-text" />
                  <div>
                    <strong>Timetable & Section Allocation</strong>
                    <small>Assign faculty, subjects, days & times</small>
                  </div>
                </button>

                <button
                  className="quick-action-item"
                  onClick={() => navigate("/admin/courses")}
                >
                  <Layers size={18} className="orange-text" />
                  <div>
                    <strong>Courses & Curriculum</strong>
                    <small>Degrees, years, sections & subjects</small>
                  </div>
                </button>
              </div>
            </div>

            {/* RECENT ATTENDANCE SESSIONS */}
            <div className="card-box">
              <div className="card-box-header">
                <h2>Recent Attendance Sessions</h2>
                <button
                  className="text-btn"
                  onClick={() => navigate("/admin/reports")}
                >
                  Audit
                </button>
              </div>
              <div className="recent-attendance-list">
                {recentAttendance.map((log) => (
                  <div key={log.id} className="recent-log-item">
                    <div className="log-icon">
                      <ClipboardCheck size={18} />
                    </div>
                    <div className="log-info">
                      <strong>{log.subject}</strong>
                      <p>
                        {log.year} • {log.section} ({log.date})
                      </p>
                    </div>
                    <div className="log-stats">
                      <span className="present-pill">
                        {log.presentCount} / {log.totalStudents}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* INSTITUTIONAL BRANDING & LOGO CONTROL */}
        <CollegeLogoManager />
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;
